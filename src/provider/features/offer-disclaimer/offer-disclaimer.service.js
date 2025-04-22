import api from '@/common/utils/api';

const createOfferDisclaimer = async (payload) => {
  const response = await api().post('/offer-disclaimer', payload);
  return response.data;
};

const getAllOfferDisclaimer = async (payload) => {
  const response = await api().get('/offer-disclaimer', payload);
  return response.data;
};

const deleteOfferDisclaimer = async (payload) => {
  const response = await api().delete(`/offer-disclaimer/${payload}`);
  return response.data;
};

const updateOfferDisclaimer = async (payload, id) => {
  const response = await api().patch(`/offer-disclaimer/${id}`, payload);
  return response.data;
};


const offerDisclaimerService = {
  createOfferDisclaimer,
  getAllOfferDisclaimer,
  deleteOfferDisclaimer,
  updateOfferDisclaimer,
};

export default offerDisclaimerService;
