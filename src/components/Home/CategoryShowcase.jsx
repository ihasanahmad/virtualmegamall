import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CategoryShowcase = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
            setCategories(data.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: '#d4af37' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 'bold', mb: 3 }}>
                Shop by Category
            </Typography>
            <Grid container spacing={3}>
                {categories.map((category) => (
                    <Grid item xs={6} sm={4} md={3} key={category._id}>
                        <Paper
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                bgcolor: '#1a1a1a',
                                border: '1px solid #333',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    borderColor: '#d4af37',
                                    boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)',
                                },
                            }}
                            onClick={() => navigate(`/products?category=${category._id}`)}
                        >
                            <Typography variant="h6" sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                                {category.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#999', mt: 1, display: 'block' }}>
                                Explore {category.name}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CategoryShowcase;
