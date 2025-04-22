import api from '@/common/utils/api';

const documentConversion = async (payload) => {
  const response = await api().post('/document/conversion', payload);
  return response.data;
};

const documentDuplicate = async (payload) => {
  const response = await api().post('/document/duplication', payload);
  return response.data;
};

const documentSendAsEmail = async (payload) => {
  const response = await api().post('/document/send-as-email', payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const documentSendNotifyEmail = async (payload) => {
  const response = await api().post('/document/send-notify-email', payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const documentConversionService = {
  documentConversion,
  documentDuplicate,
  documentSendAsEmail,
  documentSendNotifyEmail
};

export default documentConversionService;
