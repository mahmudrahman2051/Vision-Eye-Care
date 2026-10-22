import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import wishlistService from '../services/wishlistService';

const WishlistContext = createContext(null);

const GUEST_WISHLIST_KEY = 'drishti_guest_wishlist';

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadGuestWishlist = () => {
    try {
      const stored = localStorage.getItem(GUEST_WISHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveGuestWishlist = (items) => {
    try {
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save guest wishlist:', e);
    }
  };

  const refreshWishlist = useCallback(async () => {
    setLoading(true);
    if (isAuthenticated) {
      try {
        const res = await wishlistService.getWishlist();
        if (res.status === 'success') {
          setWishlistItems(res.data || []);
        }
      } catch (err) {
        console.warn('Could not fetch server wishlist:', err.message);
        setWishlistItems(loadGuestWishlist());
      }
    } else {
      setWishlistItems(loadGuestWishlist());
    }
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => (item.product_id || item.id) === productId
    );
  };

  const addToWishlist = async (product) => {
    const productId = product.product_id || product.id;

    if (isAuthenticated) {
      try {
        const res = await wishlistService.addToWishlist(productId);
        if (res.status === 'success') {
          setWishlistItems(res.data || []);
          toast.success(`Saved to your wishlist!`);
          return true;
        }
      } catch (err) {
        toast.error('Could not add to wishlist.');
        return false;
      }
    } else {
      const current = loadGuestWishlist();
      if (!current.some((i) => (i.product_id || i.id) === productId)) {
        current.push({
          id: `guest-wish-${productId}`,
          product_id: productId,
          name: product.name,
          slug: product.slug,
          brand: product.brand || 'Drishti',
          price: parseFloat(product.price) || 0,
          compare_price: product.compare_price ? parseFloat(product.compare_price) : null,
          primary_image:
            product.primary_image ||
            product.images?.[0]?.image_url ||
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
        });
        saveGuestWishlist(current);
        setWishlistItems([...current]);
        toast.success(`Saved to your wishlist!`);
        return true;
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await wishlistService.removeFromWishlist(productId);
        if (res.status === 'success') {
          setWishlistItems(res.data || []);
          toast.success('Removed from wishlist');
          return true;
        }
      } catch (err) {
        toast.error('Could not remove from wishlist.');
        return false;
      }
    } else {
      const current = loadGuestWishlist().filter(
        (i) => (i.product_id || i.id) !== productId
      );
      saveGuestWishlist(current);
      setWishlistItems(current);
      toast.success('Removed from wishlist');
      return true;
    }
  };

  const toggleWishlist = async (product) => {
    const productId = product.product_id || product.id;
    if (isInWishlist(productId)) {
      return removeFromWishlist(productId);
    } else {
      return addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        loading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
