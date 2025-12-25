import { create } from "zustand";
import { apiPostRequest } from "../utils/api.js";
import {
  setAccessTokenLocalStorage,
  setUserLocalStorage,
} from "../utils/localstorage.js";

export const useAuthStore = create((set) => ({
  isAdmin: false,
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const token = localStorage.getItem("token");
      const userJSON = localStorage.getItem("user");
      const user = userJSON ? JSON.parse(userJSON) : null;

      set({ token, user });
    } catch (error) {
      console.log("error in checking auth", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  register: async (fullName, email, password, mobile, gender) => {
    set({ isLoading: true });
    try {
      const response = await apiPostRequest("auth/signup", {
        fullName,
        email,
        password,
        mobile,
        gender,
      });

      const { user, token } = response?.data || {};

      setAccessTokenLocalStorage(token);
      setUserLocalStorage({
        email: user.email,
        fullName: user.fullName,
        mobile: user.mobile,
      });

      set({
        isLoading: false,
        user,
        token,
      });

      return {
        success: true,
      };
    } catch (error) {
      console.log(error);

      set({ isLoading: false });
      return {
        success: false,
        error: error.response.data.message || error.message,
      };
    }
  },
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await apiPostRequest("auth/login/", { email, password });

      const { token, user } = response?.data || {};
      setAccessTokenLocalStorage(token);
      setUserLocalStorage({
        email: user.email,
        fullName: user.fullName,
        mobile: user.mobile,
      });

      set({
        isLoading: false,
        user,
        token,
        isAdmin: user?.isAdmin || false,
      });

      return {
        success: true,
        isAdmin: user?.isAdmin || false,
      };
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      return {
        success: false,
        error: error.response.data.message || error.message,
      };
    }
  },
  logout: async () => {
    try {
      localStorage.clear();
      set({
        user: null,
        token: null,
      });
      return {
        success: true,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.response.data.message || error.message,
      };
    }
  },
}));
