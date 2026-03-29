import { create } from 'zustand';

const useStore = create((set) => ({
  // Auth state
  tableNumber: null,
  area: null,
  setTable: (tableNumber, area) => set({ tableNumber, area }),

  // Cart state
  cart: [],
  addToCart: (item) => set((state) => {
    // Check if exactly same item with same options exists
    const existingIndex = state.cart.findIndex(i => 
      i.id === item.id && 
      i.spiceLevel === item.spiceLevel && 
      i.iceLevel === item.iceLevel && 
      i.notes === item.notes
    );
    
    if (existingIndex >= 0) {
      const newCart = [...state.cart];
      newCart[existingIndex].quantity += item.quantity;
      return { cart: newCart };
    }
    return { cart: [...state.cart, item] };
  }),
  removeFromCart: (index) => set((state) => ({
    cart: state.cart.filter((_, i) => i !== index)
  })),
  clearCart: () => set({ cart: [] }),
  
  // App views
  currentView: 'welcome', // welcome, menu, orderStatus
  setView: (view) => set({ currentView: view }),
  
  // Modals
  isCartOpen: false,
  setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
}));

export default useStore;
