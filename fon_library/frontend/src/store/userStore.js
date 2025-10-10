import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/users';
axios.defaults.withCredentials = true;

export const useUserStore = create((set, get) => ({
  users: [],
  userBorrowStats: {},
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}`);
      set({ users: res.data.data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error fetching users',
        isLoading: false,
      });
    }
  },

  fetchBorrowStats: async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/${userId}/borrows`);
      set((state) => ({
        userBorrowStats: {
          ...state.userBorrowStats,
          [userId]: res.data.stats,
        },
      }));
    } catch (err) {
      console.error(
        `Error fetching borrow stats for user ${userId}:`,
        err.response?.data || err.message
      );
    }
  },

  updateUserRole: async (id, isAdminData) => {
    try {
      const res = await axios.put(`${API_URL}/${id}/role`, isAdminData);
      const updatedUser = res.data.data;
      set({
        users: get().users.map((user) =>
          user._id === id ? updatedUser : user
        ),
      });
    } catch (err) {
      console.error(
        'Error updating user role:',
        err.response?.data || err.message
      );
    }
  },
}));
