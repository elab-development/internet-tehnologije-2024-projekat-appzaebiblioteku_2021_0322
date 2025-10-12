import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/reports';
axios.defaults.withCredentials = true;

export const useReportStore = create((set) => ({
  topBooks: [],
  topGenres: [],
  topUsers: [],
  newYorkTimesTopBooks: [],
  isLoading: false,
  error: null,

  fetchTopBooks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/top-books`);
      set({ topBooks: res.data.data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch top books',
        isLoading: false,
      });
    }
  },

  fetchTopGenres: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/top-genres`);
      set({ topGenres: res.data.data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch top genres',
        isLoading: false,
      });
    }
  },

  fetchTopUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/top-users`);
      set({ topUsers: res.data.data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch top users',
        isLoading: false,
      });
    }
  },

  fetchNewYorkTimesTopBooks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/new-york-times-top-books`);
      console.log(res);
      set({ newYorkTimesTopBooks: res.data.data, isLoading: false });
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          'Failed to fetch New York Times top books',
        isLoading: false,
      });
    }
  },
}));
