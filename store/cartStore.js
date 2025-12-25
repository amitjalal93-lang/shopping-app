import {
  apiDeleteRequestAuthenticated,
  apiGetRequestAuthenticated,
  apiPostRequestAuthenticated,
  apiPutRequestAuthenticated,
} from "@/utils/api";
import { create } from "zustand";

export const useCartStore = create((set) => ({
  cart: [],
  cartCounter: 0,
  totalAmount: 0,
  fetchCart: async () => {
    try {
      const cartItems = await apiGetRequestAuthenticated("/cart");
      const { cart, total } = cartItems?.data || {};

      set({
        cart,
        cartCounter: cart.length,
        totalAmount: total,
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  },
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await apiPostRequestAuthenticated("/cart/add", {
        productId,
        quantity,
      });
      const { cart, total } = response?.data || {};

      set({
        cart,
        cartCounter: cart.length,
        totalAmount: total,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  },
  removeFromCart: async (productId) => {
    try {
      const response = await apiDeleteRequestAuthenticated(
        `/cart/remove/${productId}`
      );

      const { cart, total } = response?.data || {};
      set({
        cart,
        cartCounter: cart.length,
        totalAmount: total,
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  },
  clearCart: async () => {
    try {
      await apiDeleteRequestAuthenticated("/cart/clear");
      set({
        cart: [],
        cartCounter: 0,
        totalAmount: 0,
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  },
  updateCartQuantity: async (productId, qty) => {
    try {
      const response = await apiPutRequestAuthenticated("/cart/update", {
        productId,
        qty,
      });

      const { cart, total } = response?.data || {};

      set({
        cart: cart,
        totalAmount: total,
      });
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  },
  resetCart: () => set({ cart: [], cartCounter: 0, totalAmount: 0 }),
}));
