"use client";

import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { getAccessToken } from "./access-token.util";
import { delay } from "./generic.util";
import { removeUser } from "./users.util";

const api = (headers = null) => {
  const accessToken = getAccessToken();

  const defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const combinedHeaders = accessToken
    ? { ...defaultHeaders, ...headers, Authorization: `Bearer ${accessToken}` }
    : { ...defaultHeaders, ...headers };

  const apiInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_MAIN_URL || "http://localhost:3000/api",
    headers: combinedHeaders,
  });

  apiInstance.interceptors.response.use(
    async (response) => {
      const method = response.config.method;
      const endpoint = response.config.url?.split("/").pop();

      const isSuccessResponse =
        (method === "get" && endpoint === "generate-otp") ||
        (["post", "patch", "delete", "put"].includes(method) &&
          !["get", "get-all"].includes(endpoint) &&
          !["/upload", "/upload/multiple"].includes(response.config.url) &&
          !response.config.url?.includes("/chat"));

      const skipToast =
        response.config.headers?.["x-skip-toast"] ?? response.config.headers?.["X-Skip-Toast"];

      if (isSuccessResponse && !skipToast) {
        enqueueSnackbar(response.data?.message || "Success", { variant: "success" });
        await delay(700);
      }

      return response;
    },
    (error) => {
      // Network issues
      if (error.message === "Network Error") {
        enqueueSnackbar(error.message, { variant: "error" });
        throw error;
      }

      const message = error.response?.data?.message || error.message || error.toString();

      const responseURL = error.request?.responseURL;

      if (responseURL.includes("onboarding")) return null;

      // Handle unauthorized
      // if (error.response?.status === 401) {
      //   removeUser();
      //   window.location.href = "/login";
      //   return;
      // }

      // Check if toast should be skipped for this request
      const skipToast =
        error.config?.headers?.["x-skip-toast"] ?? error.config?.headers?.["X-Skip-Toast"];
      
      // Skip toast for payment method errors (they're shown in the component)
      const isPaymentMethodError = 
        responseURL?.includes("/payment-methods/attach") ||
        responseURL?.includes("/payment-methods/setup-intent");

      // Handle message display
      if (!skipToast && !isPaymentMethodError) {
        if (Array.isArray(message)) {
          message.forEach((msg) => enqueueSnackbar(msg, { variant: "error" }));
        } else {
          if (message !== "Record Not Found") {
            enqueueSnackbar(message, { variant: "error" });
          }
        }
      }

      return Promise.reject(error); // Reject instead of returning raw response
    }
  );

  return apiInstance;
};

export default api;
