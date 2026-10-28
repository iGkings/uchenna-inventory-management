import api from './api';

export const productService = {
  getProducts: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.categoryId && params.categoryId !== 'ALL') query.append('categoryId', params.categoryId);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString();
    const res = await api.get(`/products${queryString ? `?${queryString}` : ''}`);
    return {
      products: res.data,
      meta: res.meta,
    };
  },

  getProductById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  createProduct: async (productData) => {
    const res = await api.post('/products', productData);
    return res.data;
  },

  updateProduct: async (id, updateData) => {
    const res = await api.put(`/products/${id}`, updateData);
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  adjustStock: async (id, adjustmentData) => {
    const res = await api.post(`/products/${id}/adjust`, adjustmentData);
    return res.data;
  },

  exportCsv: async () => {
    return await api.get('/products/export/csv');
  },
};

export default productService;
