// Review services
export const reviewService = {
    createReview: async (productId, reviewData) => {
        const response = await api.post('/reviews', {
            product: productId,
            ...reviewData
        });
        return response.data;
    },

    getProductReviews: async (productId, params = {}) => {
        const response = await api.get(`/reviews/product/${productId}`, { params });
        return response.data;
    },

    updateReview: async (reviewId, reviewData) => {
        const response = await api.put(`/reviews/${reviewId}`, reviewData);
        return response.data;
    },

    deleteReview: async (reviewId) => {
        const response = await api.delete(`/reviews/${reviewId}`);
        return response.data;
    },

    markHelpful: async (reviewId) => {
        const response = await api.post(`/reviews/${reviewId}/helpful`);
        return response.data;
    }
};
