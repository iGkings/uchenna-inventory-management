import api from './api';

export const categoryService = {
  getCategories: async (search = '') => {
    const res = await api.get(`/categories${search ? `?search=${encodeURIComponent(search)}` : ''}`);
    return res.data;
  },

  getCategoryById: async (id) => {
    const res = await api.get(`/categories/${id}`);
    return res.data;
  },

  createCategory: async (categoryData) => {
    const res = await api.post('/categories', categoryData);
    return res.data;
  },

  updateCategory: async (id, updateData) => {
    const res = await api.put(`/categories/${id}`, updateData);
    return res.data;
  },

  deleteCategory: async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  },
};

export default categoryService;
