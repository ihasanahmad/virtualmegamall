import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService, categoryService, brandService } from '../services/api';
import ProductCard from '../components/Products/ProductCard';
import {
    Container,
    Grid,
    Box,
    Typography,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Slider,
    Button,
    CircularProgress,
    Pagination
} from '@mui/material';
import { FilterList, Close } from '@mui/icons-material';

const ProductCatalog = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [sortBy, setSortBy] = useState('newest');
    const [page, setPage] = useState(1);
    const [showFilters, setShowFilters] = useState(true);

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategories, selectedBrands, priceRange, sortBy, page, searchParams]);

    const fetchCategories = async () => {
        try {
            const response = await categoryService.getAllCategories();
            setCategories(response.data || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await brandService.getAllBrands();
            setBrands(response.data || []);
        } catch (error) {
            console.error('Failed to fetch brands:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 12,
                sort: sortBy
            };

            if (selectedCategories.length > 0) {
                params.category = selectedCategories.join(',');
            }
            if (selectedBrands.length > 0) {
                params.brand = selectedBrands.join(',');
            }
            if (priceRange[0] > 0 || priceRange[1] < 100000) {
                params.minPrice = priceRange[0];
                params.maxPrice = priceRange[1];
            }

            const searchQuery = searchParams.get('search');
            if (searchQuery) {
                params.search = searchQuery;
            }

            const response = await productService.getProducts(params);
            setProducts(response.data || []);
            setTotalPages(response.pagination?.pages || 1);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
        setPage(1);
    };

    const handleBrandChange = (brandId) => {
        setSelectedBrands(prev =>
            prev.includes(brandId)
                ? prev.filter(id => id !== brandId)
                : [...prev, brandId]
        );
        setPage(1);
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        setPriceRange([0, 100000]);
        setSortBy('newest');
        setPage(1);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box display="flex" gap={3}>
                {/* Filters Sidebar */}
                {showFilters && (
                    <Paper
                        sx={{
                            width: 280,
                            p: 3,
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                            border: '1px solid #d4af37',
                            height: 'fit-content',
                            position: 'sticky',
                            top: 80
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h6" sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                                Filters
                            </Typography>
                            <Button
                                size="small"
                                onClick={clearFilters}
                                sx={{ color: '#999' }}
                            >
                                Clear All
                            </Button>
                        </Box>

                        {/* Categories */}
                        <Box mb={3}>
                            <Typography variant="subtitle2" sx={{ color: '#d4af37', mb: 1 }}>
                                Categories
                            </Typography>
                            {categories.map(category => (
                                <FormControlLabel
                                    key={category._id}
                                    control={
                                        <Checkbox
                                            checked={selectedCategories.includes(category._id)}
                                            onChange={() => handleCategoryChange(category._id)}
                                            sx={{
                                                color: '#d4af37',
                                                '&.Mui-checked': { color: '#d4af37' }
                                            }}
                                        />
                                    }
                                    label={category.name}
                                    sx={{ color: '#fff', display: 'block' }}
                                />
                            ))}
                        </Box>

                        {/* Brands */}
                        <Box mb={3}>
                            <Typography variant="subtitle2" sx={{ color: '#d4af37', mb: 1 }}>
                                Brands
                            </Typography>
                            {brands.slice(0, 10).map(brand => (
                                <FormControlLabel
                                    key={brand._id}
                                    control={
                                        <Checkbox
                                            checked={selectedBrands.includes(brand._id)}
                                            onChange={() => handleBrandChange(brand._id)}
                                            sx={{
                                                color: '#d4af37',
                                                '&.Mui-checked': { color: '#d4af37' }
                                            }}
                                        />
                                    }
                                    label={brand.name}
                                    sx={{ color: '#fff', display: 'block' }}
                                />
                            ))}
                        </Box>

                        {/* Price Range */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ color: '#d4af37', mb: 2 }}>
                                Price Range: Rs. {priceRange[0].toLocaleString()} - Rs. {priceRange[1].toLocaleString()}
                            </Typography>
                            <Slider
                                value={priceRange}
                                onChange={(e, newValue) => setPriceRange(newValue)}
                                onChangeCommitted={() => setPage(1)}
                                min={0}
                                max={100000}
                                step={1000}
                                sx={{
                                    color: '#d4af37',
                                    '& .MuiSlider-thumb': {
                                        '&:hover, &.Mui-focusVisible': {
                                            boxShadow: '0 0 0 8px rgba(212, 175, 55, 0.16)'
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </Paper>
                )}

                {/* Products Grid */}
                <Box flexGrow={1}>
                    {/* Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                            Products {searchParams.get('search') && `· "${searchParams.get('search')}"`}
                        </Typography>
                        <Box display="flex" gap={2} alignItems="center">
                            <Button
                                variant="outlined"
                                startIcon={showFilters ? <Close /> : <FilterList />}
                                onClick={() => setShowFilters(!showFilters)}
                                sx={{
                                    color: '#d4af37',
                                    borderColor: '#d4af37',
                                    '&:hover': { borderColor: '#c19b2a' }
                                }}
                            >
                                {showFilters ? 'Hide' : 'Show'} Filters
                            </Button>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel sx={{ color: '#d4af37' }}>Sort By</InputLabel>
                                <Select
                                    value={sortBy}
                                    label="Sort By"
                                    onChange={(e) => {
                                        setSortBy(e.target.value);
                                        setPage(1);
                                    }}
                                    sx={{
                                        color: '#fff',
                                        '.MuiOutlinedInput-notchedOutline': { borderColor: '#d4af37' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#d4af37' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#d4af37' }
                                    }}
                                >
                                    <MenuItem value="newest">Newest</MenuItem>
                                    <MenuItem value="price-asc">Price: Low to High</MenuItem>
                                    <MenuItem value="price-desc">Price: High to Low</MenuItem>
                                    <MenuItem value="popular">Most Popular</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>

                    {/* Loading */}
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                            <CircularProgress sx={{ color: '#d4af37' }} />
                        </Box>
                    ) : products.length === 0 ? (
                        <Box textAlign="center" py={8}>
                            <Typography variant="h6" sx={{ color: '#999' }}>
                                No products found
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {/* Product Grid */}
                            <Grid container spacing={3}>
                                {products.map(product => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                                        <ProductCard product={product} />
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Box display="flex" justifyContent="center" mt={4}>
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={(e, value) => setPage(value)}
                                        color="primary"
                                        sx={{
                                            '& .MuiPaginationItem-root': {
                                                color: '#fff',
                                                borderColor: '#d4af37'
                                            },
                                            '& .Mui-selected': {
                                                backgroundColor: '#d4af37',
                                                color: '#1a1a1a',
                                                '&:hover': { backgroundColor: '#c19b2a' }
                                            }
                                        }}
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default ProductCatalog;
