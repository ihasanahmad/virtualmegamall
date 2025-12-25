import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import {
    Container,
    Box,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    IconButton,
    Alert
} from '@mui/material';
import { Delete, ShoppingCart } from '@mui/icons-material';

const Wishlist = () => {
    const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = (product) => {
        addToCart(product);
        removeFromWishlist(product._id);
    };

    if (wishlist.length === 0) {
        return (
            <Container sx={{ py: 8 }}>
                <Alert severity="info">
                    Your wishlist is empty. Add products you love!
                </Alert>
                <Button
                    variant="contained"
                    onClick={() => navigate('/products')}
                    sx={{
                        mt: 2,
                        backgroundColor: '#d4af37',
                        color: '#1a1a1a',
                        '&:hover': { backgroundColor: '#c19b2a' }
                    }}
                >
                    Browse Products
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                    My Wishlist ({wishlist.length})
                </Typography>
                <Button
                    variant="outlined"
                    onClick={clearWishlist}
                    sx={{ color: '#f44336', borderColor: '#f44336' }}
                >
                    Clear All
                </Button>
            </Box>

            <Grid container spacing={3}>
                {wishlist.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: '#1a1a1a',
                                border: '1px solid #d4af37',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-4px)' }
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={product.images?.[0]?.url || 'https://via.placeholder.com/200'}
                                alt={product.name}
                                sx={{ objectFit: 'cover', cursor: 'pointer' }}
                                onClick={() => navigate(`/products/${product._id}`)}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography
                                    variant="h6"
                                    sx={{ color: '#fff', mb: 1, cursor: 'pointer' }}
                                    onClick={() => navigate(`/products/${product._id}`)}
                                >
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                                    Rs. {product.price?.toLocaleString()}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                <Button
                                    size="small"
                                    startIcon={<ShoppingCart />}
                                    onClick={() => handleAddToCart(product)}
                                    sx={{
                                        backgroundColor: '#d4af37',
                                        color: '#1a1a1a',
                                        '&:hover': { backgroundColor: '#c19b2a' }
                                    }}
                                >
                                    Add to Cart
                                </Button>
                                <IconButton
                                    size="small"
                                    onClick={() => removeFromWishlist(product._id)}
                                    sx={{ color: '#f44336' }}
                                >
                                    <Delete />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Wishlist;
