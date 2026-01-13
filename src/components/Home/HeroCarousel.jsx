import { Box, Typography, Button, Container } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';

const heroSlides = [
    {
        title: 'Welcome to Virtual Mega Mall',
        subtitle: 'Your One-Stop Shopping Destination',
        description: 'Discover thousands of products from top brands',
        cta: 'Shop Now',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop'
    },
    {
        title: 'Exclusive Deals Every Day',
        subtitle: 'Save Big on Your Favorite Items',
        description: 'Up to 70% off on selected products',
        cta: 'Browse Deals',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=500&fit=crop'
    },
    {
        title: 'Free Shipping on Orders Over Rs. 2000',
        subtitle: 'Shop More, Save More',
        description: 'Fast and reliable delivery to your doorstep',
        cta: 'Start Shopping',
        image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200&h=500&fit=crop'
    }
];

const HeroCarousel = () => {
    const navigate = useNavigate();

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
    };

    return (
        <Box sx={{ mb: 6, borderRadius: 2, overflow: 'hidden' }}>
            <Slider {...settings}>
                {heroSlides.map((slide, index) => (
                    <Box key={index} sx={{ position: 'relative' }}>
                        <Box
                            sx={{
                                height: { xs: '300px', md: '500px' },
                                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${slide.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Container>
                                <Box sx={{ textAlign: 'center', color: '#fff' }}>
                                    <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, color: '#d4af37' }}>
                                        {slide.title}
                                    </Typography>
                                    <Typography variant="h5" sx={{ mb: 2 }}>
                                        {slide.subtitle}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 4, color: '#ccc' }}>
                                        {slide.description}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => navigate('/products')}
                                        sx={{
                                            bgcolor: '#d4af37',
                                            color: '#000',
                                            fontWeight: 'bold',
                                            px: 4,
                                            py: 1.5,
                                            '&:hover': {
                                                bgcolor: '#c49f2f',
                                            },
                                        }}
                                    >
                                        {slide.cta}
                                    </Button>
                                </Box>
                            </Container>
                        </Box>
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default HeroCarousel;
