import { useState } from 'react';
import axios from 'axios';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Chip
} from '@mui/material';
import { LocalOffer } from '@mui/icons-material';

const CouponInput = ({ cartTotal, onCouponApplied }) => {
    const [couponCode, setCouponCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const handleApply = async () => {
        if (!couponCode.trim()) return;

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/coupons/validate`,
                { code: couponCode, cartTotal },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setAppliedCoupon(response.data.data);
                onCouponApplied(response.data.data);
                setError('');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid coupon code');
            setAppliedCoupon(null);
            onCouponApplied(null);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        setCouponCode('');
        setAppliedCoupon(null);
        setError('');
        onCouponApplied(null);
    };

    return (
        <Box sx={{ mt: 2 }}>
            {appliedCoupon ? (
                <Box
                    sx={{
                        p: 2,
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        border: '1px solid #4caf50',
                        borderRadius: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Box>
                        <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                            Coupon Applied: {appliedCoupon.code}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#999' }}>
                            You saved Rs. {appliedCoupon.discount.toLocaleString()}
                        </Typography>
                    </Box>
                    <Button size="small" onClick={handleRemove} sx={{ color: '#f44336' }}>
                        Remove
                    </Button>
                </Box>
            ) : (
                <>
                    <Box display="flex" gap={1}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            disabled={loading}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: '#fff',
                                    '& fieldset': { borderColor: '#d4af37' },
                                    '&:hover fieldset': { borderColor: '#d4af37' },
                                    '&.Mui-focused fieldset': { borderColor: '#d4af37' }
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleApply}
                            disabled={loading || !couponCode.trim()}
                            startIcon={<LocalOffer />}
                            sx={{
                                backgroundColor: '#d4af37',
                                color: '#1a1a1a',
                                '&:hover': { backgroundColor: '#c19b2a' },
                                minWidth: 100
                            }}
                        >
                            {loading ? 'Checking...' : 'Apply'}
                        </Button>
                    </Box>
                    {error && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                            {error}
                        </Alert>
                    )}
                </>
            )}
        </Box>
    );
};

export default CouponInput;
