import api from '@/common/utils/api';

const createOfferComment = async (payload) => {
  const response = await api().post('/offer-comment', payload);
  return response.data;
};

const getAllOfferComment = async (id) => {
  const response = await api().get(`/offer-comment/get-all/${id}`);
  return response.data;
};

const deleteOfferComment = async (id) => {
  const response = await api().delete(`/offer-comment/${id}`);
  return response.data;
};

const updateOfferComment = async (comment, id) => {
  const response = await api().patch(`/offer-comment/${id}`, { comment });
  return response.data;
};

const offerCommentService = {
  createOfferComment,
  getAllOfferComment,
  deleteOfferComment,
  updateOfferComment
};

export default offerCommentService;
