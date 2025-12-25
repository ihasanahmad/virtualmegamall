import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useComparison } from '../../context/ComparisonContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import VoiceSearch from '../VoiceSearch';
import BarcodeScanner from '../BarcodeScanner';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  InputBase,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  ShoppingCart,
  Compare,
  Search,
  Login,
  Logout,
  ListAlt,
  QrCodeScanner,
  Favorite
} from '@mui/icons-material';
import { useState } from 'react';

const Header = () => {
  const { getCartCount } = useCart();
  const { comparisonItems } = useComparison();
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          boxShadow: '0 2px 20px rgba(212, 175, 55, 0.15)'
        }}
      >
        <Toolbar sx={{ gap: 3 }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant="h5"
              sx={{
                color: '#d4af37',
                fontWeight: 'bold',
                letterSpacing: 1,
                minWidth: 'fit-content'
              }}
            >
              VIRTUAL MEGA MALL
            </Typography>
          </Link>

          {/* Search Bar */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              flexGrow: 1,
              maxWidth: 600,
              display: 'flex',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              px: 2,
              py: 0.5,
              border: '1px solid #d4af37'
            }}
          >
            <InputBase
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flexGrow: 1,
                color: '#fff',
                '& ::placeholder': { color: '#999' }
              }}
            />
            <IconButton type="submit" sx={{ color: '#d4af37' }}>
              <Search />
            </IconButton>
          </Box>

          {/* Navigation Icons */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Voice Search */}
            <VoiceSearch />

            {/* Barcode Scanner */}
            <Tooltip title="Scan Barcode">
              <IconButton
                onClick={() => setScannerOpen(true)}
                sx={{ color: '#d4af37' }}
              >
                <QrCodeScanner />
              </IconButton>
            </Tooltip>

            {/* Comparison */}
            <IconButton
              onClick={() => navigate('/comparison')}
              sx={{ color: '#d4af37' }}
            >
              <Badge badgeContent={comparisonItems.length} color="error">
                <Compare />
              </Badge>
            </IconButton>

            {/* Wishlist */}
            <Tooltip title="Wishlist">
              <IconButton
                onClick={() => navigate('/wishlist')}
                sx={{ color: '#d4af37' }}
              >
                <Badge badgeContent={wishlistCount} color="error">
                  <Favorite />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Cart */}
            <IconButton
              onClick={() => navigate('/cart')}
              sx={{ color: '#d4af37' }}
            >
              <Badge badgeContent={getCartCount()} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* Auth Buttons/Menu */}
            {isAuthenticated ? (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ color: '#d4af37' }}
                >
                  <Avatar sx={{ bgcolor: '#d4af37', color: '#1a1a1a', width: 32, height: 32 }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  sx={{
                    '& .MuiPaper-root': {
                      backgroundColor: '#2d2d2d',
                      color: '#fff',
                      mt: 1,
                      minWidth: 180
                    }
                  }}
                >
                  <MenuItem disabled>
                    <Typography variant="body2">{user?.name}</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/orders'); handleMenuClose(); }}>
                    <ListAlt sx={{ mr: 1, color: '#d4af37' }} fontSize="small" />
                    My Orders
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1, color: '#d4af37' }} fontSize="small" />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                startIcon={<Login />}
                onClick={() => navigate('/login')}
                sx={{
                  color: '#fff',
                  borderColor: '#d4af37',
                  '&:hover': { borderColor: '#c19b2a', backgroundColor: 'rgba(212, 175, 55, 0.1)' }
                }}
                variant="outlined"
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />
    </>
  );
};

export default Header;
