import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Auto load authenticated user profile on initial render
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken) {
        // If it's a demo offline token, restore immediately
        if (storedToken.startsWith('demo-') && storedUser) {
          try {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
          } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
          setLoading(false);
          return;
        }

        try {
          const response = await authService.getMe();
          if (response.status === 'success' && response.user) {
            setUser(response.user);
            setToken(storedToken);
            localStorage.setItem('user', JSON.stringify(response.user));
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        } catch {
          // If server is unreachable or returning 405/offline, preserve local session if present
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
              setToken(storedToken);
            } catch {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setToken(null);
              setUser(null);
            }
          } else {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      if (data.status === 'success' && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      }
      return data;
    } catch (err) {
      const status = err.response?.status;
      const isMethodNotAllowed = status === 405; // Happens on static hosts (Vercel/preview)
      const isNotFound = status === 404;
      const isNetworkError = !err.response || err.code === 'ERR_NETWORK';

      const cleanEmail = (email || '').trim().toLowerCase();

      // Graceful offline demo fallback if backend is unreachable or returning 405
      if ((isMethodNotAllowed || isNotFound || isNetworkError) && cleanEmail === 'admin@visioneyecare.com' && password === 'Admin@123') {
        const mockAdminUser = {
          id: 1,
          name: 'Admin',
          full_name: 'Admin',
          email: 'admin@visioneyecare.com',
          phone: '+8801700000000',
          role: 'admin',
          is_active: true,
        };
        const demoToken = 'demo-admin-jwt-token-vision-eye-care';
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(mockAdminUser));
        setToken(demoToken);
        setUser(mockAdminUser);
        return {
          status: 'success',
          message: 'Logged in as Admin (Demo/Offline Mode)',
          user: mockAdminUser,
          token: demoToken,
        };
      }

      if ((isMethodNotAllowed || isNotFound || isNetworkError) && cleanEmail === 'rahim@example.com' && password === 'Customer@123') {
        const mockCustomerUser = {
          id: 2,
          name: 'Rahim Ahmed',
          full_name: 'Rahim Ahmed',
          email: 'rahim@example.com',
          phone: '+8801711111111',
          role: 'customer',
          is_active: true,
        };
        const demoToken = 'demo-customer-jwt-token-vision-eye-care';
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(mockCustomerUser));
        setToken(demoToken);
        setUser(mockCustomerUser);
        return {
          status: 'success',
          message: 'Logged in as Customer (Demo/Offline Mode)',
          user: mockCustomerUser,
          token: demoToken,
        };
      }

      throw err;
    }
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    if (data.status === 'success' && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout API warning:', err.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
