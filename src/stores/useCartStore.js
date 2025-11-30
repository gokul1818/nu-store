import create from "zustand";

// Helper to compare selectedOptions objects
const isSameVariant = (a, b) => {
  if (!a || !b) return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => a[key] === b[key]);
};

const useCartStore = create((set, get) => ({
  cart: JSON.parse(localStorage.getItem("cart")) || [],

  addItem: (item) => {
    const { cart } = get();

    const index = cart.findIndex(
      (i) => i.id === item.id && isSameVariant(i.selectedOptions, item.selectedOptions)
    );

    let updatedCart;
    if (index > -1) {
      updatedCart = [...cart];
      updatedCart[index].qty += item.qty || 1;
    } else {
      updatedCart = [...cart, { ...item, qty: item.qty || 1 }];
    }

    set({ cart: updatedCart });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  },

  updateQty: (id, qty, selectedOptions) => {
    const updatedCart = get().cart.map((item) =>
      item.id === id && isSameVariant(item.selectedOptions, selectedOptions)
        ? { ...item, qty }
        : item
    );
    set({ cart: updatedCart });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  },

  removeItem: (id, selectedOptions) => {
    const updatedCart = get().cart.filter(
      (item) => !(item.id === id && isSameVariant(item.selectedOptions, selectedOptions))
    );
    set({ cart: updatedCart });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  },

  clearCart: () => {
    set({ cart: [] });
    localStorage.removeItem("cart");
  },
}));

export default useCartStore;
