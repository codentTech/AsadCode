import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import campaignsService from "./campaigns.service";

// Helper function to extract serializable error information
const getSerializableError = (error, defaultMessage) => {
  const errorMessage = error.response?.data?.message || error.message || defaultMessage;
  return { message: errorMessage };
};

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  createCampaign: { ...generalState },
  getAllCampaigns: { ...generalState },
  getCampaignById: { ...generalState },
  updateCampaign: { ...generalState },
  deleteCampaign: { ...generalState },
  publishCampaign: { ...generalState },
  filterCampaigns: { ...generalState },
  getCampaignStats: { ...generalState },
  applyToCampaign: { ...generalState },
  withdrawApplication: { ...generalState },
  getAllBrandCampaigns: { ...generalState },
  getAppliedCreators: { ...generalState },
  getAppliedCreatorsForBudget: { ...generalState }, // No status filter; used for budget calculation on completed tab
  getHiredCreators: { ...generalState }, // Separate state for active-completed tab
  getRejectedCreators: { ...generalState },
  getCreatorApplications: { ...generalState },
  rejectCreator: { ...generalState },
  reinstateCreator: { ...generalState },
  createContract: { ...generalState },
  sendContract: { ...generalState },
  hireCreator: { ...generalState },
  markCreatorComplete: { ...generalState },
  markCampaignComplete: { ...generalState },
  getCreatorCollaborationHistory: { ...generalState },
};

// Create campaign
export const createCampaign = createAsyncThunk(
  "campaigns/createCampaign",
  async (payload, thunkAPI) => {
    try {
      const response = await campaignsService.createCampaign(payload);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to create campaign"));
    }
  }
);

// Get all campaigns
export const getAllCampaigns = createAsyncThunk(
  "campaigns/getAllCampaigns",
  async (payload, thunkAPI) => {
    try {
      const response = await campaignsService.getAllCampaigns(payload);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to fetch campaigns"));
    }
  }
);

// Get campaign by ID
export const getCampaignById = createAsyncThunk(
  "campaigns/getCampaignById",
  async (campaignId, thunkAPI) => {
    try {
      const response = await campaignsService.getCampaignById(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to get campaign"));
    }
  }
);

// Update campaign
export const updateCampaign = createAsyncThunk(
  "campaigns/updateCampaign",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await campaignsService.updateCampaign(id, data);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to create campaign"));
    }
  }
);

// Delete campaign
export const deleteCampaign = createAsyncThunk(
  "campaigns/deleteCampaign",
  async (campaignId, thunkAPI) => {
    try {
      const response = await campaignsService.deleteCampaign(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to create campaign"));
    }
  }
);

// Publish campaign
export const publishCampaign = createAsyncThunk(
  "campaigns/publishCampaign",
  async (campaignId, thunkAPI) => {
    try {
      const response = await campaignsService.publishCampaign(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to create campaign"));
    }
  }
);

// Filter campaigns
export const filterCampaigns = createAsyncThunk(
  "campaigns/filterCampaigns",
  async (filters, thunkAPI) => {
    try {
      const response = await campaignsService.filterCampaigns(filters);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to create campaign"));
    }
  }
);

// Get campaign stats
export const getCampaignStats = createAsyncThunk(
  "campaigns/getCampaignStats",
  async (_, thunkAPI) => {
    try {
      const response = await campaignsService.getCampaignStats();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to create campaign"));
    }
  }
);

// Apply to campaign
export const applyToCampaign = createAsyncThunk(
  "campaigns/applyToCampaign",
  async ({ campaignId, pitch }, thunkAPI) => {
    try {
      const response = await campaignsService.applyToCampaign(campaignId, pitch);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to create campaign"));
    }
  }
);

// Withdraw application from campaign
export const withdrawApplication = createAsyncThunk(
  "campaigns/withdrawApplication",
  async (campaignId, thunkAPI) => {
    try {
      const response = await campaignsService.withdrawApplication(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to create campaign"));
    }
  }
);

// Get applied creators for a campaign
export const getAppliedCreators = createAsyncThunk(
  "campaigns/getAppliedCreators",
  async ({ campaignId, filters = {} }, thunkAPI) => {
    try {
      const response = await campaignsService.getAppliedCreators(campaignId, filters);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to get applied creators")
      );
    }
  }
);

// Get applied creators with no status filter (for budget calculation on completed tab only)
export const getAppliedCreatorsForBudget = createAsyncThunk(
  "campaigns/getAppliedCreatorsForBudget",
  async (campaignId, thunkAPI) => {
    try {
      const response = await campaignsService.getAppliedCreators(campaignId, {});
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to get creators for budget")
      );
    }
  }
);

// Get hired creators for a campaign (separate from applied creators)
export const getHiredCreators = createAsyncThunk(
  "campaigns/getHiredCreators",
  async ({ campaignId, filters = {} }, thunkAPI) => {
    try {
      const response = await campaignsService.getAppliedCreators(campaignId, filters);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to get hired creators"));
    }
  }
);

// Get all brand campaigns (unified endpoint for Applications, Active, and Completed tabs)
export const getAllBrandCampaigns = createAsyncThunk(
  "campaigns/getAllBrandCampaigns",
  async (_, thunkAPI) => {
    try {
      const response = await campaignsService.getAllBrandCampaigns();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to fetch brand campaigns")
      );
    }
  }
);

