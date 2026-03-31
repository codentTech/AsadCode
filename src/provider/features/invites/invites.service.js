import api from "@/common/utils/api";

const validateInvite = async (token, email) => {
  const response = await api().post("/invites/validate", { token, email });
  return response.data;
};

const validateInviteQuery = async (token, email) => {
  const response = await api().get("/invites/validate", {
    params: { token, email },
  });
  return response.data;
};

const validateTokenOnly = async (token) => {
  const response = await api().get("/invites/validate-token", {
    params: { token },
    validateStatus: (status) => status >= 200 && status < 500,
  });
  return response.data;
};

const invitesService = {
  validateInvite,
  validateInviteQuery,
  validateTokenOnly,
};

export default invitesService;
