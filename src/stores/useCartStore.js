import create from "zustand";

const useCartStore = create((set, get) => ({
  cart: JSON.parse(localStorage.getItem("cart")) || [],

  addItem: (item) => {
    const { cart } = get();

    // Check if same product + variant already exists
    const index = cart.findIndex(
      (i) =>
        i._id === item._id &&
        JSON.stringify(i.selectedOptions) ===
          JSON.stringify(item.selectedOptions)
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
      item._id === id &&
      JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
        ? { ...item, qty }
        : item
    );
    set({ cart: updatedCart });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  },

  removeItem: (id, selectedOptions) => {
    const updatedCart = get().cart.filter(
      (item) =>
        !(
          item._id === id &&
          JSON.stringify(item.selectedOptions) ===
            JSON.stringify(selectedOptions)
        )
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
