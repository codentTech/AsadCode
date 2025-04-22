import api from '@/common/utils/api';

const createInvoiceBody = async (payload) => {
  const response = await api().post('/invoice-body', payload);
  return response.data;
};

const getAllInvoiceBody = async () => {
  const response = await api().get('/invoice-body');
  return response.data;
};

const getSingleInvoiceBody = async (payload) => {
  const response = await api().get('/invoice-body', payload);
  return response.data;
};

const deleteInvoiceBody = async (payload) => {
  const response = await api().delete(`/invoice-body/${payload}`);
  return response.data;
};

const updateInvoiceBody = async (payload, id) => {
  const response = await api().patch(`/invoice-body/${id}`, payload);
  return response.data;
};

const bodyService = {
  createInvoiceBody,
  getAllInvoiceBody,
  deleteInvoiceBody,
  updateInvoiceBody,
  getSingleInvoiceBody
};

export default bodyService;
