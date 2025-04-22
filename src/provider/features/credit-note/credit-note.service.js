import api from '@/common/utils/api';
import config from '@/provider/features/credit-note/credit-note.config';

const addCustomer = async (payload) => {
  const response = await api().post(config.apiAddCustomerUrl, payload);
  return response.data;
};

const createHeaderBody = async (payload) => {
  const response = await api().post(config.apiCreateHeaderBody, payload);
  return response.data;
};

const createLineItem = async (payload) => {
  const response = await api().post(config.apiCreateLineItemUrl, payload);
  return response.data;
};

const addPageStructure = async (payload) => {
  const response = await api().post(config.apiAddPageStructureUrl, payload);
  return response.data;
};

const getAllCreditNotes = async (payload) => {
  const response = await api().post(config.apiGetAllUrl, payload);
  return response.data;
};

const getSingleCreditNote = async (id) => {
  const response = await api().get(`${config.apiGetSingleDocumentUrl}${id}`);
  return response.data;
};

const updateCreditNote = async (payload, id) => {
  const response = await api().patch(`${config.apiUpdateDocumentUrl}${id}`, payload);
  return response.data;
};

const deleteCreditNote = async (id) => {
  const response = await api().delete(`${config.apiDeleteDocumentUrl}${id}`);
  return response.data;
};

const getCreditNoteHistory = async (id) => {
  const response = await api().get(`${config.apiGetDocumentHistoryUrl}${id}`);
  return response.data;
};

const bookAnCreditNote = async (id, creditNoteTemplateId) => {
  const response = await api().patch(`${config.apiBookAnDocumentUrl}${id}`, {
    creditNoteTemplateId
  });
  return response.data;
};

const creditNoteRejection = async ({ payload }) => {
  const response = await api().patch(config.apiDocumentRejectionUrl, payload);
  return response.data;
};

const addCreditNoteTemplate = async (payload) => {
  const response = await api().post(config.apiAddDocumentTemplateUrl, payload);
  return response.data;
};

const saveAsDraft = async (creditNoteTemplateId, id) => {
  const response = await api().patch(`${config.apiSaveAsDraftUrl}${id}`, {
    creditNoteTemplateId
  });
  return response.data;
};

const uploadFiles = async ({ payload }) => {
  const { attachments, id } = payload;
  const response = await api().patch(`${config.apiUploadFilesUrl}${id}`, { attachments });
  return response.data;
};

const creditNoteService = {
  addCustomer,
  createHeaderBody,
  createLineItem,
  addPageStructure,
  getAllCreditNotes,
  getSingleCreditNote,
  updateCreditNote,
  deleteCreditNote,
  getCreditNoteHistory,
  bookAnCreditNote,
  creditNoteRejection,
  addCreditNoteTemplate,
  uploadFiles,
  saveAsDraft
};

export default creditNoteService;
