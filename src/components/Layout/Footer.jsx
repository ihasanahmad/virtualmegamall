import { Box, Container, Grid, Typography, Link as MuiLink } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#1a1a1a',
                borderTop: '1px solid #d4af37',
                py: 4,
                mt: 8
            }}
        >
            <Container>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" sx={{ color: '#d4af37', mb: 2, fontWeight: 'bold' }}>
                            VIRTUAL MEGA MALL
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#999' }}>
                            Pakistan's first 3D shopping experience. Browse official brand stores and compare products across brands.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" sx={{ color: '#d4af37', mb: 2, fontWeight: 'bold' }}>
                            Quick Links
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <MuiLink href="/products" sx={{ color: '#999', textDecoration: 'none', '&:hover': { color: '#d4af37' } }}>
                                All Products
                            </MuiLink>
                            <MuiLink href="/brands" sx={{ color: '#999', textDecoration: 'none', '&:hover': { color: '#d4af37' } }}>
                                Brands
                            </MuiLink>
                            <MuiLink href="/comparison" sx={{ color: '#999', textDecoration: 'none', '&:hover': { color: '#d4af37' } }}>
                                Compare Products
                            </MuiLink>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" sx={{ color: '#d4af37', mb: 2, fontWeight: 'bold' }}>
                            Support
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <MuiLink href="/contact" sx={{ color: '#999', textDecoration: 'none', '&:hover': { color: '#d4af37' } }}>
                                Contact Us
                            </MuiLink>
                            <MuiLink href="/help" sx={{ color: '#999', textDecoration: 'none', '&:hover': { color: '#d4af37' } }}>
                                Help Center
                            </MuiLink>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ borderTop: '1px solid #333', mt: 4, pt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        © 2025 Virtual Mega Mall. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
