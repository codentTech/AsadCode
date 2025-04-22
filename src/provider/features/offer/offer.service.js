import api from '@/common/utils/api';

const addCustomer = async (payload) => {
  const response = await api().post('/offer/add-customer', payload);
  return response.data;
};

const createHeaderBody = async (payload) => {
  const response = await api().post('/offer/add-header-and-body', payload);
  return response.data;
};

const createLineItem = async (payload) => {
  const response = await api().post('/offer/add-line-item', payload);
  return response.data;
};

const addPageStructure = async (payload) => {
  const response = await api().post('/offer/add-page-structure', payload);
  return response.data;
};

const getAllOffers = async (payload) => {
  const response = await api().post('/offer/get-all', payload);
  return response.data;
};

const getSingleOffer = async (id) => {
  const response = await api().get(`/offer/${id}`);
  return response.data;
};

const updateOffer = async (payload, id) => {
  const response = await api().patch(`/offer/${id}`, payload);
  return response.data;
};

const deleteOffer = async (id) => {
  const response = await api().delete(`/offer/${id}`);
  return response.data;
};

const getOfferHistory = async (id) => {
  const response = await api().get(`/offer/get-history/${id}`);
  return response.data;
};

const bookAnOffer = async (id, offerTemplateId) => {
  const response = await api().patch(`/offer/book-an-offer/${id}`, { offerTemplateId });
  return response.data;
};

const offerRejection = async ({ payload }) => {
  const response = await api().patch('/offer/rejection', payload);
  return response.data;
};

const addOfferTemplate = async (payload) => {
  const response = await api().post('/offer/add-template', payload);
  return response.data;
};

const saveAsDraft = async (offerTemplateId, id) => {
  const response = await api().patch(`/offer/save-as-draft/${id}`, { offerTemplateId });
  return response.data;
};

const uploadFiles = async ({ payload }) => {
  const { attachments, id } = payload;
  const response = await api().patch(`/offer/upload-files/${id}`, { attachments });
  return response.data;
};

const offerService = {
  addCustomer,
  createHeaderBody,
  createLineItem,
  addPageStructure,
  getAllOffers,
  getSingleOffer,
  updateOffer,
  deleteOffer,
  getOfferHistory,
  bookAnOffer,
  offerRejection,
  addOfferTemplate,
  uploadFiles,
  saveAsDraft
};

export default offerService;
