import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },

  reducers: {
    // ADD TO CART
    addToCart: (state, action) => {
      const { id, size } = action.payload;

      // Check same item + same size
      const existingItem = state.items.find(
        (item) => item.id === id && item.size === size
      );

      if (existingItem) {
        existingItem.qty += action.payload.qty || 1;
      } else {
        state.items.push({
          ...action.payload,
          qty: action.payload.qty || 1,
          basePrice: action.payload.price, // ⭐ FIXED (was missing)
          price: action.payload.price, // ⭐ Set default price
        });
      }
    },

    // REMOVE
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    // INCREASE
    increaseQty: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) item.qty += 1;
    },

    // DECREASE
    decreaseQty: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.qty > 1) item.qty -= 1;
    },

    // CLEAR CART
    clearCart: (state) => {
      state.items = [];
    },

    // SIZE CHANGE
    updateSize: (state, action) => {
      const { id, newSize } = action.payload;

      const item = state.items.find((i) => i.id === id);

      if (item) {
        item.size = newSize;

        const multipliers = {
          S: 1,
          M: 1.05,
          L: 1.1,
          XL: 1.15,
        };

        // ⭐ basePrice always used, no NaN
        item.price = Math.round(item.basePrice * multipliers[newSize]);
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
  updateSize,
} = cartSlice.actions;

export default cartSlice.reducer;
