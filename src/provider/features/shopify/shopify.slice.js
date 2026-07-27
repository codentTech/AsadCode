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
  getFulfilment: { ...generalState },
  getCommissionTally: { ...generalState },
  getCommissionSettlements: { ...generalState },
  getCompletedMetrics: { ...generalState },
  sendProduct: { ...generalState },
  renameDiscountCode: { ...generalState },
  deactivateDiscountCode: { ...generalState },
  reactivateDiscountCode: { ...generalState },
  killAndReissueDiscountCode: { ...generalState },
  extendDiscountTracking: { ...generalState },
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

export const selectShopifyFulfilmentState = (state) =>
  state?.shopify?.getFulfilment ?? shopifyInitialState.getFulfilment;

export const selectShopifyCommissionTallyState = (state) =>
  state?.shopify?.getCommissionTally ?? shopifyInitialState.getCommissionTally;

export const selectShopifyCommissionSettlementsState = (state) =>
  state?.shopify?.getCommissionSettlements ??
  shopifyInitialState.getCommissionSettlements;

export const selectShopifyCompletedMetricsState = (state) =>
  state?.shopify?.getCompletedMetrics ?? shopifyInitialState.getCompletedMetrics;

export const selectShopifySendProductState = (state) =>
  state?.shopify?.sendProduct ?? shopifyInitialState.sendProduct;

export const selectShopifyExtendDiscountTrackingState = (state) =>
  state?.shopify?.extendDiscountTracking ??
  shopifyInitialState.extendDiscountTracking;

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

export const extendShopifyDiscountTracking = createAsyncThunk(
  "shopify/extendDiscountTracking",
  async (payload, thunkAPI) => {
    try {
      const response = await shopifyService.extendDiscountTracking(payload);
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const getShopifyFulfilment = createAsyncThunk(
  "shopify/getFulfilment",
  async (contractId, thunkAPI) => {
    try {
      const response = await shopifyService.getFulfilment(contractId);
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const getShopifyCommissionTally = createAsyncThunk(
  "shopify/getCommissionTally",
  async (contractId, thunkAPI) => {
    try {
      const response = await shopifyService.getCommissionTally(contractId);
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const getShopifyCommissionSettlements = createAsyncThunk(
  "shopify/getCommissionSettlements",
  async (campaignId, thunkAPI) => {
    try {
      const response = await shopifyService.getCommissionSettlements(campaignId);
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const getShopifyCompletedMetrics = createAsyncThunk(
  "shopify/getCompletedMetrics",
  async (campaignId, thunkAPI) => {
    try {
      const response = await shopifyService.getCompletedMetrics(campaignId);
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const sendShopifyProduct = createAsyncThunk(
  "shopify/sendProduct",
  async (payload, thunkAPI) => {
    try {
      const response = await shopifyService.sendProduct(payload);
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
    resetShopifyExtendDiscountTracking: (state) => {
      state.extendDiscountTracking = { ...generalState };
    },
    resetShopifySendProduct: (state) => {
      state.sendProduct = { ...generalState };
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
      })
      .addCase(getShopifyFulfilment.pending, (state) => {
        state.getFulfilment.isLoading = true;
        state.getFulfilment.isError = false;
      })
      .addCase(getShopifyFulfilment.fulfilled, (state, action) => {
        state.getFulfilment = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload,
        };
      })
      .addCase(getShopifyFulfilment.rejected, (state, action) => {
        state.getFulfilment = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: action.payload?.message,
          data: null,
        };
      })
      .addCase(getShopifyCommissionTally.pending, (state) => {
        state.getCommissionTally.isLoading = true;
        state.getCommissionTally.isError = false;
      })
      .addCase(getShopifyCommissionTally.fulfilled, (state, action) => {
        state.getCommissionTally = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload,
        };
      })
      .addCase(getShopifyCommissionTally.rejected, (state, action) => {
        state.getCommissionTally = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: action.payload?.message,
          data: null,
        };
      })
      .addCase(getShopifyCommissionSettlements.pending, (state) => {
        state.getCommissionSettlements.isLoading = true;
        state.getCommissionSettlements.isError = false;
      })
      .addCase(getShopifyCommissionSettlements.fulfilled, (state, action) => {
        state.getCommissionSettlements = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload,
        };
      })
      .addCase(getShopifyCommissionSettlements.rejected, (state, action) => {
        state.getCommissionSettlements = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: action.payload?.message,
          data: null,
        };
      })
      .addCase(getShopifyCompletedMetrics.pending, (state) => {
        state.getCompletedMetrics.isLoading = true;
        state.getCompletedMetrics.isError = false;
      })
      .addCase(getShopifyCompletedMetrics.fulfilled, (state, action) => {
        state.getCompletedMetrics = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload,
        };
      })
      .addCase(getShopifyCompletedMetrics.rejected, (state, action) => {
        state.getCompletedMetrics = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: action.payload?.message,
          data: null,
        };
      })
      .addCase(extendShopifyDiscountTracking.pending, (state) => {
        state.extendDiscountTracking.isLoading = true;
        state.extendDiscountTracking.isError = false;
        state.extendDiscountTracking.isSuccess = false;
        state.extendDiscountTracking.message = "";
      })
      .addCase(extendShopifyDiscountTracking.fulfilled, (state, action) => {
        state.extendDiscountTracking = {
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
          item.id === action.payload?.id
            ? {
                ...item,
                ...action.payload,
              }
            : {
                ...item,
                trackingEndDate:
                  item.contractId === action.payload?.contractId
                    ? action.payload.trackingEndDate
                    : item.trackingEndDate,
                payoutDate:
                  item.contractId === action.payload?.contractId
                    ? action.payload.payoutDate
                    : item.payoutDate,
              }
        );
      })
      .addCase(extendShopifyDiscountTracking.rejected, (state, action) => {
        state.extendDiscountTracking = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: action.payload?.message,
          data: null,
        };
      })
      .addCase(sendShopifyProduct.pending, (state) => {
        state.sendProduct.isLoading = true;
        state.sendProduct.isError = false;
        state.sendProduct.isSuccess = false;
        state.sendProduct.message = "";
      })
      .addCase(sendShopifyProduct.fulfilled, (state, action) => {
        state.sendProduct = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload,
        };
        state.getFulfilment = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload,
        };
      })
      .addCase(sendShopifyProduct.rejected, (state, action) => {
        state.sendProduct = {
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
  resetShopifyExtendDiscountTracking,
  resetShopifySendProduct,
} = shopifySlice.actions;
export default shopifySlice.reducer;
