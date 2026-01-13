import { useState } from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { AccountBalance } from '@mui/icons-material';
import axios from 'axios';

const JazzCashForm = ({ orderId, amount, onSuccess, onError }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleJazzCashPayment = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/payments/jazzcash/initiate`,
                { orderId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const { formUrl, formData } = data.data;

            // Create form and submit
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = formUrl;

            Object.keys(formData).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = formData[key];
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'JazzCash payment initialization failed.';
            setError(errorMessage);
            if (onError) onError(err);
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#d4af37', display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalance /> Pay with JazzCash
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ mb: 2, p: 2, border: '1px solid #333', borderRadius: 1, bgcolor: '#1a1a1a' }}>
                <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                    You will be redirected to JazzCash payment gateway to complete your transaction.
                </Typography>
                <Typography variant="body2" sx={{ color: '#999' }}>
                    • Have your JazzCash account ready
                </Typography>
                <Typography variant="body2" sx={{ color: '#999' }}>
                    • Transaction is secure and encrypted
                </Typography>
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
                variant="contained"
                fullWidth
                onClick={handleJazzCashPayment}
                disabled={loading}
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
                    `Proceed to JazzCash - Rs. ${amount.toLocaleString()}`
                )}
            </Button>

            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#999', textAlign: 'center' }}>
                Powered by JazzCash Mobile Account
            </Typography>
        </Box>
    );
};

export default JazzCashForm;
