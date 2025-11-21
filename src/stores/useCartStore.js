import create from "zustand";

const useCartStore = create((set, get) => ({
  cart: [],

  addItem: (item) => {
    const { cart } = get();

    // Check if item with same variant exists
    const index = cart.findIndex(
      (i) =>
        i._id === item.productId &&
        JSON.stringify(i.selectedOptions) === JSON.stringify(item.variant)
    );

    if (index > -1) {
      // Increase qty
      const updated = [...cart];
      updated[index].qty += item.qty || 1;
      set({ cart: updated });
    } else {
      // Add new item
      set({
        cart: [
          ...cart,
          {
            _id: item.productId,
            name: item.name || "Product",
            price: item.price || 0,
            qty: item.qty || 1,
            thumbnail: item.thumbnail || "/placeholder.png",
            selectedOptions: item.variant,
          },
        ],
      });
    }
  },

  updateQty: (id, qty, selectedOptions) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item._id === id &&
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
          ? { ...item, qty }
          : item
      ),
    }));
  },

  removeItem: (id, selectedOptions) => {
    set((state) => ({
      cart: state.cart.filter(
        (item) =>
          !(
            item._id === id &&
            JSON.stringify(item.selectedOptions) ===
              JSON.stringify(selectedOptions)
          )
      ),
    }));
  },

  clearCart: () => set({ cart: [] }),
}));

export default useCartStore;
