import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CouponInput from '../components/CouponInput';
import StripePaymentForm from '../components/Payment/StripePaymentForm';
import JazzCashForm from '../components/Payment/JazzCashForm';
import EasyPaisaForm from '../components/Payment/EasyPaisaForm';
import {
    Container,
    Box,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
    Alert
} from '@mui/material';
import {
    LocalShipping,
    Payment,
    CheckCircle
} from '@mui/icons-material';
import axios from 'axios';

const steps = ['Shipping Address', 'Payment Method', 'Review Order'];

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    // Shipping address state
    const [address, setAddress] = useState({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Pakistan'
    });

    // Payment state
    const [paymentMethod, setPaymentMethod] = useState('stripe');
    const [createdOrderId, setCreatedOrderId] = useState(null);

    const handleNext = () => {
        if (activeStep === 0 && !validateAddress()) {
            setError('Please fill in all required fields');
            return;
        }
        setError('');
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const validateAddress = () => {
        return address.fullName && address.phone && address.addressLine1 &&
            address.city && address.state && address.postalCode;
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError('');

        try {
            const orderData = {
                items: cartItems.map(item => ({
                    product: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                shippingAddress: address,
                paymentMethod,
                paymentStatus: paymentMethod === 'cod' ? 'pending' : 'awaiting_payment'
            };

            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/orders`,
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const orderId = response.data.data._id;
            setCreatedOrderId(orderId);

            // If COD, clear cart and redirect
            if (paymentMethod === 'cod') {
                clearCart();
                navigate(`/payment/success?orderId=${orderId}`);
            }
            // For other payment methods, move to next step to show payment form
            else {
                setActiveStep(2);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <Container sx={{ py: 8 }}>
                <Alert severity="info">
                    Your cart is empty. Add products to proceed with checkout.
                </Alert>
                <Button
                    variant="contained"
                    onClick={() => navigate('/products')}
                    sx={{ mt: 2, backgroundColor: '#d4af37', color: '#1a1a1a' }}
                >
                    Browse Products
                </Button>
            </Container>
        );
    }

    const subtotal = getCartTotal();
    const shipping = 200;
    const tax = subtotal * 0.05;
    const discount = appliedCoupon?.discount || 0;
    const total = subtotal + shipping + tax - discount;

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h6" sx={{ color: '#d4af37', mb: 3 }}>
                            Shipping Address
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Full Name"
                                    value={address.fullName}
                                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Phone Number"
                                    value={address.phone}
                                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Address Line 1"
                                    value={address.addressLine1}
                                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address Line 2 (Optional)"
                                    value={address.addressLine2}
                                    onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="City"
                                    value={address.city}
                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="State/Province"
                                    value={address.state}
                                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Postal Code"
                                    value={address.postalCode}
                                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Country"
                                    value={address.country}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 1:
                return (
                    <Box>
                        <Typography variant="h6" sx={{ color: '#d4af37', mb: 3 }}>
                            Payment Method
                        </Typography>
                        <FormControl component="fieldset">
                            <RadioGroup
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <FormControlLabel
                                    value="cod"
                                    control={<Radio sx={{ color: '#d4af37', '&.Mui-checked': { color: '#d4af37' } }} />}
                                    label={
                                        <Box>
                                            <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                                                Cash on Delivery (COD)
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#999' }}>
                                                Pay when you receive your order
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ mb: 2, p: 2, border: '1px solid #d4af37', borderRadius: 2 }}
                                />
                                <FormControlLabel
                                    value="jazzcash"
                                    control={<Radio sx={{ color: '#d4af37', '&.Mui-checked': { color: '#d4af37' } }} />}
                                    label={
                                        <Box>
                                            <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                                                JazzCash
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#999' }}>
                                                Pay via JazzCash mobile wallet
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ mb: 2, p: 2, border: '1px solid #d4af37', borderRadius: 2 }}
                                />
                                <FormControlLabel
                                    value="easypaisa"
                                    control={<Radio sx={{ color: '#d4af37', '&.Mui-checked': { color: '#d4af37' } }} />}
                                    label={
                                        <Box>
                                            <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                                                EasyPaisa
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#999' }}>
                                                Pay via EasyPaisa mobile wallet
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ mb: 2, p: 2, border: '1px solid #d4af37', borderRadius: 2 }}
                                />
                                <FormControlLabel
                                    value="stripe"
                                    control={<Radio sx={{ color: '#d4af37', '&.Mui-checked': { color: '#d4af37' } }} />}
                                    label={
                                        <Box>
                                            <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                                                Credit/Debit Card (Stripe)
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#999' }}>
                                                Visa, Mastercard, etc.
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ p: 2, border: '1px solid #d4af37', borderRadius: 2 }}
                                />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                );

            case 2:
                return (
                    <Box>
                        <Typography variant="h6" sx={{ color: '#d4af37', mb: 3 }}>
                            Order Review
                        </Typography>

                        {/* Shipping Address */}
                        <Paper sx={{ p: 2, mb: 3, backgroundColor: 'rgba(212, 175, 55, 0.05)' }}>
                            <Typography variant="subtitle1" sx={{ color: '#d4af37', mb: 1 }}>
                                Shipping Address
                            </Typography>
                            <Typography sx={{ color: '#fff' }}>{address.fullName}</Typography>
                            <Typography sx={{ color: '#999' }}>{address.phone}</Typography>
                            <Typography sx={{ color: '#999' }}>
                                {address.addressLine1}, {address.addressLine2}
                            </Typography>
                            <Typography sx={{ color: '#999' }}>
                                {address.city}, {address.state} {address.postalCode}
                            </Typography>
                        </Paper>

                        {/* Order Items */}
                        <Typography variant="subtitle1" sx={{ color: '#d4af37', mb: 2 }}>
                            Order Items
                        </Typography>
                        {cartItems.map((item) => (
                            <Box key={item._id} display="flex" gap={2} mb={2} pb={2} borderBottom="1px solid #333">
                                <img
                                    src={item.images?.[0]?.url || 'https://via.placeholder.com/60'}
                                    alt={item.name}
                                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                                />
                                <Box flexGrow={1}>
                                    <Typography sx={{ color: '#fff' }}>{item.name}</Typography>
                                    <Typography variant="caption" sx={{ color: '#999' }}>
                                        Qty: {item.quantity}
                                    </Typography>
                                </Box>
                                <Typography sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                                    Rs. {(item.price * item.quantity).toLocaleString()}
                                </Typography>
                            </Box>
                        ))}

                        {/* Order Summary */}
                        <Divider sx={{ my: 2, backgroundColor: '#d4af37' }} />

                        {/* Coupon Input */}
                        <CouponInput
                            cartTotal={subtotal}
                            onCouponApplied={setAppliedCoupon}
                        />

                        <Divider sx={{ my: 2, backgroundColor: '#333' }} />

                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography sx={{ color: '#999' }}>Subtotal</Typography>
                            <Typography sx={{ color: '#fff' }}>Rs. {subtotal.toLocaleString()}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography sx={{ color: '#999' }}>Shipping</Typography>
                            <Typography sx={{ color: '#fff' }}>Rs. {shipping.toLocaleString()}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography sx={{ color: '#999' }}>Tax (5%)</Typography>
                            <Typography sx={{ color: '#fff' }}>Rs. {tax.toLocaleString()}</Typography>
                        </Box>
                        {appliedCoupon && (
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography sx={{ color: '#4caf50' }}>Discount ({appliedCoupon.code})</Typography>
                                <Typography sx={{ color: '#4caf50' }}>- Rs. {discount.toLocaleString()}</Typography>
                            </Box>
                        )}
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
                                Total
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                                Rs. {total.toLocaleString()}
                            </Typography>
                        </Box>

                        {/* Payment Form Section */}
                        {createdOrderId && paymentMethod !== 'cod' && (
                            <>
                                <Divider sx={{ my: 3, backgroundColor: '#d4af37' }} />
                                <Typography variant="h6" sx={{ color: '#d4af37', mb: 3 }}>
                                    Complete Payment
                                </Typography>

                                {paymentMethod === 'stripe' && (
                                    <StripePaymentForm
                                        orderId={createdOrderId}
                                        amount={total}
                                        onSuccess={() => {
                                            clearCart();
                                            navigate(`/payment/success?orderId=${createdOrderId}`);
                                        }}
                                        onError={(error) => {
                                            navigate(`/payment/failure?message=${error.message}`);
                                        }}
                                    />
                                )}

                                {paymentMethod === 'jazzcash' && (
                                    <JazzCashForm
                                        orderId={createdOrderId}
                                        amount={total}
                                        onSuccess={() => clearCart()}
                                        onError={(error) => setError(error.message)}
                                    />
                                )}

                                {paymentMethod === 'easypaisa' && (
                                    <EasyPaisaForm
                                        orderId={createdOrderId}
                                        amount={total}
                                        onSuccess={() => clearCart()}
                                        onError={(error) => setError(error.message)}
                                    />
                                )}
                            </>
                        )}
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 'bold', mb: 4 }}>
                Checkout
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <StepLabel
                        key={label}
                        sx={{
                            '& .MuiStepLabel-label': { color: '#999' },
                            '& .Mui-active': { color: '#d4af37' },
                            '& .Mui-completed': { color: '#4caf50' },
                            '& .MuiStepIcon-root': { color: '#666' },
                            '& .MuiStepIcon-root.Mui-active': { color: '#d4af37' },
                            '& .MuiStepIcon-root.Mui-completed': { color: '#4caf50' }
                        }}
                    >
                        {label}
                    </StepLabel>
                ))}
            </Stepper>

            <Paper
                sx={{
                    p: 4,
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                    border: '1px solid #d4af37'
                }}
            >
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {renderStepContent(activeStep)}

                <Box display="flex" justifyContent="space-between" mt={4}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ color: '#d4af37' }}
                    >
                        Back
                    </Button>
                    {activeStep === steps.length - 1 ? (
                        <Button
                            variant="contained"
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            sx={{
                                backgroundColor: '#d4af37',
                                color: '#1a1a1a',
                                fontWeight: 'bold',
                                '&:hover': { backgroundColor: '#c19b2a' }
                            }}
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{
                                backgroundColor: '#d4af37',
                                color: '#1a1a1a',
                                fontWeight: 'bold',
                                '&:hover': { backgroundColor: '#c19b2a' }
                            }}
                        >
                            Next
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default Checkout;
