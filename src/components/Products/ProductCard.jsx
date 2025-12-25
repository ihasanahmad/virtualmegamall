import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useComparison } from '../../context/ComparisonContext';
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    IconButton,
    Chip,
    Rating
} from '@mui/material';
import {
    ShoppingCart,
    Compare,
    Visibility,
    LocalOffer
} from '@mui/icons-material';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { addToComparison, isInComparison, comparisonItems } = useComparison();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product);
        setMessage('Added to cart!');
        setTimeout(() => setMessage(''), 2000);
    };

    const handleAddToComparison = (e) => {
        e.stopPropagation();
        try {
            if (comparisonItems.length >= 4) {
                setMessage('Max 4 products allowed');
            } else if (isInComparison(product._id)) {
                setMessage('Already in comparison');
            } else {
                addToComparison(product);
                setMessage('Added to comparison!');
            }
            setTimeout(() => setMessage(''), 2000);
        } catch (error) {
            setMessage(error.message);
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const finalPrice = product.finalPrice || product.price;
    const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                    borderColor: '#d4af37',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(212, 175, 55, 0.2)'
                }
            }}
            onClick={() => navigate(`/products/${product._id}`)}
        >
            {/* Product Image */}
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="250"
                    image={product.images?.[0]?.url || 'https://via.placeholder.com/250'}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                />
                {hasDiscount && (
                    <Chip
                        icon={<LocalOffer />}
                        label={`${Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF`}
                        color="error"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            fontWeight: 'bold'
                        }}
                    />
                )}
                {product.inventory === 0 && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
                            OUT OF STOCK
                        </Typography>
                    </Box>
                )}
            </Box>

            <CardContent sx={{ flexGrow: 1 }}>
                {/* Brand */}
                <Typography variant="caption" sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                    {product.brand?.name || 'Brand'}
                </Typography>

                {/* Product Name */}
                <Typography
                    variant="h6"
                    sx={{
                        color: '#fff',
                        fontWeight: 'bold',
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}
                >
                    {product.name}
                </Typography>

                {/* Rating */}
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Rating value={product.averageRating || 0} readOnly size="small" />
                    <Typography variant="caption" sx={{ color: '#999' }}>
                        ({product.reviewCount || 0})
                    </Typography>
                </Box>

                {/* Price */}
                <Box>
                    <Typography variant="h5" sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                        Rs. {finalPrice.toLocaleString()}
                    </Typography>
                    {hasDiscount && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#666',
                                textDecoration: 'line-through'
                            }}
                        >
                            Rs. {product.compareAtPrice.toLocaleString()}
                        </Typography>
                    )}
                </Box>
            </CardContent>

            {/* Actions */}
            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Box display="flex" gap={1}>
                    <IconButton
                        size="small"
                        onClick={handleAddToComparison}
                        sx={{
                            color: isInComparison(product._id) ? '#d4af37' : '#999',
                            '&:hover': { color: '#d4af37' }
                        }}
                    >
                        <Compare />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/products/${product._id}`);
                        }}
                        sx={{ color: '#999', '&:hover': { color: '#d4af37' } }}
                    >
                        <Visibility />
                    </IconButton>
                </Box>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    disabled={product.inventory === 0}
                    sx={{
                        backgroundColor: '#d4af37',
                        color: '#1a1a1a',
                        fontWeight: 'bold',
                        '&:hover': { backgroundColor: '#c19b2a' },
                        '&:disabled': { backgroundColor: '#666', color: '#999' }
                    }}
                >
                    Add
                </Button>
            </CardActions>

            {/* Feedback Message */}
            {message && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(212, 175, 55, 0.9)',
                        color: '#1a1a1a',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.875rem',
                        fontWeight: 'bold'
                    }}
                >
                    {message}
                </Box>
            )}
        </Card>
    );
};

export default ProductCard;
