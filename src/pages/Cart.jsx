import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
    Container,
    Box,
    Typography,
    Paper,
    Grid,
    IconButton,
    Button,
    Divider
} from '@mui/material';
import {
    ShoppingBag,
    Add,
    Remove,
    Delete,
    ArrowForward
} from '@mui/icons-material';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartCount, clearCart } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <Container sx={{ py: 8 }}>
                <Paper
                    sx={{
                        p: 8,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                        border: '1px solid #d4af37'
                    }}
                >
                    <ShoppingBag sx={{ fontSize: 80, color: '#666', mb: 3 }} />
                    <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
                        Your cart is empty
                    </Typography>
                    <Typography sx={{ color: '#999', mb: 4 }}>
                        Add products to your cart to see them here
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/products')}
                        sx={{
                            backgroundColor: '#d4af37',
                            color: '#1a1a1a',
                            fontWeight: 'bold',
                            '&:hover': { backgroundColor: '#c19b2a' }
                        }}
                    >
                        Browse Products
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                    Shopping Cart
                </Typography>
                <Button
                    variant="outlined"
                    onClick={clearCart}
                    sx={{
                        color: '#f44336',
                        borderColor: '#f44336',
                        '&:hover': { borderColor: '#d32f2f', backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                    }}
                >
                    Clear Cart
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Cart Items */}
                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            p: 3,
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                            border: '1px solid #d4af37'
                        }}
                    >
                        {cartItems.map((item) => (
                            <Box key={item._id} mb={3}>
                                <Grid container spacing={2} alignItems="center">
                                    {/* Product Image */}
                                    <Grid item xs={3}>
                                        <Box
                                            component="img"
                                            src={item.images?.[0]?.url || 'https://via.placeholder.com/100'}
                                            alt={item.name}
                                            sx={{
                                                width: '100%',
                                                height: 100,
                                                objectFit: 'cover',
                                                borderRadius: 2,
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => navigate(`/products/${item._id}`)}
                                        />
                                    </Grid>

                                    {/* Product Info */}
                                    <Grid item xs={5}>
                                        <Typography
                                            variant="caption"
                                            sx={{ color: '#d4af37', fontWeight: 'bold', display: 'block' }}
                                        >
                                            {item.brand?.name}
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                mb: 1,
                                                cursor: 'pointer',
                                                '&:hover': { color: '#d4af37' }
                                            }}
                                            onClick={() => navigate(`/products/${item._id}`)}
                                        >
                                            {item.name}
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: '#d4af37' }}>
                                            Rs. {item.price.toLocaleString()}
                                        </Typography>
                                    </Grid>

                                    {/* Quantity Controls */}
                                    <Grid item xs={3}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <IconButton
                                                size="small"
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                sx={{
                                                    border: '1px solid #d4af37',
                                                    color: '#d4af37'
                                                }}
                                            >
                                                <Remove />
                                            </IconButton>
                                            <Typography sx={{ color: '#fff', minWidth: 30, textAlign: 'center' }}>
                                                {item.quantity}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                sx={{
                                                    border: '1px solid #d4af37',
                                                    color: '#d4af37'
                                                }}
                                            >
                                                <Add />
                                            </IconButton>
                                        </Box>
                                        <Typography variant="caption" sx={{ color: '#999', display: 'block', mt: 1 }}>
                                            Subtotal: Rs. {(item.price * item.quantity).toLocaleString()}
                                        </Typography>
                                    </Grid>

                                    {/* Remove Button */}
                                    <Grid item xs={1}>
                                        <IconButton
                                            onClick={() => removeFromCart(item._id)}
                                            sx={{ color: '#f44336' }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ mt: 3, backgroundColor: '#333' }} />
                            </Box>
                        ))}
                    </Paper>
                </Grid>

                {/* Cart Summary */}
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 3,
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                            border: '1px solid #d4af37',
                            position: 'sticky',
                            top: 80
                        }}
                    >
                        <Typography variant="h5" sx={{ color: '#d4af37', fontWeight: 'bold', mb: 3 }}>
                            Order Summary
                        </Typography>

                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography sx={{ color: '#999' }}>Items ({getCartCount()})</Typography>
                            <Typography sx={{ color: '#fff' }}>
                                Rs. {getCartTotal().toLocaleString()}
                            </Typography>
                        </Box>

                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography sx={{ color: '#999' }}>Shipping</Typography>
                            <Typography sx={{ color: '#fff' }}>Calculated at checkout</Typography>
                        </Box>

                        <Divider sx={{ my: 2, backgroundColor: '#d4af37' }} />

                        <Box display="flex" justifyContent="space-between" mb={3}>
                            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
                                Total
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                                Rs. {getCartTotal().toLocaleString()}
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            endIcon={<ArrowForward />}
                            onClick={() => navigate('/checkout')}
                            sx={{
                                backgroundColor: '#d4af37',
                                color: '#1a1a1a',
                                fontWeight: 'bold',
                                py: 1.5,
                                mb: 2,
                                '&:hover': { backgroundColor: '#c19b2a' }
                            }}
                        >
                            Proceed to Checkout
                        </Button>

                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate('/products')}
                            sx={{
                                color: '#d4af37',
                                borderColor: '#d4af37',
                                '&:hover': { borderColor: '#c19b2a', backgroundColor: 'rgba(212, 175, 55, 0.1)' }
                            }}
                        >
                            Continue Shopping
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Cart;
