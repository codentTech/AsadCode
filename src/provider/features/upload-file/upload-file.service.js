import api from "@/common/utils/api";

const uploadSingleFile = async (payload) => {
  const response = await api().post("/upload", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const uploadMultipleFiles = async (payload) => {
  const response = await api().post("/upload/multi", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const uploadFileService = {
  uploadSingleFile,
  uploadMultipleFiles,
};

export default uploadFileService;
