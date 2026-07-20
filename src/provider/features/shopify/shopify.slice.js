import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import shopifyService from "./shopify.service";

const generalState = {
  data: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const shopifyInitialState = {
  getConnection: { ...generalState },
  getConnectUrl: { ...generalState },
  disconnect: { ...generalState },
};

const initialState = shopifyInitialState;

const getSerializableError = (error) => {
  if (!error) return { message: "Something went wrong" };
  if (typeof error === "string") return { message: error };
  return {
    message: error.message || error?.response?.data?.message || "Something went wrong",
    ...error,
  };
};

export const selectShopifyConnectionState = (state) =>
  state?.shopify?.getConnection ?? shopifyInitialState.getConnection;

export const selectShopifyConnectUrlState = (state) =>
  state?.shopify?.getConnectUrl ?? shopifyInitialState.getConnectUrl;

export const selectShopifyDisconnectState = (state) =>
  state?.shopify?.disconnect ?? shopifyInitialState.disconnect;

export const getShopifyConnection = createAsyncThunk(
  "shopify/getConnection",
  async (_, thunkAPI) => {
    try {
      const response = await shopifyService.getConnection();
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const getShopifyConnectUrl = createAsyncThunk(
  "shopify/getConnectUrl",
  async (payload, thunkAPI) => {
    try {
      const response = await shopifyService.getConnectUrl(payload);
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const disconnectShopify = createAsyncThunk(
  "shopify/disconnect",
  async (payload, thunkAPI) => {
    try {
      const response = await shopifyService.disconnect(payload);
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

const shopifySlice = createSlice({
  name: "shopify",
  initialState,
  reducers: {
    resetShopifyConnectUrl: (state) => {
      state.getConnectUrl = { ...generalState };
    },
    resetShopifyDisconnect: (state) => {
      state.disconnect = { ...generalState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getShopifyConnection.pending, (state) => {
        state.getConnection.isLoading = true;
      })
      .addCase(getShopifyConnection.fulfilled, (state, action) => {
        state.getConnection = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload,
        };
      })
      .addCase(getShopifyConnection.rejected, (state, action) => {
        state.getConnection = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: action.payload?.message,
          data: null,
        };
      })
      .addCase(getShopifyConnectUrl.pending, (state) => {
        state.getConnectUrl.isLoading = true;
      })
      .addCase(getShopifyConnectUrl.fulfilled, (state, action) => {
        state.getConnectUrl = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload,
        };
      })
      .addCase(getShopifyConnectUrl.rejected, (state, action) => {
        state.getConnectUrl = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: action.payload?.message,
          data: null,
        };
      })
      .addCase(disconnectShopify.pending, (state) => {
        state.disconnect.isLoading = true;
      })
      .addCase(disconnectShopify.fulfilled, (state, action) => {
        state.disconnect = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload,
        };
        if (action.payload?.disconnected) {
          state.getConnection.data = {
            ...(state.getConnection.data || {}),
            connected: false,
            status: "disconnected",
          };
        }
      })
      .addCase(disconnectShopify.rejected, (state, action) => {
        state.disconnect = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: action.payload?.message,
          data: null,
        };
      });
  },
});

export const { resetShopifyConnectUrl, resetShopifyDisconnect } = shopifySlice.actions;
export default shopifySlice.reducer;
