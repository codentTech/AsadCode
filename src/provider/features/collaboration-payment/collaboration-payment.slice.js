import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import collaborationPaymentService from "./collaboration-payment.service";

const getSerializableError = (
  error,
  defaultMessage = "An unexpected error occurred"
) => {
  if (error?.response?.data) return error.response.data;
  if (typeof error === "string") return { message: error };
  if (error?.message) return { message: error.message };
  return { message: defaultMessage };
};

const makeRequestState = () => ({
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
});

const initialState = {
  // Brand payment methods
  getPaymentMethods: makeRequestState(),
  hasPaymentMethod: makeRequestState(),
  createSetupIntent: makeRequestState(),
  attachPaymentMethod: makeRequestState(),
  removePaymentMethod: makeRequestState(),

  // Escrow funding
  fundCollaboration: makeRequestState(),
  retryFunding: makeRequestState(),
  getPaymentByCollaboration: makeRequestState(),

  // Payment history
  getBrandPayments: makeRequestState(),
  getCreatorPayments: makeRequestState(),

  // Creator Stripe Connect (payout method)
  createCreatorOnboardingLink: makeRequestState(),
  getCreatorAccountStatus: makeRequestState(),
  checkCreatorPayoutReady: makeRequestState(),

  // Platform Connect availability
  checkConnectStatus: makeRequestState(),

  // Admin payment monitoring
  getAdminPayments: makeRequestState(),
  getAdminPaymentById: makeRequestState(),
};

// Brand: payment methods
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

export const attachPaymentMethod = createAsyncThunk(
  "collaborationPayment/attachPaymentMethod",
  async (paymentMethodId, thunkAPI) => {
    try {
      const response =
        await collaborationPaymentService.attachPaymentMethod(paymentMethodId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to attach payment method")
      );
    }
  }
);

export const removePaymentMethod = createAsyncThunk(
  "collaborationPayment/removePaymentMethod",
  async (paymentMethodId, thunkAPI) => {
    try {
      const response =
        await collaborationPaymentService.removePaymentMethod(paymentMethodId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to remove payment method")
      );
    }
  }
);

// Brand: escrow / funding
export const fundCollaboration = createAsyncThunk(
  "collaborationPayment/fundCollaboration",
  async (collaborationId, thunkAPI) => {
    try {
      const response =
        await collaborationPaymentService.fundCollaboration(collaborationId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to fund collaboration")
      );
    }
  }
);

export const retryFunding = createAsyncThunk(
  "collaborationPayment/retryFunding",
  async ({ collaborationId, paymentMethodId }, thunkAPI) => {
    try {
      const response = await collaborationPaymentService.retryFunding({
        collaborationId,
        paymentMethodId,
      });
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to retry funding")
      );
    }
  }
);

export const getPaymentByCollaboration = createAsyncThunk(
  "collaborationPayment/getPaymentByCollaboration",
  async (collaborationId, thunkAPI) => {
    try {
      const response =
        await collaborationPaymentService.getPaymentByCollaboration(
          collaborationId
        );
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to get payment details")
      );
    }
  }
);

// Payment history
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

// Creator Stripe Connect (payout method)
export const createCreatorOnboardingLink = createAsyncThunk(
  "collaborationPayment/createCreatorOnboardingLink",
  async ({ returnUrl, refreshUrl }, thunkAPI) => {
    try {
      const response =
        await collaborationPaymentService.createCreatorOnboardingLink({
          returnUrl,
          refreshUrl,
        });
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to create onboarding link")
      );
    }
  }
);

export const getCreatorAccountStatus = createAsyncThunk(
  "collaborationPayment/getCreatorAccountStatus",
  async (_, thunkAPI) => {
    try {
      const response =
        await collaborationPaymentService.getCreatorAccountStatus();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to get account status")
      );
    }
  }
);

export const checkCreatorPayoutReady = createAsyncThunk(
  "collaborationPayment/checkCreatorPayoutReady",
  async (_, thunkAPI) => {
    try {
      const response =
        await collaborationPaymentService.checkCreatorPayoutReady();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to check payout readiness")
      );
    }
  }
);

// Platform: Connect enabled?
export const checkConnectStatus = createAsyncThunk(
  "collaborationPayment/checkConnectStatus",
  async (_, thunkAPI) => {
    try {
      const response = await collaborationPaymentService.checkConnectStatus();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to check Connect status")
      );
    }
  }
);

// Admin: list payments
export const getAdminPayments = createAsyncThunk(
  "collaborationPayment/getAdminPayments",
  async (params, thunkAPI) => {
    try {
      const response = await collaborationPaymentService.getAdminPayments(
        params || {}
      );
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to get admin payments")
      );
    }
  }
);

// Admin: single payment detail
export const getAdminPaymentById = createAsyncThunk(
  "collaborationPayment/getAdminPaymentById",
  async (id, thunkAPI) => {
    try {
      const response = await collaborationPaymentService.getAdminPaymentById(
        id
      );
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to get payment details")
      );
    }
  }
);

