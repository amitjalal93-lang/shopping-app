import { create } from "zustand";

export const useCategoryStore = create((set) => ({
  categoryId: "",
  setCategoryId: (categoryId) => set({ categoryId }),
}));
