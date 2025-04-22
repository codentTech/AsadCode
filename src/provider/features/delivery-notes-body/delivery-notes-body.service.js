import api from '@/common/utils/api';

const createDeliveryNotesBody = async (payload) => {
  const response = await api().post('/delivery-notes-body', payload);
  return response.data;
};

const getAllDeliveryNotesBody = async (payload) => {
  const response = await api().get('/delivery-notes-body', payload);
  return response.data;
};

const deleteDeliveryNotesBody = async (payload) => {
  const response = await api().delete(`/delivery-notes-body/${payload}`);
  return response.data;
};

const updateDeliveryNotesBody = async (payload, id) => {
  const response = await api().patch(`/delivery-notes-body/${id}`, payload);
  return response.data;
};

const deliveryNotesBodyService = {
  createDeliveryNotesBody,
  getAllDeliveryNotesBody,
  deleteDeliveryNotesBody,
  updateDeliveryNotesBody
};

export default deliveryNotesBodyService;
