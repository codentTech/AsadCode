import api from '@/common/utils/api';

const createTemplate = async (payload) => {
  const response = await api().post('/template', payload);
  return response.data;
};

const getAllTemplates = async (payload) => {
  const response = await api().post('/template/get-all', payload);
  return response.data;
};

const getSingleTemplate = async (id) => {
  const response = await api().get(`/template/${id}`);
  return response.data;
};

const deleteTemplate = async (id) => {
  const response = await api().delete(`/template/${id}`);
  return response.data;
};

const updateTemplate = async (id, data) => {
  const response = await api().patch(`/template/${id}`, data);
  return response.data;
};

const templateService = {
  createTemplate,
  getAllTemplates,
  getSingleTemplate,
  deleteTemplate,
  updateTemplate
};

export default templateService;
