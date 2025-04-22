import api from '@/common/utils/api';

const createProductCategory = async (userData) => {
  const response = await api().post('/product-category', userData);
  return response.data;
};

const getSingleProductCategory = async (id) => {
  const response = await api().get(`/product-category/${id}`);
  return response.data;
};

const getAllProductCategory = async (userData) => {
  const response = await api().post('/product-category/get-all', userData);
  return response.data;
};

const updateProductCategory = async (id, data) => {
  const response = await api().patch(`/product-category/${id}`, data);
  return response.data;
};

const deleteProductCategory = async (id) => {
  const response = await api().delete(`/product-category/${id}`);
  return response.data;
};

const productCategoryService = {
  createProductCategory,
  deleteProductCategory,
  updateProductCategory,
  getAllProductCategory,
  getSingleProductCategory
};

export default productCategoryService;
