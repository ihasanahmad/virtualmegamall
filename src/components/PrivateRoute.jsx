import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="60vh"
            >
                <CircularProgress sx={{ color: '#d4af37' }} />
            </Box>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default PrivateRoute;
