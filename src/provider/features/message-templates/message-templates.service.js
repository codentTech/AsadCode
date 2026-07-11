import api from "@/common/utils/api";

const createTemplate = async (templateData) => {
  const response = await api().post("/message-templates", templateData);
  return response.data;
};

const getAllTemplates = async () => {
  const response = await api().get("/message-templates");
  return response.data;
};

const getTemplate = async (templateId) => {
  const response = await api().get(`/message-templates/${templateId}`);
  return response.data;
};

const updateTemplate = async (templateId, templateData) => {
  const response = await api().put(`/message-templates/${templateId}`, templateData);
  return response.data;
};

const deleteTemplate = async (templateId) => {
  const response = await api().delete(`/message-templates/${templateId}`);
  return response.data;
};

const messageTemplatesService = {
  createTemplate,
  getAllTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate,
};

export default messageTemplatesService;
