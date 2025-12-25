import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        // Load from localStorage
        const saved = localStorage.getItem('wishlist');
        if (saved) {
            setWishlist(JSON.parse(saved));
        }

        // Sync with backend if logged in
        const token = localStorage.getItem('token');
        if (token) {
            syncWithBackend();
        }
    }, []);

    const syncWithBackend = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/wishlist`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.data) {
                const items = response.data.data.products.map(p => p.product);
                setWishlist(items);
                localStorage.setItem('wishlist', JSON.stringify(items));
            }
        } catch (error) {
            console.error('Wishlist sync error:', error);
        }
    };

    const addToWishlist = async (product) => {
        const exists = wishlist.find(item => item._id === product._id);
        if (exists) return;

        const newWishlist = [...wishlist, product];
        setWishlist(newWishlist);
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));

        // Sync to backend if logged in
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/wishlist/${product._id}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
                console.error('Add to wishlist error:', error);
            }
        }
    };

    const removeFromWishlist = async (productId) => {
        const newWishlist = wishlist.filter(item => item._id !== productId);
        setWishlist(newWishlist);
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));

        // Sync to backend if logged in
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await axios.delete(
                    `${import.meta.env.VITE_API_URL}/wishlist/${productId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
                console.error('Remove from wishlist error:', error);
            }
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item._id === productId);
    };

    const clearWishlist = async () => {
        setWishlist([]);
        localStorage.removeItem('wishlist');

        const token = localStorage.getItem('token');
        if (token) {
            try {
                await axios.delete(
                    `${import.meta.env.VITE_API_URL}/wishlist`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
                console.error('Clear wishlist error:', error);
            }
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                clearWishlist,
                wishlistCount: wishlist.length
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
};
