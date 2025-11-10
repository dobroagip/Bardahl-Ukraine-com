import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product API
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (categoryId) => api.get(`/products?category=${categoryId}`),
};

// Category API
export const categoryAPI = {
  getAll: () => api.get('/categories'),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId, quantity = 1) => api.post('/cart/add', { productId, quantity }),
  update: (itemId, quantity) => api.put(`/cart/item/${itemId}`, { quantity }),
  remove: (itemId) => api.delete(`/cart/item/${itemId}`),
  clear: () => api.delete('/cart/clear'),
};

// Order API
export const orderAPI = {
  create: (data) => api.post('/orders/create', data),
  getHistory: () => api.get('/orders/history'),
  getDetails: (orderId) => api.get(`/orders/${orderId}`),
  cancel: (orderId) => api.put(`/orders/${orderId}/cancel`),
};

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export default api;