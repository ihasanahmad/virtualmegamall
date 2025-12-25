import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Rating,
    Button,
    Paper,
    Avatar,
    Chip,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    CircularProgress
} from '@mui/material';
import { ThumbUp, Verified } from '@mui/icons-material';

const ReviewList = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        fetchReviews();
    }, [productId, page, sortBy]);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/reviews/product/${productId}`,
                { params: { page, sort: sortBy, limit: 10 } }
            );

            if (response.data.success) {
                setReviews(response.data.data);
                setTotalPages(response.data.pagination.pages);
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleHelpful = async (reviewId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to mark reviews as helpful');
                return;
            }

            await axios.post(
                `${import.meta.env.VITE_API_URL}/reviews/${reviewId}/helpful`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Refresh reviews
            fetchReviews();
        } catch (error) {
            console.error('Failed to mark helpful:', error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress sx={{ color: '#d4af37' }} />
            </Box>
        );
    }

    if (reviews.length === 0) {
        return (
            <Typography sx={{ color: '#999', textAlign: 'center', py: 4 }}>
                No reviews yet. Be the first to review this product!
            </Typography>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" sx={{ color: '#d4af37' }}>
                    Customer Reviews ({reviews.length})
                </Typography>
                <FormControl size="small">
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        sx={{
                            color: '#fff',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d4af37' },
                            '& .MuiSvgIcon-root': { color: '#d4af37' }
                        }}
                    >
                        <MenuItem value="newest">Newest First</MenuItem>
                        <MenuItem value="highest">Highest Rating</MenuItem>
                        <MenuItem value="lowest">Lowest Rating</MenuItem>
                        <MenuItem value="helpful">Most Helpful</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {reviews.map((review) => (
                <Paper
                    key={review._id}
                    sx={{
                        p: 3,
                        mb: 2,
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333'
                    }}
                >
                    <Box display="flex" gap={2} mb={2}>
                        <Avatar sx={{ bgcolor: '#d4af37', color: '#1a1a1a' }}>
                            {review.user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box flexGrow={1}>
                            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                                    {review.user?.name}
                                </Typography>
                                {review.isVerifiedPurchase && (
                                    <Chip
                                        icon={<Verified />}
                                        label="Verified Purchase"
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(76, 175, 80, 0.2)',
                                            color: '#4caf50',
                                            '& .MuiChip-icon': { color: '#4caf50' }
                                        }}
                                    />
                                )}
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Rating value={review.rating} readOnly size="small" sx={{ color: '#d4af37' }} />
                                <Typography variant="caption" sx={{ color: '#999' }}>
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Typography sx={{ color: '#fff', mb: 2 }}>
                        {review.comment}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1}>
                        <IconButton
                            size="small"
                            onClick={() => handleHelpful(review._id)}
                            sx={{ color: '#d4af37' }}
                        >
                            <ThumbUp fontSize="small" />
                        </IconButton>
                        <Typography variant="caption" sx={{ color: '#999' }}>
                            Helpful ({review.helpfulCount || 0})
                        </Typography>
                    </Box>
                </Paper>
            ))}

            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" gap={1} mt={3}>
                    <Button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        sx={{ color: '#d4af37' }}
                    >
                        Previous
                    </Button>
                    <Typography sx={{ color: '#fff', alignSelf: 'center' }}>
                        Page {page} of {totalPages}
                    </Typography>
                    <Button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        sx={{ color: '#d4af37' }}
                    >
                        Next
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default ReviewList;
