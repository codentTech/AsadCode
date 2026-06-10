import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import shortlistService from "./shortlist.service";

// Helper function to extract serializable error information
const getSerializableError = (error, defaultMessage) => {
  const errorMessage = error.response?.data?.message || error.message || defaultMessage;
  return { message: errorMessage };
};

const generalState = {
  data: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const initialState = {
  createShortlist: { ...generalState },
  getAllShortlists: { ...generalState },
  getShortlistById: { ...generalState },
  updateShortlist: { ...generalState },
  deleteShortlist: { ...generalState },
  addUserToShortlist: { ...generalState },
  removeUserFromShortlist: { ...generalState },
};

// Create shortlist
export const createShortlist = createAsyncThunk(
  "shortlist/createShortlist",
  async (shortlistData, thunkAPI) => {
    try {
      const response = await shortlistService.createShortlist(shortlistData);
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to create shortlist"));
    }
  }
);

// Get all shortlists
export const getAllShortlists = createAsyncThunk(
  "shortlist/getAllShortlists",
  async (_, thunkAPI) => {
    try {
      const response = await shortlistService.getAllShortlists();
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to fetch shortlists"));
    }
  }
);

// Get shortlist by ID
export const getShortlistById = createAsyncThunk(
  "shortlist/getShortlistById",
  async (shortlistId, thunkAPI) => {
    try {
      const response = await shortlistService.getShortlistById(shortlistId);
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to fetch shortlist"));
    }
  }
);

// Update shortlist
export const updateShortlist = createAsyncThunk(
  "shortlist/updateShortlist",
  async ({ shortlistId, updateData }, thunkAPI) => {
    try {
      const response = await shortlistService.updateShortlist(shortlistId, updateData);
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to update shortlist"));
    }
  }
);

// Delete shortlist
export const deleteShortlist = createAsyncThunk(
  "shortlist/deleteShortlist",
  async (shortlistId, thunkAPI) => {
    try {
      const response = await shortlistService.deleteShortlist(shortlistId);
      if (response.success) {
        return { shortlistId, message: response.message };
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to delete shortlist"));
    }
  }
);

// Add user to shortlist
export const addUserToShortlist = createAsyncThunk(
  "shortlist/addUserToShortlist",
  async ({ shortlistId, userId }, thunkAPI) => {
    try {
      const response = await shortlistService.addUserToShortlist(shortlistId, userId);
      if (response.success) {
        return { shortlistId, userId, message: response.message };
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to add user to shortlist")
      );
    }
  }
);

// Remove user from shortlist
export const removeUserFromShortlist = createAsyncThunk(
  "shortlist/removeUserFromShortlist",
  async ({ shortlistId, userId }, thunkAPI) => {
    try {
      const response = await shortlistService.removeUserFromShortlist(shortlistId, userId);
      if (response.success) {
        return { shortlistId, userId, message: response.message };
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to remove user from shortlist")
      );
    }
  }
);

export const shortlistSlice = createSlice({
  name: "shortlist",
  initialState,
  reducers: {
    reset: (state) => {
      state.createShortlist = { ...generalState };
      state.getAllShortlists = { ...generalState };
      state.getShortlistById = { ...generalState };
      state.updateShortlist = { ...generalState };
      state.deleteShortlist = { ...generalState };
      state.addUserToShortlist = { ...generalState };
      state.removeUserFromShortlist = { ...generalState };
    },
    // Optimistic updates for better UX
    optimisticAddUserToShortlist: (state, action) => {
      const { shortlistId, user } = action.payload;
      const shortlist = state.getAllShortlists.data?.find((s) => s.id === shortlistId);
      if (shortlist && !shortlist.users?.find((u) => u.id === user.id)) {
        shortlist.users = [...(shortlist.users || []), user];
        shortlist.user_count = (shortlist.user_count || 0) + 1;
      }
    },
    optimisticRemoveUserFromShortlist: (state, action) => {
      const { shortlistId, userId } = action.payload;
      const shortlist = state.getAllShortlists.data?.find((s) => s.id === shortlistId);
      if (shortlist) {
        shortlist.users = shortlist.users?.filter((u) => u.id !== userId) || [];
        shortlist.user_count = Math.max((shortlist.user_count || 0) - 1, 0);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create shortlist
      .addCase(createShortlist.pending, (state) => {
        state.createShortlist.isLoading = true;
      })
      .addCase(createShortlist.fulfilled, (state, action) => {
        state.createShortlist.isLoading = false;
        state.createShortlist.isSuccess = true;
        state.createShortlist.data = action.payload;
        // Add to the list of shortlists
        if (state.getAllShortlists.data) {
          // Ensure the new shortlist has a users array
          const newShortlist = {
            ...action.payload,
            users: action.payload.users || [],
          };
          state.getAllShortlists.data.push(newShortlist);
        }
      })
      .addCase(createShortlist.rejected, (state, action) => {
        state.createShortlist.isLoading = false;
        state.createShortlist.isError = true;
        state.createShortlist.message = action.payload?.message || "Failed to create shortlist";
      })
      // Get all shortlists
      .addCase(getAllShortlists.pending, (state) => {
        state.getAllShortlists.isLoading = true;
        state.getAllShortlists.isSuccess = false;
        state.getAllShortlists.data = null;
      })
      .addCase(getAllShortlists.fulfilled, (state, action) => {
        state.getAllShortlists.isLoading = false;
        state.getAllShortlists.isSuccess = true;
        // Ensure each shortlist has a users array
        state.getAllShortlists.data =
          action.payload?.map((shortlist) => ({
            ...shortlist,
            users: shortlist.users || [],
          })) || [];
      })
      .addCase(getAllShortlists.rejected, (state, action) => {
        state.getAllShortlists.isLoading = false;
        state.getAllShortlists.isError = true;
        state.getAllShortlists.message = action.payload?.message || "Failed to fetch shortlists";
      })
      // Get shortlist by ID
      .addCase(getShortlistById.pending, (state) => {
        state.getShortlistById.isLoading = true;
      })
      .addCase(getShortlistById.fulfilled, (state, action) => {
        state.getShortlistById.isLoading = false;
        state.getShortlistById.isSuccess = true;
        state.getShortlistById.data = action.payload;
      })
      .addCase(getShortlistById.rejected, (state, action) => {
        state.getShortlistById.isLoading = false;
        state.getShortlistById.isError = true;
        state.getShortlistById.message = action.payload?.message || "Failed to fetch shortlist";
      })
      // Update shortlist
      .addCase(updateShortlist.pending, (state) => {
        state.updateShortlist.isLoading = true;
      })
      .addCase(updateShortlist.fulfilled, (state, action) => {
        state.updateShortlist.isLoading = false;
        state.updateShortlist.isSuccess = true;
        state.updateShortlist.data = action.payload;
        // Update in the list of shortlists
        if (state.getAllShortlists.data) {
          const index = state.getAllShortlists.data.findIndex((s) => s.id === action.payload.id);
          if (index !== -1) {
            state.getAllShortlists.data[index] = {
              ...action.payload,
              users: action.payload.users || state.getAllShortlists.data[index].users || [],
            };
          }
        }
      })
      .addCase(updateShortlist.rejected, (state, action) => {
        state.updateShortlist.isLoading = false;
        state.updateShortlist.isError = true;
        state.updateShortlist.message = action.payload?.message || "Failed to update shortlist";
      })
      // Delete shortlist
      .addCase(deleteShortlist.pending, (state) => {
        state.deleteShortlist.isLoading = true;
      })
      .addCase(deleteShortlist.fulfilled, (state, action) => {
        state.deleteShortlist.isLoading = false;
        state.deleteShortlist.isSuccess = true;
        state.deleteShortlist.data = action.payload;
        // Remove from the list of shortlists
        if (state.getAllShortlists.data) {
          state.getAllShortlists.data = state.getAllShortlists.data.filter(
            (s) => s.id !== action.payload.shortlistId
          );
        }
      })
      .addCase(deleteShortlist.rejected, (state, action) => {
        state.deleteShortlist.isLoading = false;
        state.deleteShortlist.isError = true;
        state.deleteShortlist.message = action.payload?.message || "Failed to delete shortlist";
      })
      // Add user to shortlist
      .addCase(addUserToShortlist.pending, (state) => {
        state.addUserToShortlist.isLoading = true;
      })
      .addCase(addUserToShortlist.fulfilled, (state, action) => {
        state.addUserToShortlist.isLoading = false;
        state.addUserToShortlist.isSuccess = true;
        state.addUserToShortlist.data = action.payload;
        // Note: Shortlists will be refetched by the component to get accurate counts
      })
      .addCase(addUserToShortlist.rejected, (state, action) => {
        state.addUserToShortlist.isLoading = false;
        state.addUserToShortlist.isError = true;
        state.addUserToShortlist.message =
          action.payload?.message || "Failed to add user to shortlist";
      })
      // Remove user from shortlist
      .addCase(removeUserFromShortlist.pending, (state) => {
        state.removeUserFromShortlist.isLoading = true;
      })
      .addCase(removeUserFromShortlist.fulfilled, (state, action) => {
        state.removeUserFromShortlist.isLoading = false;
        state.removeUserFromShortlist.isSuccess = true;
        state.removeUserFromShortlist.data = action.payload;
        // Note: Shortlists will be refetched by the component to get accurate counts
      })
      .addCase(removeUserFromShortlist.rejected, (state, action) => {
        state.removeUserFromShortlist.isLoading = false;
        state.removeUserFromShortlist.isError = true;
        state.removeUserFromShortlist.message =
          action.payload?.message || "Failed to remove user from shortlist";
      });
  },
});

export const { reset, optimisticAddUserToShortlist, optimisticRemoveUserFromShortlist } =
  shortlistSlice.actions;
export default shortlistSlice.reducer;
