import api from "@/common/utils/api";

// Create pitch
const createPitch = async (pitchData) => {
  const response = await api().post("/pitches", pitchData);
  return response.data;
};

// Get all pitches
const getAllPitches = async () => {
  const response = await api().get("/pitches");
  return response.data;
};

// Get pitch by ID
const getPitchById = async (pitchId) => {
  const response = await api().get(`/pitches/${pitchId}`);
  return response.data;
};

// Update pitch
const updatePitch = async (pitchId, pitchData) => {
  const response = await api().patch(`/pitches/${pitchId}`, pitchData);
  return response.data;
};

// Delete pitch
const deletePitch = async (pitchId) => {
  const response = await api().delete(`/pitches/${pitchId}`);
  return response.data;
};

const pitchesService = {
  createPitch,
  getAllPitches,
  getPitchById,
  updatePitch,
  deletePitch,
};

export default pitchesService;
