import api from "@/common/utils/api";

const getConnection = async () => {
  const response = await api().get("/shopify/connection");
  return response.data;
};

const getConnectUrl = async (payload) => {
  const response = await api().post("/shopify/connect", payload);
  return response.data;
};

const disconnect = async (payload) => {
  const response = await api().post("/shopify/disconnect", payload || {});
  return response.data;
};

const shopifyService = {
  getConnection,
  getConnectUrl,
  disconnect,
};

export default shopifyService;
