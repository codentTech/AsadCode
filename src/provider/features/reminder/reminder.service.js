import api from '@/common/utils/api';

const createInvoiceReminder = async (payload, document) => {
  const data = {
    ...payload,
    document
  };

  const response = await api().post('/reminder/invoice', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const updateInvoiceReminder = async (payload, id, document) => {
  const data = {
    ...payload,
    document
  };
  const response = await api().patch(`/reminder/invoice/${id}`, data);
  return response.data;
};

const getInvoiceReminder = async (id) => {
  const response = await api().get(`/reminder/invoice/${id}`);
  return response.data;
};

const deleteInvoiceReminder = async (id) => {
  const response = await api().delete(`/reminder/invoice/${id}`);
  return response.data;
};

const invoiceReminderService = {
  createInvoiceReminder,
  updateInvoiceReminder,
  getInvoiceReminder,
  deleteInvoiceReminder
};

export default invoiceReminderService;
