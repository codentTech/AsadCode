import api from '@/common/utils/api';

const createCustomerComment = async (payload) => {
  const response = await api().post('/customer-comment', payload);
  return response.data;
};

const getAllCustomerComment = async (id) => {
  const response = await api().get(`/customer-comment/get-all/${id}`);
  return response.data;
};

const deleteCustomerComment = async ({ id }) => {
  const response = await api().delete(`/customer-comment/${id}`);
  return response.data;
};

const updateCustomerComment = async ({ id }) => {
  const response = await api().patch(`/customer-comment/${id}`);
  return response.data;
};

const customerCommentService = {
  createCustomerComment,
  getAllCustomerComment,
  deleteCustomerComment,
  updateCustomerComment
};

export default customerCommentService;
