import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { CreditCard } from '@mui/icons-material';
import axios from 'axios';

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#ffffff',
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#999999',
            },
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
        },
    },
};

const StripePaymentForm = ({ orderId, amount, onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Get client secret from backend
            const token = localStorage.getItem('token');
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/payments/stripe/initiate`,
                { orderId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const { clientSecret } = data.data;

            // Confirm payment with Stripe
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                setError(result.error.message);
                if (onError) onError(result.error);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    if (onSuccess) onSuccess(result.paymentIntent);
                }
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Payment failed. Please try again.';
            setError(errorMessage);
            if (onError) onError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#d4af37', display: 'flex', alignItems: 'center', gap: 1 }}>
                <CreditCard /> Pay with Card
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box
                sx={{
                    p: 2,
                    border: '1px solid #333',
                    borderRadius: 1,
                    bgcolor: '#1a1a1a',
                    mb: 2,
                }}
            >
                <CardElement options={CARD_ELEMENT_OPTIONS} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#999' }}>
                    Amount to pay:
                </Typography>
                <Typography variant="h6" sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                    Rs. {amount.toLocaleString()}
                </Typography>
            </Box>

            <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={!stripe || loading}
                sx={{
                    bgcolor: '#d4af37',
                    color: '#000',
                    fontWeight: 'bold',
                    py: 1.5,
                    '&:hover': {
                        bgcolor: '#c49f2f',
                    },
                    '&:disabled': {
                        bgcolor: '#666',
                        color: '#999',
                    },
                }}
            >
                {loading ? (
                    <CircularProgress size={24} sx={{ color: '#000' }} />
                ) : (
                    `Pay Rs. ${amount.toLocaleString()}`
                )}
            </Button>

            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#999', textAlign: 'center' }}>
                Your payment is secured by Stripe
            </Typography>
        </Box>
    );
};

export default StripePaymentForm;
