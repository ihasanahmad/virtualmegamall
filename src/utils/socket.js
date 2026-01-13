import io from 'socket.io-client';
import { toast } from 'react-toastify';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
let socket;

export const connectSocket = (user) => {
    if (!socket) {
        socket = io(SOCKET_URL);

        socket.on('connect', () => {
            console.log('Socket connected');

            if (user) {
                if (user.role === 'customer') {
                    socket.emit('join:customer', user.id);
                }
            }
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        // Order status updates for customers
        socket.on('order:updated', (orderData) => {
            toast.info(`Order #${orderData.orderNumber} status updated to ${orderData.orderStatus}`);
        });
    }

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;

export default { connectSocket, disconnectSocket, getSocket };
