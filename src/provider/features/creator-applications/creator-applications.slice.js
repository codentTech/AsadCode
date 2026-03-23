import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import creatorApplicationsService from "./creator-applications.service";

const initialState = {
  createApplication: {
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
  getAllApplications: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
  approveApplication: {
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
  denyApplication: {
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
};

export const createApplication = createAsyncThunk(
  "creator-applications/create",
  async (data, thunkAPI) => {
    try {
      const response = await creatorApplicationsService.createApplication(data);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit application";
      return thunkAPI.rejectWithValue({ message: errorMessage });
    }
  }
);

export const getAllCreatorApplications = createAsyncThunk(
  "creator-applications/getAll",
  async ({ status, search, sortBy, sortOrder }, thunkAPI) => {
    const response = await creatorApplicationsService.getAllCreatorApplications(status, search, sortBy, sortOrder);
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  }
);

export const approveApplicationAndInvite = createAsyncThunk(
  "creator-applications/approveAndInvite",
  async ({ applicationId, email }, thunkAPI) => {
    const response = await creatorApplicationsService.approveApplicationAndInvite(applicationId, email);
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  }
);

export const denyApplication = createAsyncThunk(
  "creator-applications/deny",
  async (applicationId, thunkAPI) => {
    const response = await creatorApplicationsService.denyApplication(applicationId);
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  }
);

const creatorApplicationsSlice = createSlice({
  name: "creator-applications",
  initialState,
  reducers: {
    resetCreateState: (state) => {
      state.createApplication = initialState.createApplication;
    },
    resetApproveState: (state) => {
      state.approveApplication = initialState.approveApplication;
    },
    resetDenyState: (state) => {
      state.denyApplication = initialState.denyApplication;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createApplication.pending, (state) => {
        state.createApplication.isLoading = true;
        state.createApplication.isError = false;
        state.createApplication.isSuccess = false;
        state.createApplication.message = "";
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.createApplication.isLoading = false;
        state.createApplication.isSuccess = true;
        state.createApplication.message = action.payload.message || "Application submitted successfully";
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.createApplication.isLoading = false;
        state.createApplication.isError = true;
        state.createApplication.message =
          action.payload?.message || "Failed to submit application";
      })
      .addCase(getAllCreatorApplications.pending, (state) => {
        state.getAllApplications.isLoading = true;
        state.getAllApplications.isError = false;
        state.getAllApplications.isSuccess = false;
        state.getAllApplications.message = "";
      })
      .addCase(getAllCreatorApplications.fulfilled, (state, action) => {
        state.getAllApplications.isLoading = false;
        state.getAllApplications.isSuccess = true;
        state.getAllApplications.data = Array.isArray(action.payload?.data)
          ? action.payload.data
          : [];
      })
      .addCase(getAllCreatorApplications.rejected, (state, action) => {
        state.getAllApplications.isLoading = false;
        state.getAllApplications.isError = true;
        state.getAllApplications.message =
          action.payload?.message || "Failed to fetch creator applications";
      })
      .addCase(approveApplicationAndInvite.pending, (state) => {
        state.approveApplication.isLoading = true;
        state.approveApplication.isError = false;
        state.approveApplication.isSuccess = false;
        state.approveApplication.message = "";
      })
      .addCase(approveApplicationAndInvite.fulfilled, (state, action) => {
        state.approveApplication.isLoading = false;
        state.approveApplication.isSuccess = true;
        state.approveApplication.message = action.payload.message || "Application approved and invite sent";
      })
      .addCase(approveApplicationAndInvite.rejected, (state, action) => {
        state.approveApplication.isLoading = false;
        state.approveApplication.isError = true;
        state.approveApplication.message =
          action.payload?.message || "Failed to approve application";
      })
      .addCase(denyApplication.pending, (state) => {
        state.denyApplication.isLoading = true;
        state.denyApplication.isError = false;
        state.denyApplication.isSuccess = false;
        state.denyApplication.message = "";
      })
      .addCase(denyApplication.fulfilled, (state, action) => {
        state.denyApplication.isLoading = false;
        state.denyApplication.isSuccess = true;
        state.denyApplication.message = action.payload.message || "Application denied";
      })
      .addCase(denyApplication.rejected, (state, action) => {
        state.denyApplication.isLoading = false;
        state.denyApplication.isError = true;
        state.denyApplication.message = action.payload?.message || "Failed to deny application";
      });
  },
});

export const { resetCreateState, resetApproveState, resetDenyState } = creatorApplicationsSlice.actions;
export default creatorApplicationsSlice.reducer;

