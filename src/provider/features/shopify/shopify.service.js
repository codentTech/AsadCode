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

const getProducts = async () => {
  const response = await api().get("/shopify/products");
  return response.data;
};

const getDiscountCodes = async (contractId) => {
  const response = await api().get("/shopify/discount-codes", {
    params: { contractId },
  });
  return response.data;
};

const renameDiscountCode = async ({ id, code }) => {
  const response = await api().patch(`/shopify/discount-codes/${id}/rename`, { code });
  return response.data;
};

const deactivateDiscountCode = async (id) => {
  const response = await api().post(`/shopify/discount-codes/${id}/deactivate`);
  return response.data;
};

const reactivateDiscountCode = async (id) => {
  const response = await api().post(`/shopify/discount-codes/${id}/reactivate`);
  return response.data;
};

const killAndReissueDiscountCode = async (id) => {
  const response = await api().post(`/shopify/discount-codes/${id}/kill-and-reissue`);
  return response.data;
};

const shopifyService = {
  getConnection,
  getConnectUrl,
  disconnect,
  getProducts,
  getDiscountCodes,
  renameDiscountCode,
  deactivateDiscountCode,
  reactivateDiscountCode,
  killAndReissueDiscountCode,
};

export default shopifyService;
