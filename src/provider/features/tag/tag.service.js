import api from '@/common/utils/api';

const createTag = async (userData) => {
  const response = await api().post('/tags', userData);
  return response.data;
};

const getOrCreateTag = async (userData) => {
  const response = await api().post('/tags/get-or-create', userData);
  return response.data;
};

const getSingleTag = async (id) => {
  const response = await api().get(`/tags/${id}`);
  return response.data;
};

const getAllTag = async () => {
  const response = await api().get('/tags');
  return response.data;
};

const updateTag = async (id, data) => {
  const response = await api().patch(`/tags/${id}`, data);
  return response.data;
};

const deleteTag = async (id) => {
  const response = await api().delete(`/tags/${id}`);
  return response.data;
};

const tagService = {
  createTag,
  deleteTag,
  updateTag,
  getAllTag,
  getSingleTag,
  getOrCreateTag
};

export default tagService;
