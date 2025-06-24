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
    baseURL: process.env.NEXT_PUBLIC_MAIN_URL,
    headers: combinedHeaders,
  });

  apiInstance.interceptors.response.use(
    async (response) => {
      const method = response.config.method;
      const endpoint = response.config.url?.split("/").pop();

      const isSuccessResponse =
        (method === "get" && endpoint === "generate-otp") ||
        (["post", "patch", "delete"].includes(method) &&
          !["get", "get-all"].includes(endpoint) &&
          !["/upload/single", "/upload/multiple"].includes(response.config.url));

      if (isSuccessResponse) {
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

      const status = error.response?.status;
      const message = error.response?.data?.message || error.message || error.toString();

      // Handle unauthorized
      if (status === 401) {
        removeUser();
        window.location.href = "/";
        return;
      }

      // Handle message display
      if (Array.isArray(message)) {
        message.forEach((msg) => enqueueSnackbar(msg, { variant: "error" }));
      } else {
        const responseURL = error.request?.responseURL;
        const currentEndpoint = responseURL?.split("/").pop();

        if (currentEndpoint === "current-business-setting") {
          return error.message;
        }

        if (message !== "Record Not Found") {
          enqueueSnackbar(message, { variant: "error" });
        }
      }

      return Promise.reject(error); // Reject instead of returning raw response
    }
  );

  return apiInstance;
};

export default api;
