import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import collaborationPaymentService from "./collaboration-payment.service";

const getSerializableError = (error, defaultMessage = "An unexpected error occurred") => {
  if (error?.response?.data) {
    return error.response.data;
  }
  if (error?.message) {
    return { message: error.message };
  }
  return { message: defaultMessage };
};

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  getPaymentMethods: generalState,
  hasPaymentMethod: generalState,
  createSetupIntent: generalState,
  attachPaymentMethod: generalState,
  removePaymentMethod: generalState,
  fundCollaboration: generalState,
  retryFunding: generalState,
  getPaymentByCollaboration: generalState,
  getBrandPayments: generalState,
  getCreatorPayments: generalState,
};

// Get payment methods
export const getPaymentMethods = createAsyncThunk(
  "collaborationPayment/getPaymentMethods",
  async (_, thunkAPI) => {
    try {
      const response = await collaborationPaymentService.getPaymentMethods();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to get payment methods")
      );
    }
  }
);

// Check if brand has payment method
export const checkHasPaymentMethod = createAsyncThunk(
  "collaborationPayment/checkHasPaymentMethod",
  async (_, thunkAPI) => {
    try {
      const response = await collaborationPaymentService.hasPaymentMethod();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to check payment method")
      );
    }
  }
);

// Create SetupIntent
export const createSetupIntent = createAsyncThunk(
  "collaborationPayment/createSetupIntent",
  async (_, thunkAPI) => {
    try {
      const response = await collaborationPaymentService.createSetupIntent();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to create setup intent")
      );
    }
  }
);

// Attach payment method
export const attachPaymentMethod = createAsyncThunk(
  "collaborationPayment/attachPaymentMethod",
  async (paymentMethodId, thunkAPI) => {
    try {
      const response = await collaborationPaymentService.attachPaymentMethod(paymentMethodId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to attach payment method")
      );
    }
  }
);

// Remove payment method
export const removePaymentMethod = createAsyncThunk(
  "collaborationPayment/removePaymentMethod",
  async (paymentMethodId, thunkAPI) => {
    try {
      const response = await collaborationPaymentService.removePaymentMethod(paymentMethodId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to remove payment method")
      );
    }
  }
);

// Fund collaboration
export const fundCollaboration = createAsyncThunk(
  "collaborationPayment/fundCollaboration",
  async (collaborationId, thunkAPI) => {
    try {
      const response = await collaborationPaymentService.fundCollaboration(collaborationId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to fund collaboration")
      );
    }
  }
);

// Retry funding
export const retryFunding = createAsyncThunk(
  "collaborationPayment/retryFunding",
  async ({ collaborationId, paymentMethodId }, thunkAPI) => {
    try {
      const response = await collaborationPaymentService.retryFunding(
        collaborationId,
        paymentMethodId
      );
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to retry funding")
      );
    }
  }
);

// Get payment by collaboration
export const getPaymentByCollaboration = createAsyncThunk(
  "collaborationPayment/getPaymentByCollaboration",
  async (collaborationId, thunkAPI) => {
    try {
      const response = await collaborationPaymentService.getPaymentByCollaboration(collaborationId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to get payment details")
      );
    }
  }
);

// Get brand payments
export const getBrandPayments = createAsyncThunk(
  "collaborationPayment/getBrandPayments",
  async (_, thunkAPI) => {
    try {
      const response = await collaborationPaymentService.getBrandPayments();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to get brand payments")
      );
    }
  }
);

// Get creator payments
export const getCreatorPayments = createAsyncThunk(
  "collaborationPayment/getCreatorPayments",
  async (_, thunkAPI) => {
    try {
      const response = await collaborationPaymentService.getCreatorPayments();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to get creator payments")
      );
    }
  }
);

