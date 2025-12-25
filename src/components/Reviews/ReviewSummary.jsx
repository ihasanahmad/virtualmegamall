import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Rating,
    LinearProgress,
    Paper
} from '@mui/material';
import { Star } from '@mui/icons-material';

const ReviewSummary = ({ productId, averageRating, totalReviews }) => {
    const [distribution, setDistribution] = useState([]);

    useEffect(() => {
        fetchDistribution();
    }, [productId]);

    const fetchDistribution = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/reviews/product/${productId}`
            );

            if (response.data.ratingDistribution) {
                // Convert to array format [5, 4, 3, 2, 1]
                const dist = [5, 4, 3, 2, 1].map(rating => {
                    const found = response.data.ratingDistribution.find(d => d._id === rating);
                    return found ? found.count : 0;
                });
                setDistribution(dist);
            }
        } catch (error) {
            console.error('Failed to fetch distribution:', error);
        }
    };

    const getPercentage = (count) => {
        if (totalReviews === 0) return 0;
        return (count / totalReviews) * 100;
    };

    return (
        <Paper
            sx={{
                p: 3,
                mb: 3,
                backgroundColor: '#1a1a1a',
                border: '1px solid #d4af37'
            }}
        >
            <Typography variant="h6" sx={{ color: '#d4af37', mb: 2 }}>
                Customer Reviews
            </Typography>

            <Box display="flex" alignItems="center" gap={3} mb={3}>
                <Box textAlign="center">
                    <Typography variant="h2" sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                        {averageRating?.toFixed(1) || '0.0'}
                    </Typography>
                    <Rating
                        value={averageRating || 0}
                        readOnly
                        precision={0.1}
                        sx={{ color: '#d4af37', mb: 1 }}
                    />
                    <Typography variant="body2" sx={{ color: '#999' }}>
                        Based on {totalReviews || 0} reviews
                    </Typography>
                </Box>

                <Box flexGrow={1}>
                    {[5, 4, 3, 2, 1].map((rating, index) => (
                        <Box key={rating} display="flex" alignItems="center" gap={1} mb={0.5}>
                            <Typography sx={{ color: '#fff', minWidth: 60 }}>
                                {rating} <Star sx={{ fontSize: 16, color: '#d4af37', verticalAlign: 'middle' }} />
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={getPercentage(distribution[index] || 0)}
                                sx={{
                                    flexGrow: 1,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: '#333',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: '#d4af37'
                                    }
                                }}
                            />
                            <Typography sx={{ color: '#999', minWidth: 40, textAlign: 'right' }}>
                                {distribution[index] || 0}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Paper>
    );
};

export default ReviewSummary;
