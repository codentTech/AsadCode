import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import pitchesService from "./pitches.service";

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
  createPitch: { ...generalState },
  getAllPitches: { ...generalState },
  getPitchById: { ...generalState },
  updatePitch: { ...generalState },
  deletePitch: { ...generalState },
};

// Create pitch
export const createPitch = createAsyncThunk("pitches/createPitch", async (payload, thunkAPI) => {
  try {
    const response = await pitchesService.createPitch(payload);
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to create pitch"));
  }
});

// Get all pitches
export const getAllPitches = createAsyncThunk("pitches/getAllPitches", async (_, thunkAPI) => {
  try {
    const response = await pitchesService.getAllPitches();
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to fetch pitches"));
  }
});

// Get pitch by ID
export const getPitchById = createAsyncThunk("pitches/getPitchById", async (pitchId, thunkAPI) => {
  try {
    const response = await pitchesService.getPitchById(pitchId);
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to fetch pitch"));
  }
});

// Update pitch
export const updatePitch = createAsyncThunk(
  "pitches/updatePitch",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await pitchesService.updatePitch(id, data);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to update pitch"));
    }
  }
);

// Delete pitch
export const deletePitch = createAsyncThunk("pitches/deletePitch", async (pitchId, thunkAPI) => {
  try {
    const response = await pitchesService.deletePitch(pitchId);
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to delete pitch"));
  }
});

export const pitchesSlice = createSlice({
  name: "pitches",
  initialState,
  reducers: {
    reset: (state) => {
      state.createPitch = { ...generalState };
      state.getAllPitches = { ...generalState };
      state.getPitchById = { ...generalState };
      state.updatePitch = { ...generalState };
      state.deletePitch = { ...generalState };
    },
    resetCreatePitch: (state) => {
      state.createPitch = { ...generalState };
    },
    resetUpdatePitch: (state) => {
      state.updatePitch = { ...generalState };
    },
    resetDeletePitch: (state) => {
      state.deletePitch = { ...generalState };
    },
  },
  extraReducers: (builder) => {
    builder
      // createPitch
      .addCase(createPitch.pending, (state) => {
        state.createPitch.isLoading = true;
        state.createPitch.message = "";
        state.createPitch.isError = false;
        state.createPitch.isSuccess = false;
        state.createPitch.data = null;
      })
      .addCase(createPitch.fulfilled, (state, action) => {
        state.createPitch.isLoading = false;
        state.createPitch.isSuccess = true;
        state.createPitch.data = action.payload;
      })
      .addCase(createPitch.rejected, (state, action) => {
        state.createPitch.message = action.payload?.message || "Failed to create pitch";
        state.createPitch.isLoading = false;
        state.createPitch.isError = true;
        state.createPitch.data = null;
      })
      // getAllPitches
      .addCase(getAllPitches.pending, (state) => {
        state.getAllPitches.isLoading = true;
        state.getAllPitches.message = "";
        state.getAllPitches.isError = false;
        state.getAllPitches.isSuccess = false;
        state.getAllPitches.data = null;
      })
      .addCase(getAllPitches.fulfilled, (state, action) => {
        state.getAllPitches.isLoading = false;
        state.getAllPitches.isSuccess = true;
        state.getAllPitches.data = action.payload;
      })
      .addCase(getAllPitches.rejected, (state, action) => {
        state.getAllPitches.message = action.payload?.message || "Failed to fetch pitches";
        state.getAllPitches.isLoading = false;
        state.getAllPitches.isError = true;
        state.getAllPitches.data = null;
      })
      // getPitchById
      .addCase(getPitchById.pending, (state) => {
        state.getPitchById.isLoading = true;
        state.getPitchById.message = "";
        state.getPitchById.isError = false;
        state.getPitchById.isSuccess = false;
        state.getPitchById.data = null;
      })
      .addCase(getPitchById.fulfilled, (state, action) => {
        state.getPitchById.isLoading = false;
        state.getPitchById.isSuccess = true;
        state.getPitchById.data = action.payload;
      })
      .addCase(getPitchById.rejected, (state, action) => {
        state.getPitchById.message = action.payload?.message || "Failed to fetch pitch";
        state.getPitchById.isLoading = false;
        state.getPitchById.isError = true;
        state.getPitchById.data = null;
      })
      // updatePitch
      .addCase(updatePitch.pending, (state) => {
        state.updatePitch.isLoading = true;
        state.updatePitch.message = "";
        state.updatePitch.isError = false;
        state.updatePitch.isSuccess = false;
        state.updatePitch.data = null;
      })
      .addCase(updatePitch.fulfilled, (state, action) => {
        state.updatePitch.isLoading = false;
        state.updatePitch.isSuccess = true;
        state.updatePitch.data = action.payload;
      })
      .addCase(updatePitch.rejected, (state, action) => {
        state.updatePitch.message = action.payload?.message || "Failed to update pitch";
        state.updatePitch.isLoading = false;
        state.updatePitch.isError = true;
        state.updatePitch.data = null;
      })
      // deletePitch
      .addCase(deletePitch.pending, (state) => {
        state.deletePitch.isLoading = true;
        state.deletePitch.message = "";
        state.deletePitch.isError = false;
        state.deletePitch.isSuccess = false;
        state.deletePitch.data = null;
      })
      .addCase(deletePitch.fulfilled, (state, action) => {
        state.deletePitch.isLoading = false;
        state.deletePitch.isSuccess = true;
        state.deletePitch.data = action.payload;
      })
      .addCase(deletePitch.rejected, (state, action) => {
        state.deletePitch.message = action.payload?.message || "Failed to delete pitch";
        state.deletePitch.isLoading = false;
        state.deletePitch.isError = true;
        state.deletePitch.data = null;
      });
  },
});

export const { reset, resetCreatePitch, resetUpdatePitch, resetDeletePitch } = pitchesSlice.actions;
export default pitchesSlice.reducer;