const collaborationPaymentSlice = createSlice({
  name: "collaborationPayment",
  initialState,
  reducers: {
    resetGetPaymentMethods: (state) => {
      state.getPaymentMethods = generalState;
    },
    resetCreateSetupIntent: (state) => {
      state.createSetupIntent = generalState;
    },
    resetAttachPaymentMethod: (state) => {
      state.attachPaymentMethod = generalState;
    },
    resetRemovePaymentMethod: (state) => {
      state.removePaymentMethod = generalState;
    },
    resetFundCollaboration: (state) => {
      state.fundCollaboration = generalState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Payment Methods
      .addCase(getPaymentMethods.pending, (state) => {
        state.getPaymentMethods.isLoading = true;
        state.getPaymentMethods.isSuccess = false;
        state.getPaymentMethods.isError = false;
        state.getPaymentMethods.message = "";
      })
      .addCase(getPaymentMethods.fulfilled, (state, action) => {
        state.getPaymentMethods.isLoading = false;
        state.getPaymentMethods.isSuccess = true;
        state.getPaymentMethods.data = action.payload.data;
      })
      .addCase(getPaymentMethods.rejected, (state, action) => {
        state.getPaymentMethods.isLoading = false;
        state.getPaymentMethods.isError = true;
        state.getPaymentMethods.message =
          action.payload?.message || "Failed to get payment methods";
        state.getPaymentMethods.data = null;
      })
      // Check Has Payment Method
      .addCase(checkHasPaymentMethod.pending, (state) => {
        state.hasPaymentMethod.isLoading = true;
        state.hasPaymentMethod.isSuccess = false;
        state.hasPaymentMethod.isError = false;
        state.hasPaymentMethod.message = "";
      })
      .addCase(checkHasPaymentMethod.fulfilled, (state, action) => {
        state.hasPaymentMethod.isLoading = false;
        state.hasPaymentMethod.isSuccess = true;
        state.hasPaymentMethod.data = action.payload.data;
      })
      .addCase(checkHasPaymentMethod.rejected, (state, action) => {
        state.hasPaymentMethod.isLoading = false;
        state.hasPaymentMethod.isError = true;
        state.hasPaymentMethod.message =
          action.payload?.message || "Failed to check payment method";
        state.hasPaymentMethod.data = null;
      })
      // Create Setup Intent
      .addCase(createSetupIntent.pending, (state) => {
        state.createSetupIntent.isLoading = true;
        state.createSetupIntent.isSuccess = false;
        state.createSetupIntent.isError = false;
        state.createSetupIntent.message = "";
      })
      .addCase(createSetupIntent.fulfilled, (state, action) => {
        state.createSetupIntent.isLoading = false;
        state.createSetupIntent.isSuccess = true;
        state.createSetupIntent.data = action.payload.data;
      })
      .addCase(createSetupIntent.rejected, (state, action) => {
        state.createSetupIntent.isLoading = false;
        state.createSetupIntent.isError = true;
        state.createSetupIntent.message =
          action.payload?.message || "Failed to create setup intent";
        state.createSetupIntent.data = null;
      })
      // Attach Payment Method
      .addCase(attachPaymentMethod.pending, (state) => {
        state.attachPaymentMethod.isLoading = true;
        state.attachPaymentMethod.isSuccess = false;
        state.attachPaymentMethod.isError = false;
        state.attachPaymentMethod.message = "";
      })
      .addCase(attachPaymentMethod.fulfilled, (state) => {
        state.attachPaymentMethod.isLoading = false;
        state.attachPaymentMethod.isSuccess = true;
      })
      .addCase(attachPaymentMethod.rejected, (state, action) => {
        state.attachPaymentMethod.isLoading = false;
        state.attachPaymentMethod.isError = true;
        state.attachPaymentMethod.message =
          action.payload?.message || "Failed to attach payment method";
      })
      // Remove Payment Method
      .addCase(removePaymentMethod.pending, (state) => {
        state.removePaymentMethod.isLoading = true;
        state.removePaymentMethod.isSuccess = false;
        state.removePaymentMethod.isError = false;
        state.removePaymentMethod.message = "";
      })
      .addCase(removePaymentMethod.fulfilled, (state) => {
        state.removePaymentMethod.isLoading = false;
        state.removePaymentMethod.isSuccess = true;
      })
      .addCase(removePaymentMethod.rejected, (state, action) => {
        state.removePaymentMethod.isLoading = false;
        state.removePaymentMethod.isError = true;
        state.removePaymentMethod.message =
          action.payload?.message || "Failed to remove payment method";
      })
      // Fund Collaboration
      .addCase(fundCollaboration.pending, (state) => {
        state.fundCollaboration.isLoading = true;
        state.fundCollaboration.isSuccess = false;
        state.fundCollaboration.isError = false;
        state.fundCollaboration.message = "";
      })
      .addCase(fundCollaboration.fulfilled, (state, action) => {
        state.fundCollaboration.isLoading = false;
        state.fundCollaboration.isSuccess = true;
        state.fundCollaboration.data = action.payload.data;
      })
      .addCase(fundCollaboration.rejected, (state, action) => {
        state.fundCollaboration.isLoading = false;
        state.fundCollaboration.isError = true;
        state.fundCollaboration.message =
          action.payload?.message || "Failed to fund collaboration";
        state.fundCollaboration.data = null;
      })
      // Retry Funding
      .addCase(retryFunding.pending, (state) => {
        state.retryFunding.isLoading = true;
        state.retryFunding.isSuccess = false;
        state.retryFunding.isError = false;
        state.retryFunding.message = "";
      })
      .addCase(retryFunding.fulfilled, (state, action) => {
        state.retryFunding.isLoading = false;
        state.retryFunding.isSuccess = true;
        state.retryFunding.data = action.payload.data;
      })
      .addCase(retryFunding.rejected, (state, action) => {
        state.retryFunding.isLoading = false;
        state.retryFunding.isError = true;
        state.retryFunding.message = action.payload?.message || "Failed to retry funding";
        state.retryFunding.data = null;
      })
      // Get Payment By Collaboration
      .addCase(getPaymentByCollaboration.pending, (state) => {
        state.getPaymentByCollaboration.isLoading = true;
        state.getPaymentByCollaboration.isSuccess = false;
        state.getPaymentByCollaboration.isError = false;
        state.getPaymentByCollaboration.message = "";
      })
      .addCase(getPaymentByCollaboration.fulfilled, (state, action) => {
        state.getPaymentByCollaboration.isLoading = false;
        state.getPaymentByCollaboration.isSuccess = true;
        state.getPaymentByCollaboration.data = action.payload.data;
      })
      .addCase(getPaymentByCollaboration.rejected, (state, action) => {
        state.getPaymentByCollaboration.isLoading = false;
        state.getPaymentByCollaboration.isError = true;
        state.getPaymentByCollaboration.message =
          action.payload?.message || "Failed to get payment details";
        state.getPaymentByCollaboration.data = null;
      })
      // Get Brand Payments
      .addCase(getBrandPayments.pending, (state) => {
        state.getBrandPayments.isLoading = true;
        state.getBrandPayments.isSuccess = false;
        state.getBrandPayments.isError = false;
        state.getBrandPayments.message = "";
      })
      .addCase(getBrandPayments.fulfilled, (state, action) => {
        state.getBrandPayments.isLoading = false;
        state.getBrandPayments.isSuccess = true;
        state.getBrandPayments.data = action.payload.data;
      })
      .addCase(getBrandPayments.rejected, (state, action) => {
        state.getBrandPayments.isLoading = false;
        state.getBrandPayments.isError = true;
        state.getBrandPayments.message =
          action.payload?.message || "Failed to get brand payments";
        state.getBrandPayments.data = null;
      })
      // Get Creator Payments
      .addCase(getCreatorPayments.pending, (state) => {
        state.getCreatorPayments.isLoading = true;
        state.getCreatorPayments.isSuccess = false;
        state.getCreatorPayments.isError = false;
        state.getCreatorPayments.message = "";
      })
      .addCase(getCreatorPayments.fulfilled, (state, action) => {
        state.getCreatorPayments.isLoading = false;
        state.getCreatorPayments.isSuccess = true;
        state.getCreatorPayments.data = action.payload.data;
      })
      .addCase(getCreatorPayments.rejected, (state, action) => {
        state.getCreatorPayments.isLoading = false;
        state.getCreatorPayments.isError = true;
        state.getCreatorPayments.message =
          action.payload?.message || "Failed to get creator payments";
        state.getCreatorPayments.data = null;
      });
  },
});

export const {
  resetGetPaymentMethods,
  resetCreateSetupIntent,
  resetAttachPaymentMethod,
  resetRemovePaymentMethod,
  resetFundCollaboration,
} = collaborationPaymentSlice.actions;

export default collaborationPaymentSlice.reducer;
