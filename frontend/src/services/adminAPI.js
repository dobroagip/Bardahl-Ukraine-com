import api from './api';

export const adminAPI = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Products (admin)
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  // Categories (admin)
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
  
  // Orders (admin)
  getOrders: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/orders?${queryString}`);
  },
  updateOrderStatus: (orderId, status) => api.put(`/admin/orders/${orderId}/status`, { status }),
  
  // Users (admin)
  getUsers: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/users?${queryString}`);
  }
};

export default adminAPI;