import api from '@/common/utils/api';

const createDeliveryTerm = async (payload) => {
  const response = await api().post('/delivery-term', payload);
  return response.data;
};

const getDeliveryTerm = async () => {
  const response = await api().get('/delivery-term');
  return response.data;
};
const updateDeliveryTerm = async (id, data) => {
  const response = await api().patch(`/delivery-term/${id}`, data);
  return response.data;
};
const deleteDeliveryTerm = async (id) => {
  const response = await api().delete(`/delivery-term/${id}`);
  return response.data;
};
const deliveryTermService = {
  createDeliveryTerm,
  getDeliveryTerm,
  updateDeliveryTerm,
  deleteDeliveryTerm
};
export default deliveryTermService;
