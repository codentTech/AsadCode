import api from "@/common/utils/api";

const sendInvitation = async (invitationData) => {
  const response = await api().post("/invitations", invitationData);
  return response.data;
};

const getCreatorInvitations = async () => {
  const response = await api().get("/invitations/creator");
  return response.data;
};

const getBrandIndividualCollaborations = async () => {
  const response = await api().get("/invitations/brand/individual-collaborations");
  return response.data;
};

const invitationService = {
  sendInvitation,
  getCreatorInvitations,
  getBrandIndividualCollaborations,
};

export default invitationService;
