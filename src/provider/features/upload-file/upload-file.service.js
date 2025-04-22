import api from '@/common/utils/api';

const uploadSingleFile = async (payload) => {
  const response = await api().post('/upload/single', payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const uploadFileService = {
  uploadSingleFile
};

export default uploadFileService;
