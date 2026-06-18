import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import contractsService from "./contracts.service";

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

const individualCollaborationContractsState = {
  ...generalState,
  isCompleted: null,
};

function resolveIndividualContractsArg(arg) {
  if (typeof arg === "object" && arg !== null && !Array.isArray(arg)) {
    return {
      isCompleted: Boolean(arg.isCompleted),
      silent: Boolean(arg.silent),
    };
  }
  return { isCompleted: Boolean(arg), silent: false };
}

const initialState = {
  getContractById: generalState,
  getContractsByCampaign: generalState,
  getPendingContractsForCreator: generalState,
  getIndividualCollaborationContracts: { ...individualCollaborationContractsState },
  createContract: generalState,
  sendContract: generalState,
  signContract: generalState,
  declineContract: generalState,
};

export const getContractById = createAsyncThunk(
  "contracts/getById",
  async (contractId, thunkAPI) => {
    try {
      const response = await contractsService.getContractById(contractId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const getContractsByCampaign = createAsyncThunk(
  "contracts/getByCampaign",
  async (campaignId, thunkAPI) => {
    try {
      const response = await contractsService.getContractsByCampaign(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const getPendingContractsForCreator = createAsyncThunk(
  "contracts/getPendingForCreator",
  async (_, thunkAPI) => {
    try {
      const response = await contractsService.getPendingContractsForCreator();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const getIndividualCollaborationContracts = createAsyncThunk(
  "contracts/getIndividualCollaborations",
  async (arg, thunkAPI) => {
    const { isCompleted } = resolveIndividualContractsArg(arg);
    try {
      const response = await contractsService.getIndividualCollaborationContracts(isCompleted);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const createContract = createAsyncThunk(
  "contracts/create",
  async (contractData, thunkAPI) => {
    try {
      const response = await contractsService.createContract(contractData);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const sendContract = createAsyncThunk("contracts/send", async (contractId, thunkAPI) => {
  try {
    const response = await contractsService.sendContract(contractId);
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(getSerializableError(error));
  }
});

export const signContract = createAsyncThunk(
  "contracts/sign",
  async ({ contractId, signatureData }, thunkAPI) => {
    try {
      const response = await contractsService.signContract(contractId, signatureData);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const declineContract = createAsyncThunk(
  "contracts/decline",
  async (contractId, thunkAPI) => {
    try {
      const response = await contractsService.declineContract(contractId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const contractsSlice = createSlice({
  name: "contracts",
  initialState,
  reducers: {
    reset: (state) => {
      return {
        ...initialState,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Contract By ID
      .addCase(getContractById.pending, (state) => {
        state.getContractById.isLoading = true;
        state.getContractById.isError = false;
        state.getContractById.isSuccess = false;
        state.getContractById.message = "";
        state.getContractById.data = null;
      })
      .addCase(getContractById.fulfilled, (state, action) => {
        state.getContractById.isLoading = false;
        state.getContractById.isSuccess = true;
        state.getContractById.data = action.payload.data;
      })
      .addCase(getContractById.rejected, (state, action) => {
        state.getContractById.isLoading = false;
        state.getContractById.isError = true;
        state.getContractById.message = action.payload?.message || "Failed to fetch contract";
        state.getContractById.data = null;
      })
      // Get Contracts By Campaign
      .addCase(getContractsByCampaign.pending, (state) => {
        state.getContractsByCampaign.isLoading = true;
        state.getContractsByCampaign.isError = false;
        state.getContractsByCampaign.isSuccess = false;
        state.getContractsByCampaign.message = "";
        state.getContractsByCampaign.data = null;
      })
      .addCase(getContractsByCampaign.fulfilled, (state, action) => {
        state.getContractsByCampaign.isLoading = false;
        state.getContractsByCampaign.isSuccess = true;
        state.getContractsByCampaign.data = action.payload.data;
      })
      .addCase(getContractsByCampaign.rejected, (state, action) => {
        state.getContractsByCampaign.isLoading = false;
        state.getContractsByCampaign.isError = true;
        state.getContractsByCampaign.message =
          action.payload?.message || "Failed to fetch contracts";
        state.getContractsByCampaign.data = null;
      })
      // Get Pending Contracts For Creator
      .addCase(getPendingContractsForCreator.pending, (state) => {
        state.getPendingContractsForCreator.isLoading = true;
        state.getPendingContractsForCreator.isError = false;
        state.getPendingContractsForCreator.isSuccess = false;
        state.getPendingContractsForCreator.message = "";
        state.getPendingContractsForCreator.data = null;
      })
      .addCase(getPendingContractsForCreator.fulfilled, (state, action) => {
        state.getPendingContractsForCreator.isLoading = false;
        state.getPendingContractsForCreator.isSuccess = true;
        state.getPendingContractsForCreator.data = action.payload.data;
      })
      .addCase(getPendingContractsForCreator.rejected, (state, action) => {
        state.getPendingContractsForCreator.isLoading = false;
        state.getPendingContractsForCreator.isError = true;
        state.getPendingContractsForCreator.message =
          action.payload?.message || "Failed to fetch pending contracts";
        state.getPendingContractsForCreator.data = null;
      })
      // Get Individual Collaboration Contracts
      .addCase(getIndividualCollaborationContracts.pending, (state, action) => {
        if (resolveIndividualContractsArg(action.meta.arg).silent) return;
        const { isCompleted } = resolveIndividualContractsArg(action.meta.arg);
        if (!state.getIndividualCollaborationContracts) {
          state.getIndividualCollaborationContracts = { ...individualCollaborationContractsState };
        }
        const scopeChanged =
          state.getIndividualCollaborationContracts.isCompleted !== null &&
          state.getIndividualCollaborationContracts.isCompleted !== isCompleted;
        state.getIndividualCollaborationContracts.isLoading = true;
        state.getIndividualCollaborationContracts.isError = false;
        state.getIndividualCollaborationContracts.isSuccess = false;
        state.getIndividualCollaborationContracts.message = "";
        state.getIndividualCollaborationContracts.isCompleted = null;
        if (scopeChanged) {
          state.getIndividualCollaborationContracts.data = null;
        }
      })
      .addCase(getIndividualCollaborationContracts.fulfilled, (state, action) => {
        const { isCompleted } = resolveIndividualContractsArg(action.meta.arg);
        if (!state.getIndividualCollaborationContracts) {
          state.getIndividualCollaborationContracts = { ...individualCollaborationContractsState };
        }
        state.getIndividualCollaborationContracts.isLoading = false;
        state.getIndividualCollaborationContracts.isSuccess = true;
        state.getIndividualCollaborationContracts.data = action.payload.data;
        state.getIndividualCollaborationContracts.isCompleted = isCompleted;
      })
      .addCase(getIndividualCollaborationContracts.rejected, (state, action) => {
        if (resolveIndividualContractsArg(action.meta.arg).silent) return;
        if (!state.getIndividualCollaborationContracts) {
          state.getIndividualCollaborationContracts = { ...individualCollaborationContractsState };
        }
        state.getIndividualCollaborationContracts.isLoading = false;
        state.getIndividualCollaborationContracts.isError = true;
        state.getIndividualCollaborationContracts.message =
          action.payload?.message || "Failed to fetch individual collaboration contracts";
        state.getIndividualCollaborationContracts.data = null;
        state.getIndividualCollaborationContracts.isCompleted = null;
      })
      // Create Contract
      .addCase(createContract.pending, (state) => {
        state.createContract.isLoading = true;
        state.createContract.isError = false;
        state.createContract.isSuccess = false;
        state.createContract.message = "";
        state.createContract.data = null;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.createContract.isLoading = false;
        state.createContract.isSuccess = true;
        state.createContract.data = action.payload.data;
      })
      .addCase(createContract.rejected, (state, action) => {
        state.createContract.isLoading = false;
        state.createContract.isError = true;
        state.createContract.message = action.payload?.message || "Failed to create contract";
        state.createContract.data = null;
      })
      // Send Contract
      .addCase(sendContract.pending, (state) => {
        state.sendContract.isLoading = true;
        state.sendContract.isError = false;
        state.sendContract.isSuccess = false;
        state.sendContract.message = "";
        state.sendContract.data = null;
      })
      .addCase(sendContract.fulfilled, (state, action) => {
        state.sendContract.isLoading = false;
        state.sendContract.isSuccess = true;
        state.sendContract.data = action.payload.data;
      })
      .addCase(sendContract.rejected, (state, action) => {
        state.sendContract.isLoading = false;
        state.sendContract.isError = true;
        state.sendContract.message = action.payload?.message || "Failed to send contract";
        state.sendContract.data = null;
      })
      // Sign Contract
      .addCase(signContract.pending, (state) => {
        state.signContract.isLoading = true;
        state.signContract.isError = false;
        state.signContract.isSuccess = false;
        state.signContract.message = "";
        state.signContract.data = null;
      })
      .addCase(signContract.fulfilled, (state, action) => {
        state.signContract.isLoading = false;
        state.signContract.isSuccess = true;
        state.signContract.data = action.payload.data;
      })
      .addCase(signContract.rejected, (state, action) => {
        state.signContract.isLoading = false;
        state.signContract.isError = true;
        state.signContract.message = action.payload?.message || "Failed to sign contract";
        state.signContract.data = null;
      })
      // Decline Contract
      .addCase(declineContract.pending, (state) => {
        state.declineContract.isLoading = true;
        state.declineContract.isError = false;
        state.declineContract.isSuccess = false;
        state.declineContract.message = "";
        state.declineContract.data = null;
      })
      .addCase(declineContract.fulfilled, (state, action) => {
        state.declineContract.isLoading = false;
        state.declineContract.isSuccess = true;
        state.declineContract.data = action.payload.data;
      })
      .addCase(declineContract.rejected, (state, action) => {
        state.declineContract.isLoading = false;
        state.declineContract.isError = true;
        state.declineContract.message = action.payload?.message || "Failed to decline contract";
        state.declineContract.data = null;
      });
  },
});

export const { reset } = contractsSlice.actions;
export default contractsSlice.reducer;
