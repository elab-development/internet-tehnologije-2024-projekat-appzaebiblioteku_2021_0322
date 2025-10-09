import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/genres';
axios.defaults.withCredentials = true;

export const useGenreStore = create((set) => ({
  // State
  genres: [],
  selectedGenre: null,
  error: null,
  isLoading: false,

  // Fetch all genres
  fetchGenres: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(API_URL);
      set({ genres: res.data.data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch genres',
        isLoading: false,
      });
    }
  },

  // Get genre by ID
  getGenreById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      set({ selectedGenre: res.data.data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch genre',
        isLoading: false,
      });
    }
  },

  // Create genre
  createGenre: async (genreData) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(API_URL, genreData);
      await useGenreStore.getState().fetchGenres();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to create genre',
        isLoading: false,
      });
    }
  },

  // Update genre
  updateGenre: async (id, genreData) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`${API_URL}/${id}`, genreData);
      await useGenreStore.getState().fetchGenres();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to update genre',
        isLoading: false,
      });
    }
  },

  // Delete genre
  deleteGenre: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${id}`);
      await useGenreStore.getState().fetchGenres();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to delete genre',
        isLoading: false,
      });
    }
  },
}));
