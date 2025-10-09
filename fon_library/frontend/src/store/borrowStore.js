import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/borrows';
axios.defaults.withCredentials = true;

export const useBorrowStore = create((set) => ({
  // State
  borrows: [],
  userBorrows: [],
  selectedBorrow: null,
  error: null,
  isLoading: false,

  // Admin: Fetch all borrows
  fetchAllBorrows: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(API_URL);
      set({ borrows: res.data.data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch all borrows',
        isLoading: false,
      });
    }
  },

  // User: Fetch their own borrows
  fetchUserBorrows: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/my`);
      set({ userBorrows: res.data.data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch user borrows',
        isLoading: false,
      });
    }
  },

  // User: Create borrow
  createBorrow: async (borrowData) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(API_URL, borrowData);
      await useBorrowStore.getState().fetchUserBorrows();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to create borrow',
        isLoading: false,
      });
    }
  },

  // User: Return book
  returnBorrow: async (borrowId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`${API_URL}/${borrowId}/return`);
      await useBorrowStore.getState().fetchUserBorrows();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to return borrow',
        isLoading: false,
      });
    }
  },

  // Admin: Mark as overdue
  markAsOverdue: async (borrowId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`${API_URL}/${borrowId}/overdue`);
      await useBorrowStore.getState().fetchAllBorrows();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to mark as overdue',
        isLoading: false,
      });
    }
  },

  // Check if current user has already borrowed the book and not returned it
  checkBorrowStatus: async (bookId) => {
    try {
      const res = await axios.get(`${API_URL}/check/${bookId}`);
      return res.data.borrowed; // true if already borrowed and not returned
    } catch (err) {
      console.error('Check borrow status error:', err);
      return false;
    }
  },
}));
