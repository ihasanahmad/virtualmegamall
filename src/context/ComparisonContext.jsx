import { createContext, useContext, useState, useEffect } from 'react';

const ComparisonContext = createContext(null);

const MAX_COMPARISON_ITEMS = 4;

export const ComparisonProvider = ({ children }) => {
    const [comparisonItems, setComparisonItems] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('comparison');
        if (saved) {
            setComparisonItems(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('comparison', JSON.stringify(comparisonItems));
    }, [comparisonItems]);

    const addToComparison = (product) => {
        if (comparisonItems.length >= MAX_COMPARISON_ITEMS) {
            throw new Error(`Maximum ${MAX_COMPARISON_ITEMS} products allowed for comparison`);
        }
        if (comparisonItems.find(item => item._id === product._id)) {
            throw new Error('Product already in comparison');
        }
        setComparisonItems(prev => [...prev, product]);
    };

    const removeFromComparison = (productId) => {
        setComparisonItems(prev => prev.filter(item => item._id !== productId));
    };

    const clearComparison = () => {
        setComparisonItems([]);
    };

    const isInComparison = (productId) => {
        return comparisonItems.some(item => item._id === productId);
    };

    const value = {
        comparisonItems,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        maxItems: MAX_COMPARISON_ITEMS
    };

    return <ComparisonContext.Provider value={value}>{children}</ComparisonContext.Provider>;
};

export const useComparison = () => {
    const context = useContext(ComparisonContext);
    if (!context) {
        throw new Error('useComparison must be used within ComparisonProvider');
    }
    return context;
};
