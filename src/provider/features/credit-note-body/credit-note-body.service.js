import api from '@/common/utils/api';

const createCreditNoteBody = async (payload) => {
  const response = await api().post('/credit-note-body', payload);
  return response.data;
};

const getAllCreditNoteBody = async (payload) => {
  const response = await api().get('/credit-note-body', payload);
  return response.data;
};

const deleteCreditNoteBody = async (payload) => {
  const response = await api().delete(`/credit-note-body/${payload}`);
  return response.data;
};

const updateCreditNoteBody = async (payload, id) => {
  const response = await api().patch(`/credit-note-body/${id}`, payload);
  return response.data;
};

const creditNoteBodyService = {
  createCreditNoteBody,
  getAllCreditNoteBody,
  deleteCreditNoteBody,
  updateCreditNoteBody
};

export default creditNoteBodyService;
