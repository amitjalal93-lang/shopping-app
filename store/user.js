"use client";
import { create } from "zustand";

export const useUserStore = create((set) => ({
  cartCounter:
    typeof window !== "undefined"
      ? Number(localStorage.getItem("cartCounter")) || 0
      : 0,

  setCartCounter: (count) => {
    set({ cartCounter: count });
    if (typeof window !== "undefined") {
      localStorage.setItem("cartCounter", count);
    }
  },
}));
