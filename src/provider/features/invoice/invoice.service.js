import api from '@/common/utils/api';

const addCustomer = async (payload) => {
  const response = await api().post('/invoice/add-customer', payload);
  return response.data;
};

const createHeaderBody = async (payload) => {
  const response = await api().post('/invoice/add-header-and-body', payload);
  return response.data;
};

const createLineItem = async (payload) => {
  const response = await api().post('/invoice/add-line-item', payload);
  return response.data;
};

const addPageStructure = async (payload) => {
  const response = await api().post('/invoice/add-page-structure', payload);
  return response.data;
};

const getAllInvoice = async (payload) => {
  const response = await api().post('/invoice/get-all', payload);
  return response.data;
};

const getSingleInvoice = async (id) => {
  const response = await api().get(`/invoice/${id}`);
  return response.data;
};

const updateInvoice = async (payload, id) => {
  const response = await api().patch(`/invoice/${id}`, payload);
  return response.data;
};

const deleteInvoice = async (id) => {
  const response = await api().delete(`/invoice/${id}`);
  return response.data;
};

const getInvoiceHistory = async (id) => {
  const response = await api().get(`/invoice/get-history/${id}`);
  return response.data;
};

const bookAnInvoice = async (id, invoiceTemplateId) => {
  const response = await api().patch(`/invoice/book-a-invoice/${id}`, {
    invoiceTemplateId
  });
  return response.data;
};

const invoiceRejection = async ({ payload }) => {
  const response = await api().patch('/invoice/rejection', payload);
  return response.data;
};

const createInvoicePayment = async ({ payload }) => {
  const response = await api().post('/invoice/payment', payload);
  return response.data;
};

const getInvoicePayment = async (payload) => {
  const response = await api().get(`/invoice/payment/${payload}`);
  return response.data;
};

const addInvoiceTemplate = async (payload) => {
  const response = await api().post('/invoice/add-template', payload);
  return response.data;
};

const saveAsDraft = async (invoiceTemplateId, id) => {
  const response = await api().patch(`/invoice/save-as-draft/${id}`, {
    invoiceTemplateId
  });
  return response.data;
};

const uploadFiles = async ({ payload }) => {
  const { attachments, id } = payload;
  const response = await api().patch(`/invoice/upload-files/${id}`, { attachments });
  return response.data;
};

const invoiceService = {
  addCustomer,
  createHeaderBody,
  createLineItem,
  addPageStructure,
  getAllInvoice,
  getSingleInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoiceHistory,
  bookAnInvoice,
  invoiceRejection,
  createInvoicePayment,
  getInvoicePayment,
  addInvoiceTemplate,
  saveAsDraft,
  uploadFiles
};

export default invoiceService;
