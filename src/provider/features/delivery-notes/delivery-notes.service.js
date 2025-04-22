import api from '@/common/utils/api';

const addCustomer = async (payload) => {
  const response = await api().post('/delivery-notes/add-customer', payload);
  return response.data;
};

const createHeaderBody = async (payload) => {
  const response = await api().post('/delivery-notes/add-header-and-body', payload);
  return response.data;
};

const createLineItem = async (payload) => {
  const response = await api().post('/delivery-notes/add-line-item', payload);
  return response.data;
};

const addPageStructure = async (payload) => {
  const response = await api().post('/delivery-notes/add-page-structure', payload);
  return response.data;
};

const getAllDeliveryNotes = async (payload) => {
  const response = await api().post('/delivery-notes/get-all', payload);
  return response.data;
};

const getSingleDeliveryNotes = async (id) => {
  const response = await api().get(`/delivery-notes/${id}`);
  return response.data;
};

const updateDeliveryNotes = async (payload, id) => {
  const response = await api().patch(`/delivery-notes/${id}`, payload);
  return response.data;
};

const deleteDeliveryNotes = async (id) => {
  const response = await api().delete(`/delivery-notes/${id}`);
  return response.data;
};

const getDeliveryNotesHistory = async (id) => {
  const response = await api().get(`/delivery-notes/get-history/${id}`);
  return response.data;
};

const bookAnDeliveryNotes = async (id, deliveryNotesTemplateId) => {
  const response = await api().patch(`/delivery-notes/book-a-delivery-notes/${id}`, {
    deliveryNotesTemplateId
  });
  return response.data;
};

const deliveryNotesRejection = async (payload) => {
  const response = await api().patch('/delivery-notes/rejection', payload);
  return response.data;
};

const addDeliveryNotesTemplate = async (payload) => {
  const response = await api().post('/delivery-notes/add-template', payload);
  return response.data;
};

const saveAsDraft = async (deliveryNotesTemplateId, id) => {
  const response = await api().patch(`/delivery-notes/save-as-draft/${id}`, {
    deliveryNotesTemplateId
  });
  return response.data;
};

const uploadFiles = async ({ payload }) => {
  const { attachments, id } = payload;
  const response = await api().patch(`/delivery-notes/upload-files/${id}`, {
    attachments
  });
  return response.data;
};

const deliveryNotesService = {
  addCustomer,
  createHeaderBody,
  createLineItem,
  addPageStructure,
  getAllDeliveryNotes,
  getSingleDeliveryNotes,
  updateDeliveryNotes,
  deleteDeliveryNotes,
  getDeliveryNotesHistory,
  bookAnDeliveryNotes,
  deliveryNotesRejection,
  addDeliveryNotesTemplate,
  saveAsDraft,
  uploadFiles
};

export default deliveryNotesService;
