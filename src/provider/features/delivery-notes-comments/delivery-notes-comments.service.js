import api from '@/common/utils/api';

const createDeliveryNotesComment = async (payload) => {
  const response = await api().post('/delivery-notes-comment', payload);
  return response.data;
};

const getAllDeliveryNotesComment = async (id) => {
  const response = await api().get(`/delivery-notes-comment/get-all/${id}`);
  return response.data;
};

const deleteDeliveryNotesComment = async (id) => {
  const response = await api().delete(`/delivery-notes-comment/${id}`);
  return response.data;
};

const updateDeliveryNotesComment = async (comment, id) => {
  const response = await api().patch(`/delivery-notes-comment/${id}`, { comment });
  return response.data;
};

const deliveryNotesCommentService = {
  createDeliveryNotesComment,
  getAllDeliveryNotesComment,
  deleteDeliveryNotesComment,
  updateDeliveryNotesComment
};

export default deliveryNotesCommentService;
