import api from '@/common/utils/api';

const createInvoiceComment = async (payload) => {
  const response = await api().post('/invoice-comment', payload);
  return response.data;
};

const getAllInvoiceComment = async (id) => {
  const response = await api().get(`/invoice-comment/get-all/${id}`);
  return response.data;
};

const deleteInvoiceComment = async ({ id }) => {
  const response = await api().delete(`/invoice-comment/${id}`);
  return response.data;
};

const updateInvoiceComment = async ({ id }) => {
  const response = await api().patch(`/invoice-comment/${id}`);
  return response.data;
};

const commentService = {
  createInvoiceComment,
  getAllInvoiceComment,
  deleteInvoiceComment,
  updateInvoiceComment
};

export default commentService;
