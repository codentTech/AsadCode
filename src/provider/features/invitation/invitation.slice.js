import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import invitationService from "./invitation.service";

const initialState = {
  sendInvitation: {
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
  getBrandIndividualCollaborations: {
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
  rejectInvitation: {
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
  reinstateInvitation: {
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
  getBrandRejectedIndividualCollaborations: {
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
};

export const sendInvitation = createAsyncThunk(
  "invitation/sendInvitation",
  async (invitationData, thunkAPI) => {
    try {
      const response = await invitationService.sendInvitation(invitationData);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: "Failed to send invitation" }
      );
    }
  }
);

export const getBrandIndividualCollaborations = createAsyncThunk(
  "invitation/getBrandIndividualCollaborations",
  async (arg = {}, thunkAPI) => {
    try {
      const response = await invitationService.getBrandIndividualCollaborations();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: "Failed to fetch individual collaborations" }
      );
    }
  }
);

export const rejectInvitation = createAsyncThunk(
  "invitation/rejectInvitation",
  async (invitationId, thunkAPI) => {
    try {
      const response = await invitationService.rejectInvitation(invitationId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: "Failed to reject invitation" }
      );
    }
  }
);

export const reinstateInvitation = createAsyncThunk(
  "invitation/reinstateInvitation",
  async (invitationId, thunkAPI) => {
    try {
      const response = await invitationService.reinstateInvitation(invitationId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: "Failed to reinstate invitation" }
      );
    }
  }
);

export const getBrandRejectedIndividualCollaborations = createAsyncThunk(
  "invitation/getBrandRejectedIndividualCollaborations",
  async (_, thunkAPI) => {
    try {
      const response = await invitationService.getBrandRejectedIndividualCollaborations();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: "Failed to fetch rejected individual collaborations" }
      );
    }
  }
);

const invitationSlice = createSlice({
  name: "invitation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendInvitation.pending, (state) => {
        state.sendInvitation.isLoading = true;
        state.sendInvitation.isSuccess = false;
        state.sendInvitation.isError = false;
      })
      .addCase(sendInvitation.fulfilled, (state, action) => {
        state.sendInvitation.isLoading = false;
        state.sendInvitation.isSuccess = true;
        state.sendInvitation.data = action.payload;
      })
      .addCase(sendInvitation.rejected, (state, action) => {
        state.sendInvitation.isLoading = false;
        state.sendInvitation.isError = true;
        state.sendInvitation.data = action.payload;
      })
      .addCase(getBrandIndividualCollaborations.pending, (state, action) => {
        if (action.meta.arg?.silent) return;
        state.getBrandIndividualCollaborations.isLoading = true;
        state.getBrandIndividualCollaborations.isSuccess = false;
        state.getBrandIndividualCollaborations.isError = false;
      })
      .addCase(getBrandIndividualCollaborations.fulfilled, (state, action) => {
        state.getBrandIndividualCollaborations.isLoading = false;
        state.getBrandIndividualCollaborations.isSuccess = true;
        state.getBrandIndividualCollaborations.data = action.payload;
      })
      .addCase(getBrandIndividualCollaborations.rejected, (state, action) => {
        if (action.meta.arg?.silent) return;
        state.getBrandIndividualCollaborations.isLoading = false;
        state.getBrandIndividualCollaborations.isError = true;
        state.getBrandIndividualCollaborations.data = action.payload;
      })
      .addCase(rejectInvitation.pending, (state) => {
        state.rejectInvitation.isLoading = true;
        state.rejectInvitation.isSuccess = false;
        state.rejectInvitation.isError = false;
      })
      .addCase(rejectInvitation.fulfilled, (state, action) => {
        state.rejectInvitation.isLoading = false;
        state.rejectInvitation.isSuccess = true;
        state.rejectInvitation.data = action.payload;
      })
      .addCase(rejectInvitation.rejected, (state, action) => {
        state.rejectInvitation.isLoading = false;
        state.rejectInvitation.isError = true;
        state.rejectInvitation.data = action.payload;
      })
      .addCase(reinstateInvitation.pending, (state) => {
        state.reinstateInvitation.isLoading = true;
        state.reinstateInvitation.isSuccess = false;
        state.reinstateInvitation.isError = false;
      })
      .addCase(reinstateInvitation.fulfilled, (state, action) => {
        state.reinstateInvitation.isLoading = false;
        state.reinstateInvitation.isSuccess = true;
        state.reinstateInvitation.data = action.payload;
      })
      .addCase(reinstateInvitation.rejected, (state, action) => {
        state.reinstateInvitation.isLoading = false;
        state.reinstateInvitation.isError = true;
        state.reinstateInvitation.data = action.payload;
      })
      .addCase(getBrandRejectedIndividualCollaborations.pending, (state) => {
        state.getBrandRejectedIndividualCollaborations.isLoading = true;
        state.getBrandRejectedIndividualCollaborations.isSuccess = false;
        state.getBrandRejectedIndividualCollaborations.isError = false;
      })
      .addCase(getBrandRejectedIndividualCollaborations.fulfilled, (state, action) => {
        state.getBrandRejectedIndividualCollaborations.isLoading = false;
        state.getBrandRejectedIndividualCollaborations.isSuccess = true;
        state.getBrandRejectedIndividualCollaborations.data = action.payload;
      })
      .addCase(getBrandRejectedIndividualCollaborations.rejected, (state, action) => {
        state.getBrandRejectedIndividualCollaborations.isLoading = false;
        state.getBrandRejectedIndividualCollaborations.isError = true;
        state.getBrandRejectedIndividualCollaborations.data = action.payload;
      });
  },
});

export default invitationSlice.reducer;
