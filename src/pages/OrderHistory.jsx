import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    Chip,
    Button,
    CircularProgress
} from '@mui/material';
import { Visibility } from '@mui/icons-material';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/orders`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setOrders(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'processing': return 'info';
            case 'shipped': return 'warning';
            case 'delivered': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress sx={{ color: '#d4af37' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 'bold', mb: 4 }}>
                Order History
            </Typography>

            {orders.length === 0 ? (
                <Paper
                    sx={{
                        p: 8,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                        border: '1px solid #d4af37'
                    }}
                >
                    <Typography variant="h6" sx={{ color: '#999', mb: 2 }}>
                        No orders yet
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/products')}
                        sx={{
                            backgroundColor: '#d4af37',
                            color: '#1a1a1a',
                            '&:hover': { backgroundColor: '#c19b2a' }
                        }}
                    >
                        Start Shopping
                    </Button>
                </Paper>
            ) : (
                <TableContainer
                    component={Paper}
                    sx={{
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                        border: '1px solid #d4af37'
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Order ID</TableCell>
                                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Date</TableCell>
                                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Items</TableCell>
                                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Total</TableCell>
                                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow
                                    key={order._id}
                                    sx={{ '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.05)' } }}
                                >
                                    <TableCell sx={{ color: '#fff' }}>
                                        #{order._id.slice(-8).toUpperCase()}
                                    </TableCell>
                                    <TableCell sx={{ color: '#fff' }}>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell sx={{ color: '#fff' }}>
                                        {order.items.length} item(s)
                                    </TableCell>
                                    <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                                        Rs. {order.total.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.status.toUpperCase()}
                                            color={getStatusColor(order.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            startIcon={<Visibility />}
                                            onClick={() => navigate(`/orders/${order._id}`)}
                                            sx={{ color: '#d4af37' }}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default OrderHistory;
