import api from "@/common/utils/api";

const listAssets = async (params = {}) => {
  const response = await api().get("/content-library", { params });
  return response.data;
};

const getFilterOptions = async () => {
  const response = await api().get("/content-library/filter-options");
  return response.data;
};

const getAssetById = async (id) => {
  const response = await api().get(`/content-library/${id}`);
  return response.data;
};

const archiveAsset = async (id) => {
  const response = await api().patch(`/content-library/${id}/archive`);
  return response.data;
};

const unarchiveAsset = async (id) => {
  const response = await api().patch(`/content-library/${id}/unarchive`);
  return response.data;
};

const downloadAsset = async (id) => {
  const response = await api().get(`/content-library/${id}/download`, {
    responseType: "blob",
  });
  return response;
};

const contentLibraryService = {
  listAssets,
  getFilterOptions,
  getAssetById,
  archiveAsset,
  unarchiveAsset,
  downloadAsset,
};

export default contentLibraryService;
