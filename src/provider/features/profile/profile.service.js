import api from '@/common/utils/api';

const createProfile = async (userData) => {
  const response = await api().post('/profile', userData);
  return response.data;
};

const getSingleProfile = async (id) => {
  const response = await api().get(`/profile/${id}`);
  return response.data;
};

const getAllProfile = async () => {
  const response = await api().get('/profile');
  return response.data;
};

const updateProfile = async (id, data) => {
  const response = await api().patch(`/profile/${id}`, data);
  return response.data;
};

const deleteProfile = async (id) => {
  const response = await api().delete(`/profile/${id}`);
  return response.data;
};

const profileService = {
  createProfile,
  deleteProfile,
  updateProfile,
  getAllProfile,
  getSingleProfile
};

export default profileService;