const setPending = (state) => {
  state.isLoading = true;
  state.isSuccess = false;
  state.isError = false;
  state.message = "";
};

const setFulfilled = (state, action, { setData = true } = {}) => {
  state.isLoading = false;
  state.isSuccess = true;
  state.isError = false;
  state.message = action.payload?.message || "";
  if (setData) state.data = action.payload?.data ?? null;
};

const setRejected = (state, action, defaultMessage) => {
  state.isLoading = false;
  state.isSuccess = false;
  state.isError = true;
  state.message = action.payload?.message || defaultMessage;
  state.data = null;
};

const collaborationPaymentSlice = createSlice({
  name: "collaborationPayment",
  initialState,
  reducers: {
    resetGetPaymentMethods: (state) => {
      state.getPaymentMethods = makeRequestState();
    },
    resetHasPaymentMethod: (state) => {
      state.hasPaymentMethod = makeRequestState();
    },
    resetCreateSetupIntent: (state) => {
      state.createSetupIntent = makeRequestState();
    },
    resetAttachPaymentMethod: (state) => {
      state.attachPaymentMethod = makeRequestState();
    },
    resetRemovePaymentMethod: (state) => {
      state.removePaymentMethod = makeRequestState();
    },
    resetFundCollaboration: (state) => {
      state.fundCollaboration = makeRequestState();
    },
    resetRetryFunding: (state) => {
      state.retryFunding = makeRequestState();
    },
    resetGetPaymentByCollaboration: (state) => {
      state.getPaymentByCollaboration = makeRequestState();
    },
    resetGetBrandPayments: (state) => {
      state.getBrandPayments = makeRequestState();
    },
    resetGetCreatorPayments: (state) => {
      state.getCreatorPayments = makeRequestState();
    },
    resetCreateCreatorOnboardingLink: (state) => {
      state.createCreatorOnboardingLink = makeRequestState();
    },
    resetGetCreatorAccountStatus: (state) => {
      state.getCreatorAccountStatus = makeRequestState();
    },
    resetCheckCreatorPayoutReady: (state) => {
      state.checkCreatorPayoutReady = makeRequestState();
    },
    resetCheckConnectStatus: (state) => {
      state.checkConnectStatus = makeRequestState();
    },
    resetGetAdminPayments: (state) => {
      state.getAdminPayments = makeRequestState();
    },
    resetGetAdminPaymentById: (state) => {
      state.getAdminPaymentById = makeRequestState();
    },
  },
  extraReducers: (builder) => {
    // Payment methods
    builder
      .addCase(getPaymentMethods.pending, (state) => setPending(state.getPaymentMethods))
      .addCase(getPaymentMethods.fulfilled, (state, action) =>
        setFulfilled(state.getPaymentMethods, action)
      )
      .addCase(getPaymentMethods.rejected, (state, action) =>
        setRejected(state.getPaymentMethods, action, "Failed to get payment methods")
      );

    builder
      .addCase(checkHasPaymentMethod.pending, (state) => setPending(state.hasPaymentMethod))
      .addCase(checkHasPaymentMethod.fulfilled, (state, action) =>
        setFulfilled(state.hasPaymentMethod, action)
      )
      .addCase(checkHasPaymentMethod.rejected, (state, action) =>
        setRejected(state.hasPaymentMethod, action, "Failed to check payment method")
      );

    builder
      .addCase(createSetupIntent.pending, (state) => setPending(state.createSetupIntent))
      .addCase(createSetupIntent.fulfilled, (state, action) =>
        setFulfilled(state.createSetupIntent, action)
      )
      .addCase(createSetupIntent.rejected, (state, action) =>
        setRejected(state.createSetupIntent, action, "Failed to create setup intent")
      );

    builder
      .addCase(attachPaymentMethod.pending, (state) => setPending(state.attachPaymentMethod))
      .addCase(attachPaymentMethod.fulfilled, (state, action) =>
        setFulfilled(state.attachPaymentMethod, action, { setData: false })
      )
      .addCase(attachPaymentMethod.rejected, (state, action) => {
        state.attachPaymentMethod.isLoading = false;
        state.attachPaymentMethod.isSuccess = false;
        state.attachPaymentMethod.isError = true;
        state.attachPaymentMethod.message =
          action.payload?.message || "Failed to attach payment method";
      });

    builder
      .addCase(removePaymentMethod.pending, (state) => setPending(state.removePaymentMethod))
      .addCase(removePaymentMethod.fulfilled, (state, action) =>
        setFulfilled(state.removePaymentMethod, action, { setData: false })
      )
      .addCase(removePaymentMethod.rejected, (state, action) =>
        setRejected(state.removePaymentMethod, action, "Failed to remove payment method")
      );

    // Funding / escrow
    builder
      .addCase(fundCollaboration.pending, (state) => setPending(state.fundCollaboration))
      .addCase(fundCollaboration.fulfilled, (state, action) =>
        setFulfilled(state.fundCollaboration, action)
      )
      .addCase(fundCollaboration.rejected, (state, action) =>
        setRejected(state.fundCollaboration, action, "Failed to fund collaboration")
      );

    builder
      .addCase(retryFunding.pending, (state) => setPending(state.retryFunding))
      .addCase(retryFunding.fulfilled, (state, action) =>
        setFulfilled(state.retryFunding, action)
      )
      .addCase(retryFunding.rejected, (state, action) =>
        setRejected(state.retryFunding, action, "Failed to retry funding")
      );

    builder
      .addCase(getPaymentByCollaboration.pending, (state) =>
        setPending(state.getPaymentByCollaboration)
      )
      .addCase(getPaymentByCollaboration.fulfilled, (state, action) =>
        setFulfilled(state.getPaymentByCollaboration, action)
      )
      .addCase(getPaymentByCollaboration.rejected, (state, action) =>
        setRejected(state.getPaymentByCollaboration, action, "Failed to get payment details")
      );

    // Payment history
    builder
      .addCase(getBrandPayments.pending, (state) => setPending(state.getBrandPayments))
      .addCase(getBrandPayments.fulfilled, (state, action) =>
        setFulfilled(state.getBrandPayments, action)
      )
      .addCase(getBrandPayments.rejected, (state, action) =>
        setRejected(state.getBrandPayments, action, "Failed to get brand payments")
      );

    builder
      .addCase(getCreatorPayments.pending, (state) => setPending(state.getCreatorPayments))
      .addCase(getCreatorPayments.fulfilled, (state, action) =>
        setFulfilled(state.getCreatorPayments, action)
      )
      .addCase(getCreatorPayments.rejected, (state, action) =>
        setRejected(state.getCreatorPayments, action, "Failed to get creator payments")
      );

    // Creator Connect
    builder
      .addCase(createCreatorOnboardingLink.pending, (state) =>
        setPending(state.createCreatorOnboardingLink)
      )
      .addCase(createCreatorOnboardingLink.fulfilled, (state, action) =>
        setFulfilled(state.createCreatorOnboardingLink, action)
      )
      .addCase(createCreatorOnboardingLink.rejected, (state, action) =>
        setRejected(state.createCreatorOnboardingLink, action, "Failed to create onboarding link")
      );

    builder
      .addCase(getCreatorAccountStatus.pending, (state) =>
        setPending(state.getCreatorAccountStatus)
      )
      .addCase(getCreatorAccountStatus.fulfilled, (state, action) =>
        setFulfilled(state.getCreatorAccountStatus, action)
      )
      .addCase(getCreatorAccountStatus.rejected, (state, action) =>
        setRejected(state.getCreatorAccountStatus, action, "Failed to get account status")
      );

    builder
      .addCase(checkCreatorPayoutReady.pending, (state) =>
        setPending(state.checkCreatorPayoutReady)
      )
      .addCase(checkCreatorPayoutReady.fulfilled, (state, action) =>
        setFulfilled(state.checkCreatorPayoutReady, action)
      )
      .addCase(checkCreatorPayoutReady.rejected, (state, action) =>
        setRejected(state.checkCreatorPayoutReady, action, "Failed to check payout readiness")
      );

    // Connect status
    builder
      .addCase(checkConnectStatus.pending, (state) => setPending(state.checkConnectStatus))
      .addCase(checkConnectStatus.fulfilled, (state, action) =>
        setFulfilled(state.checkConnectStatus, action)
      )
      .addCase(checkConnectStatus.rejected, (state, action) =>
        setRejected(state.checkConnectStatus, action, "Failed to check Connect status")
      );

    // Admin
    builder
      .addCase(getAdminPayments.pending, (state) => setPending(state.getAdminPayments))
      .addCase(getAdminPayments.fulfilled, (state, action) =>
        setFulfilled(state.getAdminPayments, action)
      )
      .addCase(getAdminPayments.rejected, (state, action) =>
        setRejected(state.getAdminPayments, action, "Failed to get admin payments")
      );

    builder
      .addCase(getAdminPaymentById.pending, (state) =>
        setPending(state.getAdminPaymentById)
      )
      .addCase(getAdminPaymentById.fulfilled, (state, action) =>
        setFulfilled(state.getAdminPaymentById, action)
      )
      .addCase(getAdminPaymentById.rejected, (state, action) =>
        setRejected(state.getAdminPaymentById, action, "Failed to get payment details")
      );
  },
});

export const {
  resetGetPaymentMethods,
  resetHasPaymentMethod,
  resetCreateSetupIntent,
  resetAttachPaymentMethod,
  resetRemovePaymentMethod,
  resetFundCollaboration,
  resetRetryFunding,
  resetGetPaymentByCollaboration,
  resetGetBrandPayments,
  resetGetCreatorPayments,
  resetCreateCreatorOnboardingLink,
  resetGetCreatorAccountStatus,
  resetCheckCreatorPayoutReady,
  resetCheckConnectStatus,
  resetGetAdminPayments,
  resetGetAdminPaymentById,
} = collaborationPaymentSlice.actions;

export default collaborationPaymentSlice.reducer;
