import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = new URLSearchParams(location.search).get('orderId');

    useEffect(() => {
        // Could trigger confetti or celebration animation here
    }, []);

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Paper
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        bgcolor: '#1a1a1a',
                        border: '1px solid #d4af37',
                    }}
                >
                    <CheckCircle
                        sx={{
                            fontSize: 80,
                            color: '#4caf50',
                            mb: 2,
                        }}
                    />

                    <Typography variant="h4" sx={{ color: '#d4af37', mb: 2, fontWeight: 'bold' }}>
                        Payment Successful!
                    </Typography>

                    <Typography variant="body1" sx={{ color: '#ccc', mb: 1 }}>
                        Your order has been confirmed and is being processed.
                    </Typography>

                    {orderId && (
                        <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
                            Order ID: {orderId}
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
                        <Button
                            variant="contained"
                            onClick={() => navigate(`/orders`)}
                            sx={{
                                bgcolor: '#d4af37',
                                color: '#000',
                                fontWeight: 'bold',
                                '&:hover': {
                                    bgcolor: '#c49f2f',
                                },
                            }}
                        >
                            View Order Details
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => navigate('/')}
                            sx={{
                                borderColor: '#d4af37',
                                color: '#d4af37',
                                '&:hover': {
                                    borderColor: '#c49f2f',
                                    bgcolor: 'rgba(212, 175, 55, 0.1)',
                                },
                            }}
                        >
                            Continue Shopping
                        </Button>
                    </Box>

                    <Typography variant="caption" sx={{ display: 'block', mt: 3, color: '#999' }}>
                        A confirmation email has been sent to your registered email address.
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default PaymentSuccess;
