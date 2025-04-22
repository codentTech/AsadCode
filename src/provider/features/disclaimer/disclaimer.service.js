import api from '@/common/utils/api';

const createDisclaimer = async (payload) => {
  const response = await api().post('/invoice-disclaimer', payload);
  return response.data;
};

const getAllDisclaimer = async () => {
  const response = await api().get('/invoice-disclaimer');
  return response.data;
};

const getsingleDisclaimer = async (payload) => {
  const response = await api().get('/invoice-disclaimer', payload);
  return response.data;
};

const deleteDisclaimer = async (payload) => {
  const response = await api().delete(`/invoice-disclaimer/${payload}`);
  return response.data;
};

const updateDisclaimer = async (payload, id) => {
  const response = await api().patch(`/invoice-disclaimer/${id}`, payload);
  return response.data;
};

const disclaimerService = {
  createDisclaimer,
  getAllDisclaimer,
  deleteDisclaimer,
  updateDisclaimer,
  getsingleDisclaimer
};

export default disclaimerService;
