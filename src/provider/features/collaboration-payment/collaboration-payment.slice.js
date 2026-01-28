import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import collaborationPaymentService from "./collaboration-payment.service";

// Helper function to extract serializable error information
const getSerializableError = (error) => {
  if (error?.response?.data?.message) {
    return { message: error.response.data.message };
  }
  if (error?.message) {
    return { message: error.message };
  }
  if (typeof error === "string") {
    return { message: error };
  }
  return { message: "An unexpected error occurred" };
};

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  createCreatorOnboardingLink: generalState,
  getCreatorAccountStatus: generalState,
  checkCreatorPayoutReady: generalState,
  getCreatorPayments: generalState,
  checkConnectStatus: generalState,
};

export const createCreatorOnboardingLink = createAsyncThunk(
  "collaborationPayment/createCreatorOnboardingLink",
  async ({ returnUrl, refreshUrl }, thunkAPI) => {
    try {
      const response = await collaborationPaymentService.createCreatorOnboardingLink(
        returnUrl,
        refreshUrl
      );
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const getCreatorAccountStatus = createAsyncThunk(
  "collaborationPayment/getCreatorAccountStatus",
  async (_, thunkAPI) => {
    try {
      const response = await collaborationPaymentService.getCreatorAccountStatus();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const checkCreatorPayoutReady = createAsyncThunk(
  "collaborationPayment/checkCreatorPayoutReady",
  async (_, thunkAPI) => {
    try {
      const response = await collaborationPaymentService.checkCreatorPayoutReady();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const getCreatorPayments = createAsyncThunk(
  "collaborationPayment/getCreatorPayments",
  async (_, thunkAPI) => {
    try {
      const response = await collaborationPaymentService.getCreatorPayments();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const checkConnectStatus = createAsyncThunk(
  "collaborationPayment/checkConnectStatus",
  async (_, thunkAPI) => {
    try {
      const response = await collaborationPaymentService.checkConnectStatus();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

const collaborationPaymentSlice = createSlice({
  name: "collaborationPayment",
  initialState,
  reducers: {
    resetState: (state, action) => {
      const key = action.payload;
      if (key && state[key]) {
        state[key] = { ...generalState };
      } else {
        Object.keys(state).forEach((k) => {
          state[k] = { ...generalState };
        });
      }
    },
  },
  extraReducers: (builder) => {
    // Create Creator Onboarding Link
    builder
      .addCase(createCreatorOnboardingLink.pending, (state) => {
        state.createCreatorOnboardingLink.isLoading = true;
        state.createCreatorOnboardingLink.isSuccess = false;
        state.createCreatorOnboardingLink.isError = false;
        state.createCreatorOnboardingLink.message = "";
      })
      .addCase(createCreatorOnboardingLink.fulfilled, (state, action) => {
        state.createCreatorOnboardingLink.isLoading = false;
        state.createCreatorOnboardingLink.isSuccess = true;
        state.createCreatorOnboardingLink.isError = false;
        state.createCreatorOnboardingLink.data = action.payload.data;
        state.createCreatorOnboardingLink.message = action.payload.message || "";
      })
      .addCase(createCreatorOnboardingLink.rejected, (state, action) => {
        state.createCreatorOnboardingLink.isLoading = false;
        state.createCreatorOnboardingLink.isSuccess = false;
        state.createCreatorOnboardingLink.isError = true;
        state.createCreatorOnboardingLink.message =
          action.payload?.message || "Failed to create onboarding link";
      });

    // Get Creator Account Status
    builder
      .addCase(getCreatorAccountStatus.pending, (state) => {
        state.getCreatorAccountStatus.isLoading = true;
        state.getCreatorAccountStatus.isSuccess = false;
        state.getCreatorAccountStatus.isError = false;
        state.getCreatorAccountStatus.message = "";
      })
      .addCase(getCreatorAccountStatus.fulfilled, (state, action) => {
        state.getCreatorAccountStatus.isLoading = false;
        state.getCreatorAccountStatus.isSuccess = true;
        state.getCreatorAccountStatus.isError = false;
        state.getCreatorAccountStatus.data = action.payload.data;
        state.getCreatorAccountStatus.message = action.payload.message || "";
      })
      .addCase(getCreatorAccountStatus.rejected, (state, action) => {
        state.getCreatorAccountStatus.isLoading = false;
        state.getCreatorAccountStatus.isSuccess = false;
        state.getCreatorAccountStatus.isError = true;
        state.getCreatorAccountStatus.message =
          action.payload?.message || "Failed to get account status";
      });

    // Check Creator Payout Ready
    builder
      .addCase(checkCreatorPayoutReady.pending, (state) => {
        state.checkCreatorPayoutReady.isLoading = true;
        state.checkCreatorPayoutReady.isSuccess = false;
        state.checkCreatorPayoutReady.isError = false;
        state.checkCreatorPayoutReady.message = "";
      })
      .addCase(checkCreatorPayoutReady.fulfilled, (state, action) => {
        state.checkCreatorPayoutReady.isLoading = false;
        state.checkCreatorPayoutReady.isSuccess = true;
        state.checkCreatorPayoutReady.isError = false;
        state.checkCreatorPayoutReady.data = action.payload.data;
        state.checkCreatorPayoutReady.message = action.payload.message || "";
      })
      .addCase(checkCreatorPayoutReady.rejected, (state, action) => {
        state.checkCreatorPayoutReady.isLoading = false;
        state.checkCreatorPayoutReady.isSuccess = false;
        state.checkCreatorPayoutReady.isError = true;
        state.checkCreatorPayoutReady.message =
          action.payload?.message || "Failed to check payout readiness";
      });

    // Get Creator Payments
    builder
      .addCase(getCreatorPayments.pending, (state) => {
        state.getCreatorPayments.isLoading = true;
        state.getCreatorPayments.isSuccess = false;
        state.getCreatorPayments.isError = false;
        state.getCreatorPayments.message = "";
      })
      .addCase(getCreatorPayments.fulfilled, (state, action) => {
        state.getCreatorPayments.isLoading = false;
        state.getCreatorPayments.isSuccess = true;
        state.getCreatorPayments.isError = false;
        state.getCreatorPayments.data = action.payload.data;
        state.getCreatorPayments.message = action.payload.message || "";
      })
      .addCase(getCreatorPayments.rejected, (state, action) => {
        state.getCreatorPayments.isLoading = false;
        state.getCreatorPayments.isSuccess = false;
        state.getCreatorPayments.isError = true;
        state.getCreatorPayments.message =
          action.payload?.message || "Failed to get creator payments";
      });

    // Check Connect Status
    builder
      .addCase(checkConnectStatus.pending, (state) => {
        state.checkConnectStatus.isLoading = true;
        state.checkConnectStatus.isSuccess = false;
        state.checkConnectStatus.isError = false;
        state.checkConnectStatus.message = "";
      })
      .addCase(checkConnectStatus.fulfilled, (state, action) => {
        state.checkConnectStatus.isLoading = false;
        state.checkConnectStatus.isSuccess = true;
        state.checkConnectStatus.isError = false;
        state.checkConnectStatus.data = action.payload.data;
        state.checkConnectStatus.message = action.payload.message || "";
      })
      .addCase(checkConnectStatus.rejected, (state, action) => {
        state.checkConnectStatus.isLoading = false;
        state.checkConnectStatus.isSuccess = false;
        state.checkConnectStatus.isError = true;
        state.checkConnectStatus.message =
          action.payload?.message || "Failed to check Connect status";
      });
  },
});

export const { resetState } = collaborationPaymentSlice.actions;
export default collaborationPaymentSlice.reducer;
