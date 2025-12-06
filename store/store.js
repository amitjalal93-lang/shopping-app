import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slices/cartSlices.js";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
