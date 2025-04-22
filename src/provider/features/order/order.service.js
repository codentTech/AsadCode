import api from '@/common/utils/api';

const addCustomer = async (payload) => {
  const response = await api().post('/order/add-customer', payload);
  return response.data;
};

const createHeaderBody = async (payload) => {
  const response = await api().post('/order/add-header-and-body', payload);
  return response.data;
};

const createLineItem = async (payload) => {
  const response = await api().post('/order/add-line-item', payload);
  return response.data;
};

const addPageStructure = async (payload) => {
  const response = await api().post('/order/add-page-structure', payload);
  return response.data;
};

const getAllOrders = async (payload) => {
  const response = await api().post('/order/get-all', payload);
  return response.data;
};

const getSingleOrder = async (id) => {
  const response = await api().get(`/order/${id}`);
  return response.data;
};

const updateOrder = async (payload, id) => {
  const response = await api().patch(`/order/${id}`, payload);
  return response.data;
};

const deleteOrder = async (id) => {
  const response = await api().delete(`/order/${id}`);
  return response.data;
};

const getOrderHistory = async (id) => {
  const response = await api().get(`/order/get-history/${id}`);
  return response.data;
};

const bookAnOrder = async (id, orderTemplateId) => {
  const response = await api().patch(`/order/book-an-order/${id}`, {
    orderTemplateId
  });
  return response.data;
};

const orderRejection = async (payload) => {
  const response = await api().patch('/order/rejection', payload);
  return response.data;
};

const addOrderTemplate = async (payload) => {
  const response = await api().post('/order/add-template', payload);
  return response.data;
};

const uploadFiles = async ({ payload }) => {
  const { attachments, id } = payload;
  const response = await api().patch(`/order/upload-files/${id}`, { attachments });
  return response.data;
};

const saveAsDraft = async (orderTemplateId, id) => {
  const response = await api().patch(`/order/save-as-draft/${id}`, { orderTemplateId });
  return response.data;
};

const orderService = {
  addCustomer,
  createHeaderBody,
  createLineItem,
  addPageStructure,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
  getOrderHistory,
  bookAnOrder,
  orderRejection,
  addOrderTemplate,
  uploadFiles,
  saveAsDraft
};

export default orderService;
