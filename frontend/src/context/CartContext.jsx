import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("foodiehub-cart") || "{}"); }
    catch { return {}; }
  });
  useEffect(() => { localStorage.setItem("foodiehub-cart", JSON.stringify(cart)); }, [cart]);
  const addToCart = dish => setCart(prev => ({ ...prev, [dish.id]: { ...dish, qty: (prev[dish.id]?.qty || 0) + 1 } }));
  const updateQty = (id, delta) => setCart(prev => {
    const next = { ...prev };
    if (!next[id]) return prev;
    const qty = next[id].qty + delta;
    if (qty <= 0) delete next[id]; else next[id] = { ...next[id], qty };
    return next;
  });
  const removeItem = id => setCart(prev => { const next = { ...prev }; delete next[id]; return next; });
  const clearCart = () => setCart({});
  const cartCount = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = Object.values(cart).reduce((sum, item) => sum + item.price * item.qty, 0);
  const value = useMemo(() => ({ cart, addToCart, updateQty, removeItem, clearCart, cartCount, cartTotal }), [cart, cartCount, cartTotal]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
