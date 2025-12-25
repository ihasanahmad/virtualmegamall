import { Container, Box, Typography } from '@mui/material';

const Home = () => {
    return (
        <Container>
            <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h2" sx={{ color: '#d4af37', mb: 4, fontWeight: 'bold' }}>
                    Welcome to Virtual Mega Mall
                </Typography>
                <Typography variant="h5" sx={{ color: '#999', mb: 6 }}>
                    Pakistan's First 3D Shopping Experience
                </Typography>
                <Typography sx={{ color: '#fff', mb: 4 }}>
                    Browse official brand stores, compare products, and shop with confidence
                </Typography>
            </Box>
        </Container>
    );
};

export default Home;
