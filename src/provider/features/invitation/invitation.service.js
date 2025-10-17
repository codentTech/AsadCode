import api from "@/common/utils/api";

const sendInvitation = async (invitationData) => {
  const response = await api().post("/invitations", invitationData);
  return response.data;
};

const invitationService = {
  sendInvitation,
};

export default invitationService;
