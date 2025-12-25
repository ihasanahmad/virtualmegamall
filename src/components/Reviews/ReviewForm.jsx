import { useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Rating,
    TextField,
    Button,
    Alert,
    Paper
} from '@mui/material';
import { Star } from '@mui/icons-material';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/reviews`,
                { product: productId, rating, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess(true);
            setRating(0);
            setComment('');

            if (onReviewSubmitted) {
                onReviewSubmitted(response.data.data);
            }

            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper
            sx={{
                p: 3,
                backgroundColor: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid #d4af37'
            }}
        >
            <Typography variant="h6" sx={{ color: '#d4af37', mb: 2 }}>
                Write a Review
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Review submitted successfully!
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#fff', mb: 1 }}>
                        Your Rating *
                    </Typography>
                    <Rating
                        value={rating}
                        onChange={(e, newValue) => setRating(newValue)}
                        size="large"
                        sx={{
                            '& .MuiRating-iconFilled': { color: '#d4af37' },
                            '& .MuiRating-iconHover': { color: '#d4af37' }
                        }}
                    />
                </Box>

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Your Review"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': { borderColor: '#d4af37' },
                            '&:hover fieldset': { borderColor: '#d4af37' },
                            '&.Mui-focused fieldset': { borderColor: '#d4af37' }
                        },
                        '& .MuiInputLabel-root': { color: '#d4af37' },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#d4af37' }
                    }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || rating === 0}
                    sx={{
                        backgroundColor: '#d4af37',
                        color: '#1a1a1a',
                        fontWeight: 'bold',
                        '&:hover': { backgroundColor: '#c19b2a' }
                    }}
                >
                    {loading ? 'Submitting...' : 'Submit Review'}
                </Button>
            </Box>
        </Paper>
    );
};

export default ReviewForm;
