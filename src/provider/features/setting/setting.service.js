import api from '@/common/utils/api';

const createGeneralSetting = async (payload) => {
  const response = await api().post('/setting/general', payload);
  return response.data;
};

const generalSettingCurrentBusiness = async () => {
  const response = await api().get('/setting/general/current-business-setting');
  return response.data;
};

const getSingleGeneralSetting = async ({ id }) => {
  const response = await api().get(`/setting/general/${id}`);
  return response.data;
};

const updateGeneralSetting = async (payload, id) => {
  const response = await api().patch(`/setting/general/${id}`, payload);
  return response.data;
};

const createOfferDocumentSetting = async (payload) => {
  const response = await api().post('/setting/document/offer', payload);
  return response.data;
};

const updateOfferDocumentSetting = async (payload, id) => {
  const response = await api().patch(`/setting/document/offer/${id}`, payload);
  return response.data;
};

const createCreditNoteDocumentSetting = async (payload) => {
  const response = await api().post('/setting/document/credit-note', payload);
  return response.data;
};

const updateCreditNoteDocumentSetting = async (payload, id) => {
  const response = await api().patch(`/setting/document/credit-note/${id}`, payload);
  return response.data;
};

const createOrderDocumentSetting = async (payload) => {
  const response = await api().post('/setting/document/order', payload);
  return response.data;
};

const updateOrderrDocumentSetting = async (payload, id) => {
  const response = await api().patch(`/setting/document/order/${id}`, payload);
  return response.data;
};

const createDeliveryNotesDocumentSetting = async (payload) => {
  const response = await api().post('/setting/document/delivery-notes', payload);
  return response.data;
};

const updateDeliveryNotesDocumentSetting = async (payload, id) => {
  const response = await api().patch(`/setting/document/delivery-notes/${id}`, payload);
  return response.data;
};

const createInvoiceDocumentSetting = async (payload) => {
  const response = await api().post('/setting/document/invoice', payload);
  return response.data;
};

const updateInvoiceDocumentSetting = async (payload, id) => {
  const response = await api().patch(`/setting/document/invoice/${id}`, payload);
  return response.data;
};

const createProductDocumentSetting = async (payload) => {
  const response = await api().post('/setting/document/product', payload);
  return response.data;
};

const updateProductDocumentSetting = async (payload, id) => {
  const response = await api().patch(`/setting/document/product/${id}`, payload);
  return response.data;
};

const getDocumentSetting = async (payload) => {
  const response = await api().post('/setting/document/get', payload);
  return response.data;
};

const getCancellation = async (payload) => {
  const response = await api().post('/setting/document/cancellation/get', payload);
  return response.data;
};

const createInvoiceCancellation = async (payload) => {
  const response = await api().post('/setting/document/invoice/cancellation', payload);
  return response.data;
};

const updateInvoiceCancellation = async (payload, id) => {
  const response = await api().patch(
    `/setting/document/invoice/cancellation/${id}`,
    payload
  );
  return response.data;
};

const settinService = {
  createGeneralSetting,
  generalSettingCurrentBusiness,
  getSingleGeneralSetting,
  updateGeneralSetting,
  createOfferDocumentSetting,
  updateOfferDocumentSetting,
  createOrderDocumentSetting,
  updateOrderrDocumentSetting,
  createDeliveryNotesDocumentSetting,
  updateDeliveryNotesDocumentSetting,
  createInvoiceDocumentSetting,
  updateInvoiceDocumentSetting,
  createProductDocumentSetting,
  updateProductDocumentSetting,
  getDocumentSetting,
  getCancellation,
  createInvoiceCancellation,
  updateInvoiceCancellation,
  createCreditNoteDocumentSetting,
  updateCreditNoteDocumentSetting
};

export default settinService;
