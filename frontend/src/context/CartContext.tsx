import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, weightOption?: string) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('svk-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('svk-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, weightOption?: string) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id && item.selectedWeight === weightOption);
      if (existing) {
        return current.map((item) => item.id === product.id && item.selectedWeight === weightOption ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1, selectedWeight: weightOption ?? product.weightOptions?.split(',')[0] }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item)).filter((item) => item.quantity > 0));
  };

  const removeFromCart = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  return <CartContext.Provider value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, itemCount, subtotal }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
