import { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import ProductCard from '../Products/ProductCard';
import axios from 'axios';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/products?limit=8&sort=popular`
            );
            setProducts(data.data || []);
        } catch (error) {
            console.error('Error fetching featured products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#d4af37' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 'bold', mb: 3 }}>
                Featured Products
            </Typography>
            <Grid container spacing={3}>
                {products.slice(0, 8).map((product) => (
                    <Grid item xs={12} sm={6} md={3} key={product._id}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default FeaturedProducts;
