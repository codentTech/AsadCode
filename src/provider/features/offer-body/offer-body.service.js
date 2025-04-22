import api from '@/common/utils/api';

const createOfferBody = async (payload) => {
  const response = await api().post('/offer-body', payload);
  return response.data;
};

const getAllOfferBody = async (payload) => {
  const response = await api().get('/offer-body', payload);
  return response.data;
};

const deleteOfferBody = async (payload) => {
  const response = await api().delete(`/offer-body/${payload}`);
  return response.data;
};

const updateOfferBody = async (payload, id) => {
  const response = await api().patch(`/offer-body/${id}`, payload);
  return response.data;
};

const offerBodyService = {
  createOfferBody,
  getAllOfferBody,
  deleteOfferBody,
  updateOfferBody,
};

export default offerBodyService;
