import api from '@/common/utils/api';

const createCreditNoteComment = async (payload) => {
  const response = await api().post('/credit-note-comment', payload);
  return response.data;
};

const getAllCreditNoteComment = async (id) => {
  const response = await api().get(`/credit-note-comment/get-all/${id}`);
  return response.data;
};

const deleteCreditNoteComment = async (id) => {
  const response = await api().delete(`/credit-note-comment/${id}`);
  return response.data;
};

const updateCreditNoteComment = async (comment, id) => {
  const response = await api().patch(`/credit-note-comment/${id}`, { comment });
  return response.data;
};

const creditNoteCommentService = {
  createCreditNoteComment,
  getAllCreditNoteComment,
  deleteCreditNoteComment,
  updateCreditNoteComment
};

export default creditNoteCommentService;
