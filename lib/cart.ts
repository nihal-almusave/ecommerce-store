/**
 * Cart utility functions for managing cart state in localStorage
 */

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const CART_STORAGE_KEY = 'tannaro_cart';

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

export const saveCart = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1): CartItem[] => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);

  if (existingItemIndex >= 0) {
    // Update quantity if item already exists
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.push({ ...item, quantity });
  }

  saveCart(cart);
  return cart;
};

export const updateCartItemQuantity = (itemId: string, quantity: number): CartItem[] => {
  const cart = getCart();
  const itemIndex = cart.findIndex((item) => item.id === itemId);

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
    saveCart(cart);
  }

  return cart;
};

export const removeFromCart = (itemId: string): CartItem[] => {
  const cart = getCart();
  const filteredCart = cart.filter((item) => item.id !== itemId);
  saveCart(filteredCart);
  return filteredCart;
};

export const clearCart = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_STORAGE_KEY);
  window.dispatchEvent(new Event('cartUpdated'));
};

export const getCartItemCount = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

export const getCartTotal = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

