import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

// Ensure you are using the correct API URL for your deployed backend
// const API_URL = "http://localhost:5173";
const API_URL = "http://localhost:5000/api";

const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  message: null,
  fetchingUser: true,

  // ================= SIGNUP =================
  signup: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        username,
        email,
        password,
      });
      set({
        user: response.data.user,
        isLoading: false,
        message: "Signup successful!",
      });
      return response.data;
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "An error occurred during sign up.";
      set({ isLoading: false, error: errMsg });
      throw new Error(errMsg);
    }
  },

  // ================= LOGIN =================
  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });
      set({
        user: response.data.user,
        message: response.data.message || "Login successful!",
        isLoading: false,
      });
      return response.data;
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "An error occurred during login.";
      set({ isLoading: false, error: errMsg });
      throw new Error(errMsg);
    }
  },

  // ================= FETCH USER =================
  fetchUser: async () => {
    set({ fetchingUser: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/fetch-user`);
      set({ user: response.data.user || null, fetchingUser: false });
    } catch (err) {
      // It's normal for this to fail if no user is logged in.
      // We just clear the user and stop fetching.
      set({ fetchingUser: false, user: null });
    }
  },

  // ================= LOGOUT =================
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        message: response.data.message || "Logged out successfully!",
        isLoading: false,
      });
      return response.data;
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "An error occurred during logout.";
      set({ isLoading: false, error: errMsg });
      throw new Error(errMsg);
    }
  },
}));

export default useAuthStore;

