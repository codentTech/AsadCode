import api from '@/common/utils/api';

const createFaq = async (userData) => {
  const response = await api().post('/faq', userData);
  return response.data;
};

const getSingleFaq = async (id) => {
  const response = await api().get(`/faq/${id}`);
  return response.data;
};

const getAllFaq = async () => {
  const response = await api().get('/faq');
  return response.data;
};

const updateFaq = async (id, data) => {
  const response = await api().patch(`/faq/${id}`, data);
  return response.data;
};

const deleteFaq = async (id) => {
  const response = await api().delete(`/faq/${id}`);
  return response.data;
};

const faqService = {
  createFaq,
  deleteFaq,
  updateFaq,
  getAllFaq,
  getSingleFaq
};

export default faqService;
