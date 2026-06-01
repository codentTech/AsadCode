import api from "@/common/utils/api";

const getEmailPreferences = async () => {
  const response = await api().get("/email-preferences");
  return response.data;
};

const updateEmailPreferences = async (payload) => {
  const response = await api().patch("/email-preferences", payload);
  return response.data;
};

const dismissEmailPreferencesPopup = async () => {
  const response = await api().post("/email-preferences/dismiss-popup");
  return response.data;
};

const emailPreferencesService = {
  getEmailPreferences,
  updateEmailPreferences,
  dismissEmailPreferencesPopup,
};

export default emailPreferencesService;
