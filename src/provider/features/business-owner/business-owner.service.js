import api from '@/common/utils/api';

const getAllBusinessOwner = async (payload) => {
  const response = await api().post('/user/get-all', payload);
  return response.data;
};
const createBusinessOwner = async (payload) => {
  const response = await api().post('/user/get-all', payload);
  return response.data;
};
const updateBusinessOwner = async (payload, id) => {
  const response = await api().patch(`/update-business-owner/${id}`, payload);
  return response.data;
};
const deleteBusinessOwner = async (payload, id) => {
  const response = await api().delete(`/user/${id}`, payload);
  return response.data;
};
