import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { useSettings } from './SettingsContext';
import cartService from '../services/cartService';
import { trackAddToCart } from '../utils/facebookPixel';

const CartContext = createContext(null);

const GUEST_CART_KEY = 'vision_guest_cart';

export function CartProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { settings } = useSettings();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const isSyncingRef = useRef(false);

  // Load guest cart safely from localStorage
  const loadGuestCart = () => {
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Save guest cart safely to localStorage
  const saveGuestCart = (items) => {
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: { source: 'local' } }));
    } catch (e) {
      console.error('Failed to save guest cart to localStorage', e);
    }
  };

  // Fetch remote cart or local guest cart
  const refreshCart = useCallback(async () => {
    if (authLoading) return;

    setLoading(true);
    if (isAuthenticated) {
      try {
        const res = await cartService.getCart();
        if (res.status === 'success') {
          setCartItems(res.data?.items || []);
        }
      } catch (err) {
        console.warn('Could not fetch server cart, falling back to local state:', err.message);
        setCartItems(loadGuestCart());
      }
    } else {
      setCartItems(loadGuestCart());
    }
    setLoading(false);
  }, [isAuthenticated, authLoading]);

  // Handle guest cart merge upon authentication
  useEffect(() => {
    if (authLoading) return;

    const handleAuthSync = async () => {
      if (isAuthenticated) {
        const guestItems = loadGuestCart();
        if (guestItems.length > 0 && !isSyncingRef.current) {
          isSyncingRef.current = true;
          try {
            await cartService.mergeCart(
              guestItems.map((item) => ({
                product_id: parseInt(String(item.product_id || item.id).replace(/\D/g, ''), 10),
                quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
              }))
            );
            localStorage.removeItem(GUEST_CART_KEY);
          } catch (err) {
            console.error('Error merging guest cart into account:', err);
          } finally {
            isSyncingRef.current = false;
          }
        }
      }
      refreshCart();
    };

    handleAuthSync();
  }, [isAuthenticated, authLoading, refreshCart]);

  // Cross-tab and external sync listener
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === GUEST_CART_KEY && !isAuthenticated) {
        try {
          const updated = e.newValue ? JSON.parse(e.newValue) : [];
          setCartItems(updated);
        } catch {
          // ignore parsing error
        }
      }
    };

    const handleCustomUpdate = (e) => {
      if (e.detail?.source !== 'local') {
        refreshCart();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cart-updated', handleCustomUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cart-updated', handleCustomUpdate);
    };
  }, [isAuthenticated, refreshCart]);

  // Add product to cart
  const addToCart = async (product, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const rawId = product.product_id || product.id;
    const productId = parseInt(String(rawId).replace(/\D/g, ''), 10);

    if (!productId || isNaN(productId)) {
      toast.error('Invalid product specified.');
      return false;
    }

    if (isAuthenticated) {
      try {
        const res = await cartService.addToCart(productId, qty);
        if (res.status === 'success') {
          setCartItems(res.data?.items || []);
          toast.success(`Added ${product.name} to bag!`);
          trackAddToCart(product, qty);
          window.dispatchEvent(new CustomEvent('cart-updated', { detail: { source: 'local' } }));
          return true;
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to add item to bag.';
        toast.error(msg);
        return false;
      }
    } else {
      // Guest local storage cart
      const current = loadGuestCart();
      const existingIdx = current.findIndex(
        (i) => parseInt(String(i.product_id || i.id).replace(/\D/g, ''), 10) === productId
      );

      const maxStock = product.stock !== undefined ? product.stock : 99;

      if (existingIdx > -1) {
        const newQty = current[existingIdx].quantity + qty;
        if (newQty > maxStock) {
          toast.error(`Cannot exceed available stock (${maxStock} units).`);
          return false;
        }
        current[existingIdx].quantity = newQty;
      } else {
        if (qty > maxStock) {
          toast.error(`Cannot exceed available stock (${maxStock} units).`);
          return false;
        }
        current.push({
          id: `guest-${productId}`,
          product_id: productId,
          name: product.name,
          slug: product.slug,
          brand: product.brand || 'VISION EYE CARE',
          price: parseFloat(product.price) || 0,
          compare_price: product.compare_price ? parseFloat(product.compare_price) : null,
          stock: maxStock,
          quantity: qty,
          primary_image:
            product.primary_image ||
            product.images?.[0]?.image_url ||
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
        });
      }

      saveGuestCart(current);
      setCartItems([...current]);
      toast.success(`Added ${product.name} to bag!`);
      trackAddToCart(product, qty);
      return true;
    }
  };

  // Update item quantity with instant optimistic UI update
  const updateQuantity = async (itemIdOrProductId, delta) => {
    const prevItems = [...cartItems];
    const item = cartItems.find(
      (i) => i.id === itemIdOrProductId || i.product_id === itemIdOrProductId
    );
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      return removeFromCart(itemIdOrProductId);
    }

    if (item.stock && newQty > item.stock) {
      toast.error(`Only ${item.stock} units available in stock.`);
      return;
    }

    // 1. Optimistic update
    const updatedItems = cartItems.map((i) => {
      if (i.id === item.id || i.product_id === item.product_id) {
        return { ...i, quantity: newQty };
      }
      return i;
    });
    setCartItems(updatedItems);

    // 2. Persist
    if (isAuthenticated && typeof item.id === 'number') {
      try {
        const res = await cartService.updateQuantity(item.id, newQty);
        if (res.status === 'success' && res.data?.items) {
          setCartItems(res.data.items);
          window.dispatchEvent(new CustomEvent('cart-updated', { detail: { source: 'local' } }));
        }
      } catch (err) {
        // Rollback on failure
        setCartItems(prevItems);
        toast.error(err.response?.data?.message || 'Could not update quantity.');
      }
    } else {
      saveGuestCart(updatedItems);
    }
  };

  // Remove single item with optimistic update
  const removeFromCart = async (itemIdOrProductId) => {
    const prevItems = [...cartItems];
    const item = cartItems.find(
      (i) => i.id === itemIdOrProductId || i.product_id === itemIdOrProductId
    );
    if (!item) return;

    // 1. Optimistic remove
    const updated = cartItems.filter(
      (i) => i.id !== item.id && i.product_id !== item.product_id
    );
    setCartItems(updated);
    toast.success('Item removed from cart');

    // 2. Persist
    if (isAuthenticated && typeof item.id === 'number') {
      try {
        const res = await cartService.removeFromCart(item.id);
        if (res.status === 'success' && res.data?.items) {
          setCartItems(res.data.items);
          window.dispatchEvent(new CustomEvent('cart-updated', { detail: { source: 'local' } }));
        }
      } catch (err) {
        setCartItems(prevItems);
        toast.error('Failed to remove item.');
      }
    } else {
      saveGuestCart(updated);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.error('Error clearing remote cart:', err);
      }
    }
    localStorage.removeItem(GUEST_CART_KEY);
    setCartItems([]);
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: { source: 'local' } }));
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1),
    0
  );
  const threshold = settings?.freeShippingThreshold ?? 5000;
  const standardFee = settings?.insideDhakaFee ?? 60;
  const deliveryFee = cartItems.length > 0 ? (subtotal >= threshold ? 0 : standardFee) : 0;
  const total = subtotal + deliveryFee;
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        deliveryFee,
        total,
        loading: loading || authLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
