import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/books';
axios.defaults.withCredentials = true;

export const useBookStore = create((set) => ({
  // State
  books: [],
  topBooks: [],
  allBooks: [],
  page: 1,
  totalPages: 1,
  selectedBook: null,
  error: null,
  isLoading: false,

  // Fetch all books
  fetchBooks: async (params = '') => {
    set({ isLoading: true, error: null });
    try {
      const query = new URLSearchParams(params).toString();
      const res = await axios.get(`${API_URL}?${query}`);
      set({
        books: res.data.data,
        page: res.data.page,
        totalPages: res.data.pages,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch books',
        isLoading: false,
      });
    }
  },

  // Fetch all books No Filters
  fetchBooksNoFilters: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/all`);
      set({
        allBooks: res.data.data,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch all books',
        isLoading: false,
      });
    }
  },

  // Fetch top available books
  fetchTopBooks: async () => {
    try {
      set({ isLoading: true });
      const res = await axios.get(`${API_URL}/top-available`);
      set({ topBooks: res.data.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  // Get book by ID
  getBookById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      set({ selectedBook: res.data.data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch book',
        isLoading: false,
      });
    }
  },

  // Create book (expects FormData for image upload)
  createBook: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await useBookStore.getState().fetchBooks();
      await useBookStore.getState().fetchBooksNoFilters();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to create book',
        isLoading: false,
      });
    }
  },

  // Update book (expects FormData for image upload)
  updateBook: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`${API_URL}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await useBookStore.getState().fetchBooks();
      await useBookStore.getState().fetchBooksNoFilters();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to update book',
        isLoading: false,
      });
    }
  },

  // Delete book
  deleteBook: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${id}`);
      await useBookStore.getState().fetchBooks();
      await useBookStore.getState().fetchBooksNoFilters();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to delete book',
        isLoading: false,
      });
    }
  },
}));
