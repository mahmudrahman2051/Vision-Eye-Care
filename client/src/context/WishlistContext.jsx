import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import wishlistService from '../services/wishlistService';
import { trackAddToWishlist } from '../utils/facebookPixel';

const WishlistContext = createContext(null);

const GUEST_WISHLIST_KEY = 'vision_guest_wishlist';

export function WishlistProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const isSyncingRef = useRef(false);

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
      window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { source: 'local' } }));
    } catch (e) {
      console.error('Failed to save guest wishlist:', e);
    }
  };

  const refreshWishlist = useCallback(async () => {
    if (authLoading) return;

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
  }, [isAuthenticated, authLoading]);

  // Merge guest wishlist into user account upon authentication
  useEffect(() => {
    if (authLoading) return;

    const handleAuthSync = async () => {
      if (isAuthenticated) {
        const guestItems = loadGuestWishlist();
        if (guestItems.length > 0 && !isSyncingRef.current) {
          isSyncingRef.current = true;
          try {
            await wishlistService.mergeWishlist(
              guestItems.map((item) => ({
                product_id: parseInt(String(item.product_id || item.id).replace(/\D/g, ''), 10),
              }))
            );
            localStorage.removeItem(GUEST_WISHLIST_KEY);
          } catch (err) {
            console.error('Error merging guest wishlist:', err);
          } finally {
            isSyncingRef.current = false;
          }
        }
      }
      refreshWishlist();
    };

    handleAuthSync();
  }, [isAuthenticated, authLoading, refreshWishlist]);

  // Cross-tab and external sync listener
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === GUEST_WISHLIST_KEY && !isAuthenticated) {
        try {
          const updated = e.newValue ? JSON.parse(e.newValue) : [];
          setWishlistItems(updated);
        } catch {
          // ignore parsing error
        }
      }
    };

    const handleCustomUpdate = (e) => {
      if (e.detail?.source !== 'local') {
        refreshWishlist();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('wishlist-updated', handleCustomUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wishlist-updated', handleCustomUpdate);
    };
  }, [isAuthenticated, refreshWishlist]);

  const isInWishlist = (rawId) => {
    const targetId = parseInt(String(rawId).replace(/\D/g, ''), 10);
    return wishlistItems.some((item) => {
      const pId = parseInt(String(item.product_id || item.id).replace(/\D/g, ''), 10);
      return pId === targetId;
    });
  };

  const addToWishlist = async (product) => {
    const rawId = product.product_id || product.id;
    const productId = parseInt(String(rawId).replace(/\D/g, ''), 10);

    if (!productId || isNaN(productId)) {
      toast.error('Invalid product specified.');
      return false;
    }

    if (isAuthenticated) {
      try {
        const res = await wishlistService.addToWishlist(productId);
        if (res.status === 'success') {
          setWishlistItems(res.data || []);
          toast.success('Saved to your wishlist!');
          trackAddToWishlist(product);
          window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { source: 'local' } }));
          return true;
        }
      } catch (err) {
        toast.error('Could not add to wishlist.');
        return false;
      }
    } else {
      const current = loadGuestWishlist();
      const alreadyIn = current.some(
        (i) => parseInt(String(i.product_id || i.id).replace(/\D/g, ''), 10) === productId
      );

      if (!alreadyIn) {
        current.push({
          id: `guest-wish-${productId}`,
          product_id: productId,
          name: product.name,
          slug: product.slug,
          brand: product.brand || 'VISION EYE CARE',
          price: parseFloat(product.price) || 0,
          compare_price: product.compare_price ? parseFloat(product.compare_price) : null,
          primary_image:
            product.primary_image ||
            product.images?.[0]?.image_url ||
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
        });
        saveGuestWishlist(current);
        setWishlistItems([...current]);
        toast.success('Saved to your wishlist!');
        trackAddToWishlist(product);
        return true;
      }
    }
  };

  const removeFromWishlist = async (rawId) => {
    const targetId = parseInt(String(rawId).replace(/\D/g, ''), 10);
    const prevItems = [...wishlistItems];

    // Optimistic remove
    const updated = wishlistItems.filter((i) => {
      const pId = parseInt(String(i.product_id || i.id).replace(/\D/g, ''), 10);
      return pId !== targetId;
    });
    setWishlistItems(updated);
    toast.success('Removed from wishlist');

    if (isAuthenticated) {
      try {
        const res = await wishlistService.removeFromWishlist(targetId);
        if (res.status === 'success' && res.data) {
          setWishlistItems(res.data);
          window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { source: 'local' } }));
        }
      } catch (err) {
        setWishlistItems(prevItems);
        toast.error('Could not remove from wishlist.');
        return false;
      }
    } else {
      saveGuestWishlist(updated);
    }
    return true;
  };

  const toggleWishlist = async (product) => {
    const rawId = product.product_id || product.id;
    const productId = parseInt(String(rawId).replace(/\D/g, ''), 10);
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
        loading: loading || authLoading,
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
