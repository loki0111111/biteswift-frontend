import { createContext, useContext, useState } from "react";

const CustomerContext = createContext(null);

export function useCustomerContext() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomerContext must be used within CustomerApp");
  return ctx;
}

export function CustomerProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const addToCart = (product) => {
    // Multi-business guard
    if (cartItems.length > 0) {
      const cartBusiness = cartItems[0].businessName;
      const productBusiness = product.businessName;

      if (cartBusiness && productBusiness && cartBusiness !== productBusiness) {
        const confirmed = window.confirm(
          `Your cart has items from ${cartBusiness}. Do you want to clear your cart and start a new one?`
        );
        if (confirmed) {
          setCartItems([{ ...product, qty: 1 }]);
        }
        return;
      }
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // Cap at stock if available
        const maxQty = product.stock ?? existing.stock ?? Infinity;
        if (existing.qty >= maxQty) return prev; // already at max
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateCart = (newItems) => {
    // Enforce stock cap on manual quantity updates (e.g. CartPage +/- buttons)
    const capped = newItems.map(item => {
      const maxQty = item.stock ?? Infinity;
      return { ...item, qty: Math.min(item.qty, maxQty) };
    });
    setCartItems(capped);
  };

  const clearCart = () => setCartItems([]);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CustomerContext.Provider
      value={{ cartItems, addToCart, updateCart, clearCart, cartCount, searchQuery, setSearchQuery }}
    >
      {children}
    </CustomerContext.Provider>
  );
}