// Get rejected creators
export const getRejectedCreators = createAsyncThunk(
  "campaigns/getRejectedCreators",
  async ({ campaignId, filters = {} }, thunkAPI) => {
    try {
      const response = await campaignsService.getAppliedCreators(campaignId, filters);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to create campaign"));
    }
  }
);

// Get creator applications
export const getCreatorApplications = createAsyncThunk(
  "campaigns/getCreatorApplications",
  async (status, thunkAPI) => {
    try {
      const response = await campaignsService.getCreatorApplications(status);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to create campaign"));
    }
  }
);

// Reject creator application
export const rejectCreator = createAsyncThunk(
  "campaigns/rejectCreator",
  async ({ campaignId, creatorId }, thunkAPI) => {
    try {
      const response = await campaignsService.rejectCreator(campaignId, creatorId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to create campaign"));
    }
  }
);

// Reinstate creator application
export const reinstateCreator = createAsyncThunk(
  "campaigns/reinstateCreator",
  async ({ campaignId, creatorId }, thunkAPI) => {
    try {
      const response = await campaignsService.reinstateCreator(campaignId, creatorId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to create campaign"));
    }
  }
);

// Create contract
export const createContract = createAsyncThunk(
  "campaigns/createContract",
  async (contractData, thunkAPI) => {
    try {
      const response = await campaignsService.createContract(contractData);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to create campaign"));
    }
  }
);

// Send contract
export const sendContract = createAsyncThunk(
  "campaigns/sendContract",
  async (contractId, thunkAPI) => {
    try {
      const response = await campaignsService.sendContract(contractId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to create campaign"));
    }
  }
);

// Hire creator (simple hire without contract)
export const hireCreator = createAsyncThunk(
  "campaigns/hireCreator",
  async ({ campaignId, creatorId }, thunkAPI) => {
    try {
      const response = await campaignsService.hireCreator(campaignId, creatorId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to create campaign"));
    }
  }
);

export const markCreatorComplete = createAsyncThunk(
  "campaigns/markCreatorComplete",
  async ({ campaignId, creatorId }, thunkAPI) => {
    try {
      const response = await campaignsService.markCreatorComplete(campaignId, creatorId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to mark creator complete")
      );
    }
  }
);

export const markCampaignComplete = createAsyncThunk(
  "campaigns/markCampaignComplete",
  async (campaignId, thunkAPI) => {
    try {
      const response = await campaignsService.markCampaignComplete(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to mark campaign complete")
      );
    }
  }
);

export const getCreatorCollaborationHistory = createAsyncThunk(
  "campaigns/getCreatorCollaborationHistory",
  async (creatorProfileId, thunkAPI) => {
    try {
      const response = await campaignsService.getCreatorCollaborationHistory(creatorProfileId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to get creator collaboration history")
      );
    }
  }
);

export const campaignsSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {
    reset: (state) => {
      state.createCampaign = { ...generalState };
      state.getAllCampaigns = { ...generalState };
      state.getCampaignById = { ...generalState };
      state.updateCampaign = { ...generalState };
      state.deleteCampaign = { ...generalState };
      state.publishCampaign = { ...generalState };
      state.filterCampaigns = { ...generalState };
      state.getCampaignStats = { ...generalState };
    },
    resetCreateCampaign: (state) => {
      state.createCampaign = { ...generalState };
    },
    resetUpdateCampaign: (state) => {
      state.updateCampaign = { ...generalState };
    },
    resetFilteredCampaigns: (state) => {
      state.filterCampaigns = { ...generalState };
    },
    resetGetAllCampaigns: (state) => {
      state.getAllCampaigns = { ...generalState };
    },
    resetGetAllBrandCampaigns: (state) => {
      state.getAllBrandCampaigns = { ...generalState };
    },
    resetGetAppliedCreators: (state) => {
      state.getAppliedCreators = { ...generalState };
    },
  },
  extraReducers: (builder) => {
    builder
      // createCampaign
      .addCase(createCampaign.pending, (state) => {
        state.createCampaign.isLoading = true;
        state.createCampaign.message = "";
        state.createCampaign.isError = false;
        state.createCampaign.isSuccess = false;
        state.createCampaign.data = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.createCampaign.isLoading = false;
        state.createCampaign.isSuccess = true;
        state.createCampaign.data = action.payload;
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.createCampaign.message = action.payload?.message || "Failed to create campaign";
        state.createCampaign.isLoading = false;
        state.createCampaign.isError = true;
        state.createCampaign.data = null;
      })
      // getAllCampaigns
      .addCase(getAllCampaigns.pending, (state) => {
        state.getAllCampaigns.isLoading = true;
        state.getAllCampaigns.message = "";
        state.getAllCampaigns.isError = false;
        state.getAllCampaigns.isSuccess = false;
        state.getAllCampaigns.data = null;
      })
      .addCase(getAllCampaigns.fulfilled, (state, action) => {
        state.getAllCampaigns.isLoading = false;
        state.getAllCampaigns.isSuccess = true;
        state.getAllCampaigns.data = action.payload;
      })
      .addCase(getAllCampaigns.rejected, (state, action) => {
        state.getAllCampaigns.message = action.payload?.message || "Failed to fetch campaigns";
        state.getAllCampaigns.isLoading = false;
        state.getAllCampaigns.isError = true;
        state.getAllCampaigns.data = null;
      })
      // getCampaignById
      .addCase(getCampaignById.pending, (state) => {
        state.getCampaignById.isLoading = true;
        state.getCampaignById.message = "";
        state.getCampaignById.isError = false;
        state.getCampaignById.isSuccess = false;
        state.getCampaignById.data = null;
      })
      .addCase(getCampaignById.fulfilled, (state, action) => {
        state.getCampaignById.isLoading = false;
        state.getCampaignById.isSuccess = true;
        state.getCampaignById.data = action.payload;
      })
      .addCase(getCampaignById.rejected, (state, action) => {
        state.getCampaignById.message = action.payload?.message || "Failed to fetch campaign";
        state.getCampaignById.isLoading = false;
        state.getCampaignById.isError = true;
        state.getCampaignById.data = null;
      })
      // updateCampaign
      .addCase(updateCampaign.pending, (state) => {
        state.updateCampaign.isLoading = true;
        state.updateCampaign.message = "";
        state.updateCampaign.isError = false;
        state.updateCampaign.isSuccess = false;
        state.updateCampaign.data = null;
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.updateCampaign.isLoading = false;
        state.updateCampaign.isSuccess = true;
        state.updateCampaign.data = action.payload;
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        state.updateCampaign.message = action.payload?.message || "Failed to update campaign";
        state.updateCampaign.isLoading = false;
        state.updateCampaign.isError = true;
        state.updateCampaign.data = null;
      })
      // deleteCampaign
      .addCase(deleteCampaign.pending, (state) => {
        state.deleteCampaign.isLoading = true;
        state.deleteCampaign.message = "";
        state.deleteCampaign.isError = false;
        state.deleteCampaign.isSuccess = false;
        state.deleteCampaign.data = null;
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.deleteCampaign.isLoading = false;
        state.deleteCampaign.isSuccess = true;
        state.deleteCampaign.data = action.payload;
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.deleteCampaign.message = action.payload?.message || "Failed to delete campaign";
        state.deleteCampaign.isLoading = false;
        state.deleteCampaign.isError = true;
        state.deleteCampaign.data = null;
      })
      // publishCampaign
      .addCase(publishCampaign.pending, (state) => {
        state.publishCampaign.isLoading = true;
        state.publishCampaign.message = "";
        state.publishCampaign.isError = false;
        state.publishCampaign.isSuccess = false;
        state.publishCampaign.data = null;
      })
      .addCase(publishCampaign.fulfilled, (state, action) => {
        state.publishCampaign.isLoading = false;
        state.publishCampaign.isSuccess = true;
        state.publishCampaign.data = action.payload;
      })
      .addCase(publishCampaign.rejected, (state, action) => {
        state.publishCampaign.message = action.payload?.message || "Failed to publish campaign";
        state.publishCampaign.isLoading = false;
        state.publishCampaign.isError = true;
        state.publishCampaign.data = null;
      })
      // filterCampaigns
      .addCase(filterCampaigns.pending, (state) => {
        state.filterCampaigns.isLoading = true;
        state.filterCampaigns.message = "";
        state.filterCampaigns.isError = false;
        state.filterCampaigns.isSuccess = false;
        state.filterCampaigns.data = null;
      })
      .addCase(filterCampaigns.fulfilled, (state, action) => {
        state.filterCampaigns.isLoading = false;
        state.filterCampaigns.isSuccess = true;
        state.filterCampaigns.data = action.payload;
      })
      .addCase(filterCampaigns.rejected, (state, action) => {
        state.filterCampaigns.message = action.payload?.message || "Failed to filter campaigns";
        state.filterCampaigns.isLoading = false;
        state.filterCampaigns.isError = true;
        state.filterCampaigns.data = null;
      })
      // getCampaignStats
      .addCase(getCampaignStats.pending, (state) => {
        state.getCampaignStats.isLoading = true;
        state.getCampaignStats.message = "";
        state.getCampaignStats.isError = false;
        state.getCampaignStats.isSuccess = false;
        state.getCampaignStats.data = null;
      })
      .addCase(getCampaignStats.fulfilled, (state, action) => {
        state.getCampaignStats.isLoading = false;
        state.getCampaignStats.isSuccess = true;
        state.getCampaignStats.data = action.payload;
      })
      .addCase(getCampaignStats.rejected, (state, action) => {
        state.getCampaignStats.message =
          action.payload?.message || "Failed to fetch campaign stats";
        state.getCampaignStats.isLoading = false;
        state.getCampaignStats.isError = true;
        state.getCampaignStats.data = null;
      })
      // applyToCampaign
      .addCase(applyToCampaign.pending, (state) => {
        state.applyToCampaign.isLoading = true;
        state.applyToCampaign.message = "";
        state.applyToCampaign.isError = false;
        state.applyToCampaign.isSuccess = false;
        state.applyToCampaign.data = null;
      })
      .addCase(applyToCampaign.fulfilled, (state, action) => {
        state.applyToCampaign.isLoading = false;
        state.applyToCampaign.isSuccess = true;
        state.applyToCampaign.data = action.payload;
      })
      .addCase(applyToCampaign.rejected, (state, action) => {
        state.applyToCampaign.message = action.payload?.message || "Failed to apply to campaign";
        state.applyToCampaign.isLoading = false;
        state.applyToCampaign.isError = true;
        state.applyToCampaign.data = null;
      })
      // withdrawApplication
      .addCase(withdrawApplication.pending, (state) => {
        state.withdrawApplication.isLoading = true;
        state.withdrawApplication.message = "";
        state.withdrawApplication.isError = false;
        state.withdrawApplication.isSuccess = false;
        state.withdrawApplication.data = null;
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.withdrawApplication.isLoading = false;
        state.withdrawApplication.isSuccess = true;
        state.withdrawApplication.data = action.payload;
      })
      .addCase(withdrawApplication.rejected, (state, action) => {
        state.withdrawApplication.message =
          action.payload?.message || "Failed to withdraw application";
        state.withdrawApplication.isLoading = false;
        state.withdrawApplication.isError = true;
        state.withdrawApplication.data = null;
      })
      // getAllBrandCampaigns
      .addCase(getAllBrandCampaigns.pending, (state) => {
        state.getAllBrandCampaigns.isLoading = true;
        state.getAllBrandCampaigns.message = "";
        state.getAllBrandCampaigns.isError = false;
        const hadData = Boolean(state.getAllBrandCampaigns.data);
        if (!hadData) {
          state.getAllBrandCampaigns.isSuccess = false;
          state.getAllBrandCampaigns.data = null;
        }
      })
      .addCase(getAllBrandCampaigns.fulfilled, (state, action) => {
        state.getAllBrandCampaigns.isLoading = false;
        state.getAllBrandCampaigns.isSuccess = true;
        state.getAllBrandCampaigns.data = action.payload;
      })
      .addCase(getAllBrandCampaigns.rejected, (state, action) => {
        state.getAllBrandCampaigns.message =
          action.payload?.message || "Failed to fetch brand campaigns";
        state.getAllBrandCampaigns.isLoading = false;
        state.getAllBrandCampaigns.isError = true;
        state.getAllBrandCampaigns.data = null;
      })
      // getAppliedCreators
      .addCase(getAppliedCreators.pending, (state) => {
        state.getAppliedCreators.isLoading = true;
        state.getAppliedCreators.message = "";
        state.getAppliedCreators.isError = false;
        state.getAppliedCreators.isSuccess = false;
        state.getAppliedCreators.data = null;
      })
      .addCase(getAppliedCreators.fulfilled, (state, action) => {
        state.getAppliedCreators.isLoading = false;
        state.getAppliedCreators.isSuccess = true;
        state.getAppliedCreators.data = action.payload;
      })
      .addCase(getAppliedCreators.rejected, (state, action) => {
        state.getAppliedCreators.message =
          action.payload?.message || "Failed to fetch applied creators";
        state.getAppliedCreators.isLoading = false;
        state.getAppliedCreators.isError = true;
        state.getAppliedCreators.data = null;
      })
      // getAppliedCreatorsForBudget
      .addCase(getAppliedCreatorsForBudget.pending, (state) => {
        state.getAppliedCreatorsForBudget.isLoading = true;
        state.getAppliedCreatorsForBudget.message = "";
        state.getAppliedCreatorsForBudget.isError = false;
        state.getAppliedCreatorsForBudget.isSuccess = false;
        state.getAppliedCreatorsForBudget.data = null;
      })
      .addCase(getAppliedCreatorsForBudget.fulfilled, (state, action) => {
        state.getAppliedCreatorsForBudget.isLoading = false;
        state.getAppliedCreatorsForBudget.isSuccess = true;
        state.getAppliedCreatorsForBudget.data = action.payload;
      })
      .addCase(getAppliedCreatorsForBudget.rejected, (state, action) => {
        state.getAppliedCreatorsForBudget.message =
          action.payload?.message || "Failed to get creators for budget";
        state.getAppliedCreatorsForBudget.isLoading = false;
        state.getAppliedCreatorsForBudget.isError = true;
        state.getAppliedCreatorsForBudget.data = null;
      })
      // getHiredCreators
      .addCase(getHiredCreators.pending, (state) => {
        state.getHiredCreators.isLoading = true;
        state.getHiredCreators.message = "";
        state.getHiredCreators.isError = false;
        state.getHiredCreators.isSuccess = false;
        state.getHiredCreators.data = null;
      })
      .addCase(getHiredCreators.fulfilled, (state, action) => {
        state.getHiredCreators.isLoading = false;
        state.getHiredCreators.isSuccess = true;
        state.getHiredCreators.data = action.payload;
      })
      .addCase(getHiredCreators.rejected, (state, action) => {
        state.getHiredCreators.message =
          action.payload?.message || "Failed to fetch hired creators";
        state.getHiredCreators.isLoading = false;
        state.getHiredCreators.isError = true;
        state.getHiredCreators.data = null;
      })
      // getRejectedCreators
      .addCase(getRejectedCreators.pending, (state) => {
        state.getRejectedCreators.isLoading = true;
        state.getRejectedCreators.message = "";
        state.getRejectedCreators.isError = false;
        state.getRejectedCreators.isSuccess = false;
        state.getRejectedCreators.data = null;
      })
      .addCase(getRejectedCreators.fulfilled, (state, action) => {
        state.getRejectedCreators.isLoading = false;
        state.getRejectedCreators.isSuccess = true;
        state.getRejectedCreators.data = action.payload;
      })
      .addCase(getRejectedCreators.rejected, (state, action) => {
        state.getRejectedCreators.message =
          action.payload?.message || "Failed to fetch rejected creators";
        state.getRejectedCreators.isLoading = false;
        state.getRejectedCreators.isError = true;
        state.getRejectedCreators.data = null;
      })
      // getCreatorApplications
      .addCase(getCreatorApplications.pending, (state) => {
        state.getCreatorApplications.isLoading = true;
        state.getCreatorApplications.message = "";
        state.getCreatorApplications.isError = false;
        state.getCreatorApplications.isSuccess = false;
        state.getCreatorApplications.data = null;
      })
      .addCase(getCreatorApplications.fulfilled, (state, action) => {
        state.getCreatorApplications.isLoading = false;
        state.getCreatorApplications.isSuccess = true;
        state.getCreatorApplications.data = action.payload;
      })
      .addCase(getCreatorApplications.rejected, (state, action) => {
        state.getCreatorApplications.message =
          action.payload?.message || "Failed to fetch creator applications";
        state.getCreatorApplications.isLoading = false;
        state.getCreatorApplications.isError = true;
        state.getCreatorApplications.data = null;
      })
      // rejectCreator
      .addCase(rejectCreator.pending, (state) => {
        state.rejectCreator.isLoading = true;
        state.rejectCreator.message = "";
        state.rejectCreator.isError = false;
        state.rejectCreator.isSuccess = false;
        state.rejectCreator.data = null;
      })
      .addCase(rejectCreator.fulfilled, (state, action) => {
        state.rejectCreator.isLoading = false;
        state.rejectCreator.isSuccess = true;
        state.rejectCreator.data = action.payload;
      })
      .addCase(rejectCreator.rejected, (state, action) => {
        state.rejectCreator.message = action.payload?.message || "Failed to reject creator";
        state.rejectCreator.isLoading = false;
        state.rejectCreator.isError = true;
        state.rejectCreator.data = null;
      })
      // reinstateCreator
      .addCase(reinstateCreator.pending, (state) => {
        state.reinstateCreator.isLoading = true;
        state.reinstateCreator.message = "";
        state.reinstateCreator.isError = false;
        state.reinstateCreator.isSuccess = false;
        state.reinstateCreator.data = null;
      })
      .addCase(reinstateCreator.fulfilled, (state, action) => {
        state.reinstateCreator.isLoading = false;
        state.reinstateCreator.isSuccess = true;
        state.reinstateCreator.data = action.payload;
      })
      .addCase(reinstateCreator.rejected, (state, action) => {
        state.reinstateCreator.message = action.payload?.message || "Failed to reinstate creator";
        state.reinstateCreator.isLoading = false;
        state.reinstateCreator.isError = true;
        state.reinstateCreator.data = null;
      })
      // createContract
      .addCase(createContract.pending, (state) => {
        state.createContract.isLoading = true;
        state.createContract.message = "";
        state.createContract.isError = false;
        state.createContract.isSuccess = false;
        state.createContract.data = null;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.createContract.isLoading = false;
        state.createContract.isSuccess = true;
        state.createContract.data = action.payload;
      })
      .addCase(createContract.rejected, (state, action) => {
        state.createContract.message = action.payload?.message || "Failed to create contract";
        state.createContract.isLoading = false;
        state.createContract.isError = true;
        state.createContract.data = null;
      })
      // sendContract
      .addCase(sendContract.pending, (state) => {
        state.sendContract.isLoading = true;
        state.sendContract.message = "";
        state.sendContract.isError = false;
        state.sendContract.isSuccess = false;
        state.sendContract.data = null;
      })
      .addCase(sendContract.fulfilled, (state, action) => {
        state.sendContract.isLoading = false;
        state.sendContract.isSuccess = true;
        state.sendContract.data = action.payload;
      })
      .addCase(sendContract.rejected, (state, action) => {
        state.sendContract.message = action.payload?.message || "Failed to send contract";
        state.sendContract.isLoading = false;
        state.sendContract.isError = true;
        state.sendContract.data = null;
      })
      // hireCreator
      .addCase(hireCreator.pending, (state) => {
        state.hireCreator.isLoading = true;
        state.hireCreator.message = "";
        state.hireCreator.isError = false;
        state.hireCreator.isSuccess = false;
        state.hireCreator.data = null;
      })
      .addCase(hireCreator.fulfilled, (state, action) => {
        state.hireCreator.isLoading = false;
        state.hireCreator.isSuccess = true;
        state.hireCreator.data = action.payload;
      })
      .addCase(hireCreator.rejected, (state, action) => {
        state.hireCreator.message = action.payload?.message || "Failed to hire creator";
        state.hireCreator.isLoading = false;
        state.hireCreator.isError = true;
        state.hireCreator.data = null;
      })
      // markCreatorComplete
      .addCase(markCreatorComplete.pending, (state) => {
        state.markCreatorComplete.isLoading = true;
        state.markCreatorComplete.message = "";
      })
      .addCase(markCreatorComplete.fulfilled, (state, action) => {
        state.markCreatorComplete.isLoading = false;
        state.markCreatorComplete.isSuccess = true;
        state.markCreatorComplete.data = action.payload;
      })
      .addCase(markCreatorComplete.rejected, (state, action) => {
        state.markCreatorComplete.message =
          action.payload?.message || "Failed to mark creator complete";
        state.markCreatorComplete.isLoading = false;
        state.markCreatorComplete.isError = true;
        state.markCreatorComplete.data = null;
      })
      // markCampaignComplete
      .addCase(markCampaignComplete.pending, (state) => {
        state.markCampaignComplete.isLoading = true;
        state.markCampaignComplete.message = "";
      })
      .addCase(markCampaignComplete.fulfilled, (state, action) => {
        state.markCampaignComplete.isLoading = false;
        state.markCampaignComplete.isSuccess = true;
        state.markCampaignComplete.data = action.payload;
      })
      .addCase(markCampaignComplete.rejected, (state, action) => {
        state.markCampaignComplete.message =
          action.payload?.message || "Failed to mark campaign complete";
        state.markCampaignComplete.isLoading = false;
        state.markCampaignComplete.isError = true;
        state.markCampaignComplete.data = null;
      })
      // getCreatorCollaborationHistory
      .addCase(getCreatorCollaborationHistory.pending, (state) => {
        state.getCreatorCollaborationHistory.isLoading = true;
        state.getCreatorCollaborationHistory.message = "";
        state.getCreatorCollaborationHistory.isError = false;
        state.getCreatorCollaborationHistory.isSuccess = false;
        state.getCreatorCollaborationHistory.data = null;
      })
      .addCase(getCreatorCollaborationHistory.fulfilled, (state, action) => {
        state.getCreatorCollaborationHistory.isLoading = false;
        state.getCreatorCollaborationHistory.isSuccess = true;
        state.getCreatorCollaborationHistory.data = action.payload;
      })
      .addCase(getCreatorCollaborationHistory.rejected, (state, action) => {
        state.getCreatorCollaborationHistory.message =
          action.payload?.message || "Failed to get creator collaboration history";
        state.getCreatorCollaborationHistory.isLoading = false;
        state.getCreatorCollaborationHistory.isError = true;
        state.getCreatorCollaborationHistory.data = null;
      });
  },
});

export const {
  reset,
  resetCreateCampaign,
  resetUpdateCampaign,
  resetFilteredCampaigns,
  resetGetAllCampaigns,
  resetGetAllBrandCampaigns,
  resetGetAppliedCreators,
} = campaignsSlice.actions;
export default campaignsSlice.reducer;
