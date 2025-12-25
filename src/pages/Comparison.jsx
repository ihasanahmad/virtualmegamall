import { useNavigate } from 'react-router-dom';
import { useComparison } from '../context/ComparisonContext';
import { useCart } from '../context/CartContext';
import {
    Container,
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton
} from '@mui/material';
import {
    Compare as CompareIcon,
    Delete,
    ShoppingCart
} from '@mui/icons-material';

const Comparison = () => {
    const { comparisonItems, removeFromComparison, clearComparison } = useComparison();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    if (comparisonItems.length === 0) {
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
                    <CompareIcon sx={{ fontSize: 80, color: '#666', mb: 3 }} />
                    <Typography variant="h4" sx={{ color: '#fff', mb: 2 }}>
                        No products in comparison
                    </Typography>
                    <Typography sx={{ color: '#999', mb: 4 }}>
                        Add up to 4 products to compare their features side by side
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
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                    Product Comparison
                </Typography>
                <Button
                    variant="outlined"
                    onClick={clearComparison}
                    sx={{
                        color: '#f44336',
                        borderColor: '#f44336',
                        '&:hover': { borderColor: '#d32f2f' }
                    }}
                >
                    Clear All
                </Button>
            </Box>

            <TableContainer
                component={Paper}
                sx={{
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                    border: '1px solid #d4af37',
                    overflowX: 'auto'
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#d4af37', fontWeight: 'bold', minWidth: 150 }}>
                                Feature
                            </TableCell>
                            {comparisonItems.map((product) => (
                                <TableCell
                                    key={product._id}
                                    sx={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        minWidth: 250
                                    }}
                                >
                                    {product.name}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Product Images */}
                        <TableRow sx={{ '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.05)' } }}>
                            <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Image</TableCell>
                            {comparisonItems.map((product) => (
                                <TableCell key={product._id} sx={{ textAlign: 'center' }}>
                                    <Box
                                        component="img"
                                        src={product.images?.[0]?.url || 'https://via.placeholder.com/150'}
                                        alt={product.name}
                                        sx={{
                                            width: 150,
                                            height: 150,
                                            objectFit: 'cover',
                                            borderRadius: 2,
                                            cursor: 'pointer '
                                        }}
                                        onClick={() => navigate(`/products/${product._id}`)}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Brand */}
                        <TableRow sx={{ '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.05)' } }}>
                            <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Brand</TableCell>
                            {comparisonItems.map((product) => (
                                <TableCell key={product._id} sx={{ color: '#fff', textAlign: 'center' }}>
                                    {product.brand?.name || 'N/A'}
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Price */}
                        <TableRow sx={{ '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.05)' } }}>
                            <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Price</TableCell>
                            {comparisonItems.map((product) => (
                                <TableCell key={product._id} sx={{ textAlign: 'center' }}>
                                    <Typography sx={{ color: '#d4af37', fontWeight: 'bold', fontSize: '1.25rem' }}>
                                        Rs. {product.price.toLocaleString()}
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Category */}
                        <TableRow sx={{ '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.05)' } }}>
                            <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Category</TableCell>
                            {comparisonItems.map((product) => (
                                <TableCell key={product._id} sx={{ color: '#fff', textAlign: 'center' }}>
                                    {product.category?.name || 'N/A'}
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Stock */}
                        <TableRow sx={{ '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.05)' } }}>
                            <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Availability</TableCell>
                            {comparisonItems.map((product) => (
                                <TableCell key={product._id} sx={{ textAlign: 'center' }}>
                                    <Typography
                                        sx={{
                                            color: product.inventory > 0 ? '#4caf50' : '#f44336',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {product.inventory > 0 ? `In Stock (${product.inventory})` : 'Out of Stock'}
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Description */}
                        <TableRow sx={{ '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.05)' } }}>
                            <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Description</TableCell>
                            {comparisonItems.map((product) => (
                                <TableCell key={product._id} sx={{ color: '#999', textAlign: 'center' }}>
                                    {product.description?.substring(0, 100)}...
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Actions */}
                        <TableRow>
                            <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Actions</TableCell>
                            {comparisonItems.map((product) => (
                                <TableCell key={product._id} sx={{ textAlign: 'center' }}>
                                    <Box display="flex" flexDirection="column" gap={1} alignItems="center">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            fullWidth
                                            startIcon={<ShoppingCart />}
                                            onClick={() => addToCart(product)}
                                            disabled={product.inventory === 0}
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
                                            onClick={() => removeFromComparison(product._id)}
                                            sx={{ color: '#f44336' }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Comparison;
