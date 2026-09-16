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
  getProducts: { ...generalState },
  getDiscountCodes: { ...generalState },
  renameDiscountCode: { ...generalState },
  deactivateDiscountCode: { ...generalState },
  reactivateDiscountCode: { ...generalState },
  killAndReissueDiscountCode: { ...generalState },
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

export const selectShopifyProductsState = (state) =>
  state?.shopify?.getProducts ?? shopifyInitialState.getProducts;

export const selectShopifyDiscountCodesState = (state) =>
  state?.shopify?.getDiscountCodes ?? shopifyInitialState.getDiscountCodes;

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

export const getShopifyProducts = createAsyncThunk(
  "shopify/getProducts",
  async (_, thunkAPI) => {
    try {
      const response = await shopifyService.getProducts();
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const getShopifyDiscountCodes = createAsyncThunk(
  "shopify/getDiscountCodes",
  async (contractId, thunkAPI) => {
    try {
      const response = await shopifyService.getDiscountCodes(contractId);
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const renameShopifyDiscountCode = createAsyncThunk(
  "shopify/renameDiscountCode",
  async (payload, thunkAPI) => {
    try {
      const response = await shopifyService.renameDiscountCode(payload);
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const deactivateShopifyDiscountCode = createAsyncThunk(
  "shopify/deactivateDiscountCode",
  async (id, thunkAPI) => {
    try {
      const response = await shopifyService.deactivateDiscountCode(id);
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const reactivateShopifyDiscountCode = createAsyncThunk(
  "shopify/reactivateDiscountCode",
  async (id, thunkAPI) => {
    try {
      const response = await shopifyService.reactivateDiscountCode(id);
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const killAndReissueShopifyDiscountCode = createAsyncThunk(
  "shopify/killAndReissueDiscountCode",
  async (id, thunkAPI) => {
    try {
      const response = await shopifyService.killAndReissueDiscountCode(id);
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
    resetShopifyProducts: (state) => {
      state.getProducts = { ...generalState };
    },
    resetShopifyRenameDiscountCode: (state) => {
      state.renameDiscountCode = { ...generalState };
    },
    resetShopifyKillAndReissueDiscountCode: (state) => {
      state.killAndReissueDiscountCode = { ...generalState };
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
      })
      .addCase(getShopifyProducts.pending, (state) => {
        state.getProducts.isLoading = true;
        state.getProducts.isError = false;
        state.getProducts.isSuccess = false;
        state.getProducts.message = "";
      })
      .addCase(getShopifyProducts.fulfilled, (state, action) => {
        state.getProducts = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload,
        };
      })
      .addCase(getShopifyProducts.rejected, (state, action) => {
        state.getProducts = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: action.payload?.message || "Unable to load products from Shopify",
          data: state.getProducts.data,
        };
      })
      .addCase(getShopifyDiscountCodes.pending, (state) => {
        state.getDiscountCodes.isLoading = true;
        state.getDiscountCodes.isError = false;
      })
      .addCase(getShopifyDiscountCodes.fulfilled, (state, action) => {
        state.getDiscountCodes = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload,
        };
      })
      .addCase(getShopifyDiscountCodes.rejected, (state, action) => {
        state.getDiscountCodes = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: action.payload?.message,
          data: null,
        };
      })
      .addCase(renameShopifyDiscountCode.pending, (state) => {
        state.renameDiscountCode.isLoading = true;
        state.renameDiscountCode.isError = false;
        state.renameDiscountCode.isSuccess = false;
        state.renameDiscountCode.message = "";
      })
      .addCase(renameShopifyDiscountCode.fulfilled, (state, action) => {
        state.renameDiscountCode = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload,
        };
        const list = Array.isArray(state.getDiscountCodes.data)
          ? state.getDiscountCodes.data
          : [];
        state.getDiscountCodes.data = list.map((item) =>
          item.id === action.payload?.id ? action.payload : item
        );
      })
      .addCase(renameShopifyDiscountCode.rejected, (state, action) => {
        state.renameDiscountCode = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: action.payload?.message,
          data: null,
        };
      })
      .addCase(deactivateShopifyDiscountCode.pending, (state) => {
        state.deactivateDiscountCode.isLoading = true;
      })
      .addCase(deactivateShopifyDiscountCode.fulfilled, (state, action) => {
        state.deactivateDiscountCode = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload,
        };
        const list = Array.isArray(state.getDiscountCodes.data)
          ? state.getDiscountCodes.data
          : [];
        state.getDiscountCodes.data = list.map((item) =>
          item.id === action.payload?.id ? action.payload : item
        );
      })
      .addCase(deactivateShopifyDiscountCode.rejected, (state, action) => {
        state.deactivateDiscountCode = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: action.payload?.message,
          data: null,
        };
      })
      .addCase(reactivateShopifyDiscountCode.pending, (state) => {
        state.reactivateDiscountCode.isLoading = true;
      })
      .addCase(reactivateShopifyDiscountCode.fulfilled, (state, action) => {
        state.reactivateDiscountCode = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload,
        };
        const list = Array.isArray(state.getDiscountCodes.data)
          ? state.getDiscountCodes.data
          : [];
        state.getDiscountCodes.data = list.map((item) =>
          item.id === action.payload?.id ? action.payload : item
        );
      })
      .addCase(reactivateShopifyDiscountCode.rejected, (state, action) => {
        state.reactivateDiscountCode = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: action.payload?.message,
          data: null,
        };
      })
      .addCase(killAndReissueShopifyDiscountCode.pending, (state) => {
        state.killAndReissueDiscountCode.isLoading = true;
        state.killAndReissueDiscountCode.isError = false;
        state.killAndReissueDiscountCode.isSuccess = false;
        state.killAndReissueDiscountCode.message = "";
      })
      .addCase(killAndReissueShopifyDiscountCode.fulfilled, (state, action) => {
        state.killAndReissueDiscountCode = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload,
        };
        state.getDiscountCodes.data = action.payload;
      })
      .addCase(killAndReissueShopifyDiscountCode.rejected, (state, action) => {
        state.killAndReissueDiscountCode = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: action.payload?.message,
          data: null,
        };
      });
  },
});

export const {
  resetShopifyConnectUrl,
  resetShopifyDisconnect,
  resetShopifyProducts,
  resetShopifyRenameDiscountCode,
  resetShopifyKillAndReissueDiscountCode,
} = shopifySlice.actions;
export default shopifySlice.reducer;
