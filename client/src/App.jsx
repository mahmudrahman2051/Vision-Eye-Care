import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Splash Screen
import SplashScreen from './components/SplashScreen/SplashScreen';

// Pages
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import PlaceholderPage from './pages/PlaceholderPage/PlaceholderPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShopPage from './pages/Shop/ShopPage';
import ProductDetailsPage from './pages/ProductDetails/ProductDetailsPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashFinish = useCallback(() => setShowSplash(false), []);
  return (
    <AuthProvider>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#171717',
              color: '#FFFFFF',
              border: '1px solid #292929',
              borderRadius: '8px',
              fontSize: '0.875rem',
            },
            success: {
              iconTheme: {
                primary: '#8B7355',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="product/:id" element={<ProductDetailsPage />} />
            <Route path="about" element={<PlaceholderPage title="About Us" phase={10} />} />
            <Route path="contact" element={<PlaceholderPage title="Contact Us" phase={10} />} />
            <Route path="faq" element={<PlaceholderPage title="FAQ" phase={10} />} />
            <Route path="privacy" element={<PlaceholderPage title="Privacy Policy" phase={10} />} />
            <Route path="terms" element={<PlaceholderPage title="Terms & Conditions" phase={10} />} />

            {/* Auth Routes (Phase 3) */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Customer Routes (Phase 5–7) */}
            <Route path="cart" element={<CartPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="checkout" element={<PlaceholderPage title="Checkout" phase={6} />} />
            <Route path="order-success/:id" element={<PlaceholderPage title="Order Confirmation" phase={6} />} />
            <Route path="account" element={<PlaceholderPage title="My Account" phase={7} />} />
            <Route path="account/orders" element={<PlaceholderPage title="Order History" phase={7} />} />
            <Route path="account/orders/:id" element={<PlaceholderPage title="Order Details" phase={7} />} />

            {/* Admin Routes (Phase 8–9) */}
            <Route path="admin" element={<PlaceholderPage title="Admin Dashboard" phase={8} />} />
            <Route path="admin/products" element={<PlaceholderPage title="Manage Products" phase={9} />} />
            <Route path="admin/products/new" element={<PlaceholderPage title="Add Product" phase={9} />} />
            <Route path="admin/products/:id" element={<PlaceholderPage title="Edit Product" phase={9} />} />
            <Route path="admin/users" element={<PlaceholderPage title="Manage Users" phase={9} />} />
            <Route path="admin/orders" element={<PlaceholderPage title="Manage Orders" phase={9} />} />
            <Route path="admin/orders/:id" element={<PlaceholderPage title="Order Details" phase={9} />} />
            <Route path="admin/categories" element={<PlaceholderPage title="Manage Categories" phase={9} />} />
            <Route path="admin/coupons" element={<PlaceholderPage title="Manage Coupons" phase={9} />} />
            <Route path="admin/reviews" element={<PlaceholderPage title="Manage Reviews" phase={9} />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
