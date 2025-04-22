import api from '@/common/utils/api';

const createUnit = async (payload) => {
  const response = await api().post('/unit', payload);
  return response.data;
};

const getAllUnit = async (payload) => {
  const response = await api().post('/unit/get-all', payload);
  return response.data;
};

const getSingleUnit = async ({ id }) => {
  const response = await api().get(`/unit/${id}`);
  return response.data;
};

const deleteUnit = async (id) => {
  const response = await api().delete(`/unit/${id}`);
  return response.data;
};

const updateUnit = async (payload) => {
  const { unit, id, isDefault } = payload;
  const response = await api().patch(`/unit/${id}`, { unit, isDefault });
  return response.data;
};

const unitService = {
  createUnit,
  getAllUnit,
  getSingleUnit,
  deleteUnit,
  updateUnit
};

export default unitService;
