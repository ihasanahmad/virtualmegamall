import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Error } from '@mui/icons-material';

const PaymentFailure = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const errorMessage = new URLSearchParams(location.search).get('message') || 'Payment was unsuccessful';

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Paper
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        bgcolor: '#1a1a1a',
                        border: '1px solid #f44336',
                    }}
                >
                    <Error
                        sx={{
                            fontSize: 80,
                            color: '#f44336',
                            mb: 2,
                        }}
                    />

                    <Typography variant="h4" sx={{ color: '#f44336', mb: 2, fontWeight: 'bold' }}>
                        Payment Failed
                    </Typography>

                    <Typography variant="body1" sx={{ color: '#ccc', mb: 3 }}>
                        {errorMessage}
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#999', mb: 4 }}>
                        Don't worry, your order is still in your cart.
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/checkout')}
                            sx={{
                                bgcolor: '#d4af37',
                                color: '#000',
                                fontWeight: 'bold',
                                '&:hover': {
                                    bgcolor: '#c49f2f',
                                },
                            }}
                        >
                            Try Again
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => navigate('/cart')}
                            sx={{
                                borderColor: '#d4af37',
                                color: '#d4af37',
                                '&:hover': {
                                    borderColor: '#c49f2f',
                                    bgcolor: 'rgba(212, 175, 55, 0.1)',
                                },
                            }}
                        >
                            Back to Cart
                        </Button>

                        <Button
                            variant="text"
                            onClick={() => navigate('/')}
                            sx={{
                                color: '#999',
                                '&:hover': {
                                    color: '#ccc',
                                },
                            }}
                        >
                            Continue Shopping
                        </Button>
                    </Box>

                    <Box sx={{ mt: 4, p: 2, bgcolor: '#0a0a0a', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ color: '#999', display: 'block', mb: 1 }}>
                            Need help?
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#d4af37' }}>
                            Contact Support: support@virtualmegamall.com
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default PaymentFailure;
