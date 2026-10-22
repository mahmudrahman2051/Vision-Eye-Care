import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import cartService from '../services/cartService';

const CartContext = createContext(null);

const GUEST_CART_KEY = 'drishti_guest_cart';

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load guest cart from local storage
  const loadGuestCart = () => {
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Save guest cart to local storage
  const saveGuestCart = (items) => {
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save guest cart to localStorage', e);
    }
  };

  // Refresh cart from server (if authenticated) or localStorage (if guest)
  const refreshCart = useCallback(async () => {
    setLoading(true);
    if (isAuthenticated) {
      try {
        const res = await cartService.getCart();
        if (res.status === 'success') {
          setCartItems(res.data.items || []);
        }
      } catch (err) {
        console.warn('Could not fetch server cart, falling back to local state:', err.message);
        const guestItems = loadGuestCart();
        setCartItems(guestItems);
      }
    } else {
      const guestItems = loadGuestCart();
      setCartItems(guestItems);
    }
    setLoading(false);
  }, [isAuthenticated]);

  // Handle cart merge on login
  useEffect(() => {
    const handleLoginCartSync = async () => {
      if (isAuthenticated) {
        const guestItems = loadGuestCart();
        if (guestItems.length > 0) {
          try {
            await cartService.mergeCart(
              guestItems.map((item) => ({
                product_id: item.product_id || item.id,
                quantity: item.quantity,
              }))
            );
            localStorage.removeItem(GUEST_CART_KEY);
          } catch (err) {
            console.error('Error merging guest cart:', err);
          }
        }
        refreshCart();
      } else {
        refreshCart();
      }
    };

    handleLoginCartSync();
  }, [isAuthenticated, refreshCart]);

  // Add product to cart
  const addToCart = async (product, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const productId = product.product_id || product.id;

    if (isAuthenticated) {
      try {
        const res = await cartService.addToCart(productId, qty);
        if (res.status === 'success') {
          setCartItems(res.data.items || []);
          toast.success(`Added ${product.name} to cart!`);
          return true;
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to add item to cart.';
        toast.error(msg);
        return false;
      }
    } else {
      // Guest local storage cart
      const current = loadGuestCart();
      const existingIdx = current.findIndex(
        (i) => (i.product_id || i.id) === productId
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
          brand: product.brand || 'Drishti',
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
      toast.success(`Added ${product.name} to cart!`);
      return true;
    }
  };

  // Update item quantity
  const updateQuantity = async (itemIdOrProductId, delta) => {
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

    if (isAuthenticated && typeof item.id === 'number') {
      try {
        const res = await cartService.updateQuantity(item.id, newQty);
        if (res.status === 'success') {
          setCartItems(res.data.items || []);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Could not update quantity.');
      }
    } else {
      // Local update
      const current = loadGuestCart().map((i) => {
        if (i.id === item.id || i.product_id === item.product_id) {
          return { ...i, quantity: newQty };
        }
        return i;
      });
      saveGuestCart(current);
      setCartItems(current);
    }
  };

  // Remove single item
  const removeFromCart = async (itemIdOrProductId) => {
    const item = cartItems.find(
      (i) => i.id === itemIdOrProductId || i.product_id === itemIdOrProductId
    );
    if (!item) return;

    if (isAuthenticated && typeof item.id === 'number') {
      try {
        const res = await cartService.removeFromCart(item.id);
        if (res.status === 'success') {
          setCartItems(res.data.items || []);
          toast.success('Item removed from cart');
        }
      } catch (err) {
        toast.error('Failed to remove item.');
      }
    } else {
      const current = loadGuestCart().filter(
        (i) => i.id !== item.id && i.product_id !== item.product_id
      );
      saveGuestCart(current);
      setCartItems(current);
      toast.success('Item removed from cart');
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.error(err);
      }
    }
    localStorage.removeItem(GUEST_CART_KEY);
    setCartItems([]);
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1),
    0
  );
  const deliveryFee = cartItems.length > 0 ? (subtotal >= 5000 ? 0 : 100) : 0;
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
        loading,
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
