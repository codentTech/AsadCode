import api from "@/common/utils/api";

const getContractById = async (contractId) => {
  const response = await api().get(`/contracts/${contractId}`);
  return response.data;
};

const getContractsByCampaign = async (campaignId) => {
  const response = await api().get(`/contracts/campaign/${campaignId}`);
  return response.data;
};

const getPendingContractsForCreator = async () => {
  const response = await api().get("/contracts/creator/pending");
  return response.data;
};

const getIndividualCollaborationContracts = async (isCompleted = false) => {
  const response = await api().get("/contracts/brand/individual-collaborations", {
    params: { completed: isCompleted },
  });
  return response.data;
};

const createContract = async (contractData) => {
  const response = await api().post("/contracts", contractData);
  return response.data;
};

const sendContract = async (contractId) => {
  const response = await api().post(`/contracts/${contractId}/send`);
  return response.data;
};

const signContract = async (contractId, signatureData) => {
  const response = await api().post(`/contracts/${contractId}/sign`, signatureData);
  return response.data;
};

const declineContract = async (contractId) => {
  const response = await api().post(`/contracts/${contractId}/decline`);
  return response.data;
};

const contractsService = {
  getContractById,
  getContractsByCampaign,
  getPendingContractsForCreator,
  getIndividualCollaborationContracts,
  createContract,
  sendContract,
  signContract,
  declineContract,
};

export default contractsService;
