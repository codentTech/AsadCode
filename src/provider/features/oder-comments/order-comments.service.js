import api from '@/common/utils/api';

const createOrderComment = async (payload) => {
  const response = await api().post('/order-comment', payload);
  return response.data;
};

const getAllOrderComment = async (id) => {
  const response = await api().get(`/order-comment/get-all/${id}`);
  return response.data;
};

const deleteOrderComment = async (id) => {
  const response = await api().delete(`/order-comment/${id}`);
  return response.data;
};

const updateOrderComment = async (comment, id) => {
  const response = await api().patch(`/order-comment/${id}`, { comment });
  return response.data;
};

const orderCommentService = {
  createOrderComment,
  getAllOrderComment,
  deleteOrderComment,
  updateOrderComment
};

export default orderCommentService;
