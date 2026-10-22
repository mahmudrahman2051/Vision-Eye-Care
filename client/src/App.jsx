import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SettingsProvider } from './context/SettingsContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './admin/AdminLayout';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Splash Screen
import SplashScreen from './components/SplashScreen/SplashScreen';

// Public & Customer Pages
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShopPage from './pages/Shop/ShopPage';
import ProductDetailsPage from './pages/ProductDetails/ProductDetailsPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AccountPage from './pages/AccountPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

// Admin Pages
import AdminDashboardPage from './admin/AdminDashboardPage';
import AdminProductsPage from './admin/AdminProductsPage';
import AdminProductFormPage from './admin/AdminProductFormPage';
import AdminOrdersPage from './admin/AdminOrdersPage';
import AdminUsersPage from './admin/AdminUsersPage';
import AdminCategoriesPage from './admin/AdminCategoriesPage';
import AdminCouponsPage from './admin/AdminCouponsPage';
import AdminReviewsPage from './admin/AdminReviewsPage';
import AdminTickerPage from './admin/AdminTickerPage';
import AdminSettingsPage from './admin/AdminSettingsPage';
import AdminBannersPage from './admin/AdminBannersPage';
import AdminInquiriesPage from './admin/AdminInquiriesPage';
import AdminSubscribersPage from './admin/AdminSubscribersPage';
import FacebookPixelTracker from './components/Tracking/FacebookPixelTracker';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashFinish = useCallback(() => setShowSplash(false), []);

  return (
    <AuthProvider>
      <SettingsProvider>
        <WishlistProvider>
          <CartProvider>
          {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
          <BrowserRouter>
            <FacebookPixelTracker />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1A1A1A',
                  color: '#FFFFFF',
                  border: '1px solid #2D2D2D',
                  borderRadius: '12px',
                  fontSize: '0.8125rem',
                  fontFamily: 'inherit',
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
              {/* Storefront Layout */}
              <Route path="/" element={<MainLayout />}>
                {/* Public Pages */}
                <Route index element={<Home />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="product/:id" element={<ProductDetailsPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="faq" element={<FaqPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="terms" element={<TermsPage />} />

                {/* Auth */}
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />

                {/* Cart & Wishlist */}
                <Route path="cart" element={<CartPage />} />
                <Route path="wishlist" element={<WishlistPage />} />

                {/* Checkout & Order Success */}
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="order-success/:id" element={<OrderSuccessPage />} />

                {/* Protected Customer Account */}
                <Route
                  path="account"
                  element={
                    <ProtectedRoute>
                      <AccountPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="account/orders"
                  element={
                    <ProtectedRoute>
                      <AccountPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="account/orders/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Dedicated Admin Portal */}
              <Route
                path="admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="products/new" element={<AdminProductFormPage />} />
                <Route path="products/:id" element={<AdminProductFormPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="coupons" element={<AdminCouponsPage />} />
                <Route path="reviews" element={<AdminReviewsPage />} />
                <Route path="ticker" element={<AdminTickerPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="banners" element={<AdminBannersPage />} />
                <Route path="inquiries" element={<AdminInquiriesPage />} />
                <Route path="subscribers" element={<AdminSubscribersPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </SettingsProvider>
  </AuthProvider>
);
}
