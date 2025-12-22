const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
            })
        });
    } catch (error) {
        console.error('Firebase Admin initialization error:', error);
    }
}

const db = admin.firestore();

module.exports = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        try {
            // Get line items from the session
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
                expand: ['data.price.product']
            });

            // Prepare order data
            const orderData = {
                userId: session.client_reference_id || session.metadata.userId,
                customerEmail: session.customer_details?.email || session.customer_email,
                amount: session.amount_total / 100, // Convert from paisa to rupees
                currency: session.currency.toUpperCase(),
                status: 'paid',
                paymentIntent: session.payment_intent,
                sessionId: session.id,
                items: lineItems.data.map(item => ({
                    name: item.description,
                    quantity: item.quantity,
                    amount: item.amount_total / 100
                })),
                shippingDetails: session.customer_details?.address || null,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            };

            // Save order to Firestore
            await db.collection('orders').add(orderData);

            // Clear user's cart
            if (session.client_reference_id || session.metadata.userId) {
                const userId = session.client_reference_id || session.metadata.userId;
                const cartRef = db.collection('users').doc(userId).collection('cart');
                const cartSnapshot = await cartRef.get();

                const batch = db.batch();
                cartSnapshot.docs.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
            }

            console.log('Order saved successfully:', session.id);

        } catch (error) {
            console.error('Error processing order:', error);
            return res.status(500).json({ error: 'Failed to process order' });
        }
    }

    // Return 200 to acknowledge receipt of the event
    res.json({ received: true });
};
