import api from "@/common/utils/api";

const createApplication = async (data) => {
  const response = await api().post("/creator-applications", data);
  return response.data;
};

const getAllCreatorApplications = async (status, search, sortBy, sortOrder) => {
  const params = {};
  if (status) params.status = status;
  if (search) params.search = search;
  if (sortBy) params.sortBy = sortBy;
  if (sortOrder) params.sortOrder = sortOrder;
  const response = await api().get("/creator-applications", { params });
  return response.data;
};

const approveApplicationAndInvite = async (applicationId, email) => {
  const response = await api().post(`/creator-applications/${applicationId}/approve-and-invite`, {
    email,
  });
  return response.data;
};

const denyApplication = async (applicationId) => {
  const response = await api().put(`/creator-applications/${applicationId}/status`, {
    status: "DENIED",
  });
  return response.data;
};

const updateApplicationStatus = async (applicationId, status) => {
  const response = await api().put(`/creator-applications/${applicationId}/status`, { status });
  return response.data;
};

const creatorApplicationsService = {
  createApplication,
  getAllCreatorApplications,
  approveApplicationAndInvite,
  denyApplication,
  updateApplicationStatus,
};

export default creatorApplicationsService;

