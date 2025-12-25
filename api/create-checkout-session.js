const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { items, userId, userEmail } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Create line items for Stripe
        const lineItems = items.map(item => {
            // Extract numeric price (remove "Rs." and commas)
            const priceInRupees = parseInt(item.price.replace(/[^0-9]/g, ''));
            const priceInPaisa = priceInRupees * 100; // Convert to paisa (smallest unit)

            return {
                price_data: {
                    currency: 'pkr',
                    product_data: {
                        name: item.name,
                        images: [item.imageUrl || 'https://via.placeholder.com/300'],
                        description: `${item.brand} - ${item.name}`
                    },
                    unit_amount: priceInPaisa
                },
                quantity: item.quantity
            };
        });

        // Calculate total for metadata
        const total = items.reduce((sum, item) => {
            const price = parseInt(item.price.replace(/[^0-9]/g, ''));
            return sum + (price * item.quantity);
        }, 0);

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.headers.origin || 'https://virtualmegamall.vercel.app'}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin || 'https://virtualmegamall.vercel.app'}/cart.html`,
            customer_email: userEmail,
            client_reference_id: userId,
            metadata: {
                userId: userId,
                itemCount: items.length.toString(),
                totalAmount: total.toString()
            }
        });

        return res.status(200).json({
            sessionId: session.id,
            url: session.url
        });

    } catch (error) {
        console.error('Stripe checkout session error:', error);
        return res.status(500).json({
            error: error.message || 'Failed to create checkout session'
        });
    }
};
