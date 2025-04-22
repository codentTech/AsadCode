import api from '@/common/utils/api';

const createSmtp = async (payload) => {
  const response = await api().post('/smtp', payload);
  return response.data;
};
const updateSmtp = async (payload, id) => {
  const response = await api().patch(`/smtp/${id}`, payload);
  return response.data;
};
const getSmtp = async () => {
  const response = await api().get('/smtp');
  return response.data;
};
const toggleSmtp = async () => {
  const response = await api().patch('/smtp/toggle-smtp');
  return response.data;
};

const smtpService = { createSmtp, updateSmtp, getSmtp, toggleSmtp };
export default smtpService;
