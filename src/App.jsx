import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { CartProvider } from './context/CartContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import CustomerLayout from './components/Layout/CustomerLayout';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Comparison from './pages/Comparison';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#d4af37',
    },
    secondary: {
      main: '#2d2d2d',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#999999',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ComparisonProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<CustomerLayout />}>
                    <Route index element={<Home />} />
                    <Route path="products" element={<ProductCatalog />} />
                    <Route path="products/:id" element={<ProductDetails />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="checkout" element={
                      <PrivateRoute>
                        <Checkout />
                      </PrivateRoute>
                    } />
                    <Route path="comparison" element={<Comparison />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="login" element={<Login />} />
                    <Route path="orders" element={
                      <PrivateRoute>
                        <OrderHistory />
                      </PrivateRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </ComparisonProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
