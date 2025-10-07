import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  // State
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  // Register
  register: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
        name,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          'Something went wrong while signing up',
        isLoading: false,
      });
      throw error;
    }
  },

  // Verify Email
  verifyEmail: async (email, code) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/verify-email`, {
        email,
        code,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          'Something went wrong while verifying your email',
        isLoading: false,
      });
      throw error;
    }
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          'Something went wrong while logging in',
        isLoading: false,
      });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          'Something went wrong while logging out',
        isLoading: false,
      });
    }
  },

  // Check Auth
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({
        error: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });

    try {
      await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          'Something went wrong while sending mail for forgot password',
        isLoading: false,
      });
      throw error;
    }
  },

  // Reset Password
  resetPassword: async (token, email, password) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`${API_URL}/reset-password/${token}`, {
        email,
        password,
      });
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error?.response?.data?.message || 'Error resetting password',
      });
      throw error;
    }
  },
}));
