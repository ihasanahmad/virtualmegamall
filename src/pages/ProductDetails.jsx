import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useComparison } from '../context/Comparison Context';
import {
    Container,
    Grid,
    Box,
    Typography,
    Button,
    Paper,
    Chip,
    Rating,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    ShoppingCart,
    Compare,
    LocalOffer,
    CheckCircle,
    ArrowBack
} from '@mui/icons-material';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { addToComparison, isInComparison } = useComparison();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await productService.getProductById(id);
            setProduct(response.data);
        } catch (error) {
            console.error('Failed to fetch product:', error);
            setMessage({ type: 'error', text: 'Failed to load product' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setMessage({ type: 'success', text: `Added ${quantity} item(s) to cart!` });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleAddToComparison = () => {
        try {
            addToComparison(product);
            setMessage({ type: 'success', text: 'Added to comparison!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress sx={{ color: '#d4af37' }} />
            </Box>
        );
    }

    if (!product) {
        return (
            <Container sx={{ py: 4 }}>
                <Alert severity="error">Product not found</Alert>
            </Container>
        );
    }

    const finalPrice = product.finalPrice || product.price;
    const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
    const images = product.images || [];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Back Button */}
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/products')}
                sx={{ color: '#d4af37', mb: 3 }}
            >
                Back to Products
            </Button>

            {/* Message */}
            {message.text && (
                <Alert severity={message.type} sx={{ mb: 3 }}>
                    {message.text}
                </Alert>
            )}

            <Grid container spacing={4}>
                {/* Image Gallery */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 2,
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                            border: '1px solid #d4af37'
                        }}
                    >
                        {/* Main Image */}
                        <Box
                            component="img"
                            src={images[selectedImage]?.url || 'https://via.placeholder.com/500'}
                            alt={product.name}
                            sx={{
                                width: '100%',
                                height: 400,
                                objectFit: 'contain',
                                mb: 2,
                                borderRadius: 2
                            }}
                        />

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <Box display="flex" gap={1} justifyContent="center">
                                {images.map((image, index) => (
                                    <Box
                                        key={index}
                                        component="img"
                                        src={image.url}
                                        alt={`${product.name} ${index + 1}`}
                                        onClick={() => setSelectedImage(index)}
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            objectFit: 'cover',
                                            borderRadius: 1,
                                            cursor: 'pointer',
                                            border: selectedImage === index ? '2px solid #d4af37' : '2px solid transparent',
                                            opacity: selectedImage === index ? 1 : 0.6,
                                            '&:hover': { opacity: 1 }
                                        }}
                                    />
                                ))}
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Product Info */}
                <Grid item xs={12} md={6}>
                    <Box>
                        {/* Brand */}
                        <Chip
                            label={product.brand?.name || 'Brand'}
                            sx={{
                                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                                color: '#d4af37',
                                fontWeight: 'bold',
                                mb: 2
                            }}
                        />

                        {/* Product Name */}
                        <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
                            {product.name}
                        </Typography>

                        {/* Rating */}
                        <Box display="flex" alignItems="center" gap={2} mb={3}>
                            <Rating value={product.averageRating || 0} readOnly />
                            <Typography sx={{ color: '#999' }}>
                                ({product.reviewCount || 0} reviews)
                            </Typography>
                        </Box>

                        {/* Price */}
                        <Box mb={3}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                                    Rs. {finalPrice.toLocaleString()}
                                </Typography>
                                {hasDiscount && (
                                    <>
                                        <Typography
                                            variant="h6"
                                            sx={{ color: '#666', textDecoration: 'line-through' }}
                                        >
                                            Rs. {product.compareAtPrice.toLocaleString()}
                                        </Typography>
                                        <Chip
                                            icon={<LocalOffer />}
                                            label={`${Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF`}
                                            color="error"
                                            size="small"
                                        />
                                    </>
                                )}
                            </Box>
                        </Box>

                        {/* Stock Status */}
                        <Box mb={3}>
                            {product.inventory > 0 ? (
                                <Chip
                                    icon={<CheckCircle />}
                                    label={`In Stock (${product.inventory} available)`}
                                    color="success"
                                />
                            ) : (
                                <Chip label="Out of Stock" color="error" />
                            )}
                        </Box>

                        {/* Description */}
                        <Box mb={3}>
                            <Typography variant="h6" sx={{ color: '#d4af37', mb: 1 }}>
                                Description
                            </Typography>
                            <Typography sx={{ color: '#ccc', lineHeight: 1.8 }}>
                                {product.description}
                            </Typography>
                        </Box>

                        {/* Quantity */}
                        <Box mb={3}>
                            <Typography variant="subtitle1" sx={{ color: '#d4af37', mb: 1 }}>
                                Quantity
                            </Typography>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    sx={{
                                        borderColor: '#d4af37',
                                        color: '#d4af37',
                                        '&:hover': { borderColor: '#c19b2a' }
                                    }}
                                >
                                    -
                                </Button>
                                <Typography variant="h6" sx={{ color: '#fff', minWidth: 40, textAlign: 'center' }}>
                                    {quantity}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                                    disabled={quantity >= product.inventory}
                                    sx={{
                                        borderColor: '#d4af37',
                                        color: '#d4af37',
                                        '&:hover': { borderColor: '#c19b2a' }
                                    }}
                                >
                                    +
                                </Button>
                            </Box>
                        </Box>

                        {/* Actions */}
                        <Box display="flex" gap={2}>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                startIcon={<ShoppingCart />}
                                onClick={handleAddToCart}
                                disabled={product.inventory === 0}
                                sx={{
                                    backgroundColor: '#d4af37',
                                    color: '#1a1a1a',
                                    fontWeight: 'bold',
                                    py: 1.5,
                                    '&:hover': { backgroundColor: '#c19b2a' }
                                }}
                            >
                                Add to Cart
                            </Button>
                            <IconButton
                                onClick={handleAddToComparison}
                                disabled={isInComparison(product._id)}
                                sx={{
                                    border: '1px solid #d4af37',
                                    color: '#d4af37',
                                    '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.1)' }
                                }}
                            >
                                <Compare />
                            </IconButton>
                        </Box>

                        {/* Specifications */}
                        {product.specifications && product.specifications.length > 0 && (
                            <Box mt={4}>
                                <Typography variant="h6" sx={{ color: '#d4af37', mb: 2 }}>
                                    Specifications
                                </Typography>
                                <Paper
                                    sx={{
                                        p: 2,
                                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                                        border: '1px solid rgba(212, 175, 55, 0.2)'
                                    }}
                                >
                                    {product.specifications.map((spec, index) => (
                                        <Box
                                            key={index}
                                            display="flex"
                                            justifyContent="space-between"
                                            py={1}
                                            borderBottom={index < product.specifications.length - 1 ? '1px solid #333' : 'none'}
                                        >
                                            <Typography sx={{ color: '#999' }}>{spec.key || spec.name}</Typography>
                                            <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                                                {spec.value}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Paper>
                            </Box>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductDetails;
