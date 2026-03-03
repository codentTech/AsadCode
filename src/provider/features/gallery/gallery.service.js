import api from "@/common/utils/api";

const getCreatorGallery = async (creatorId = null, nicheId = null) => {
  const params = {};
  if (nicheId) params.nicheId = nicheId;
  const endpoint = creatorId ? `/gallery/creator/${creatorId}` : `/gallery`;
  const response = await api().get(endpoint, { params });
  return response.data;
};

const importPost = async (data) => {
  const response = await api().post("/gallery/import-post", data);
  return response.data;
};

const uploadFile = async (data) => {
  const response = await api().post("/gallery/upload-file", data);
  return response.data;
};

const refreshMetrics = async (galleryId) => {
  const response = await api().post(`/gallery/refresh-metrics/${galleryId}`);
  return response.data;
};

const deleteGalleryItem = async (galleryId) => {
  const response = await api().delete(`/gallery/${galleryId}`);
  return response.data;
};

const galleryService = {
  getCreatorGallery,
  importPost,
  uploadFile,
  refreshMetrics,
  deleteGalleryItem,
};

export default galleryService;
