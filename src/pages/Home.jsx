import { Container, Box } from '@mui/material';
import HeroCarousel from '../components/Home/HeroCarousel';
import FeaturedProducts from '../components/Home/FeaturedProducts';
import CategoryShowcase from '../components/Home/CategoryShowcase';

const Home = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <HeroCarousel />
            <CategoryShowcase />
            <FeaturedProducts />
        </Container>
    );
};

export default Home;
