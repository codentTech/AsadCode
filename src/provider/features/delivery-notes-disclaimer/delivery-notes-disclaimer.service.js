import api from '@/common/utils/api';

const createDeliveryNotesDisclaimer = async (payload) => {
  const response = await api().post('/delivery-notes-disclaimer', payload);
  return response.data;
};

const getAllDeliveryNotesDisclaimer = async (payload) => {
  const response = await api().get('/delivery-notes-disclaimer', payload);
  return response.data;
};

const deleteDeliveryNotesDisclaimer = async (payload) => {
  const response = await api().delete(`/delivery-notes-disclaimer/${payload}`);
  return response.data;
};

const updateDeliveryNotesDisclaimer = async (payload, id) => {
  const response = await api().patch(`/delivery-notes-disclaimer/${id}`, payload);
  return response.data;
};

const deliveryNotesDisclaimerService = {
  createDeliveryNotesDisclaimer,
  getAllDeliveryNotesDisclaimer,
  deleteDeliveryNotesDisclaimer,
  updateDeliveryNotesDisclaimer
};

export default deliveryNotesDisclaimerService;
