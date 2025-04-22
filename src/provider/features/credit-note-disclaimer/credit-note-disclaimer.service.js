import api from '@/common/utils/api';

const createCreditNoteDisclaimer = async (payload) => {
  const response = await api().post('/credit-note-disclaimer', payload);
  return response.data;
};

const getAllCreditNoteDisclaimer = async (payload) => {
  const response = await api().get('/credit-note-disclaimer', payload);
  return response.data;
};

const deleteCreditNoteDisclaimer = async (payload) => {
  const response = await api().delete(`/credit-note-disclaimer/${payload}`);
  return response.data;
};

const updateCreditNoteDisclaimer = async (payload, id) => {
  const response = await api().patch(`/credit-note-disclaimer/${id}`, payload);
  return response.data;
};

const creditNoteDisclaimerService = {
  createCreditNoteDisclaimer,
  getAllCreditNoteDisclaimer,
  deleteCreditNoteDisclaimer,
  updateCreditNoteDisclaimer
};

export default creditNoteDisclaimerService;
