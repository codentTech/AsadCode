import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import campaignNotesService from "./campaign-notes.service";

const generalState = {
  data: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const initialState = {
  createCampaignNote: { ...generalState },
  getCampaignNotes: { ...generalState },
  getCampaignNoteById: { ...generalState },
  updateCampaignNote: { ...generalState },
  deleteCampaignNote: { ...generalState },
};

// Create campaign note
export const createCampaignNote = createAsyncThunk(
  "campaignNotes/createCampaignNote",
  async ({ campaignId, noteData }, thunkAPI) => {
    try {
      const response = await campaignNotesService.createCampaignNote(campaignId, noteData);
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get campaign notes
export const getCampaignNotes = createAsyncThunk(
  "campaignNotes/getCampaignNotes",
  async (campaignId, thunkAPI) => {
    try {
      const response = await campaignNotesService.getCampaignNotes(campaignId);
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get campaign note by ID
export const getCampaignNoteById = createAsyncThunk(
  "campaignNotes/getCampaignNoteById",
  async (noteId, thunkAPI) => {
    try {
      const response = await campaignNotesService.getCampaignNoteById(noteId);
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Update campaign note
export const updateCampaignNote = createAsyncThunk(
  "campaignNotes/updateCampaignNote",
  async ({ noteId, noteData }, thunkAPI) => {
    try {
      const response = await campaignNotesService.updateCampaignNote(noteId, noteData);
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Delete campaign note
export const deleteCampaignNote = createAsyncThunk(
  "campaignNotes/deleteCampaignNote",
  async (noteId, thunkAPI) => {
    try {
      const response = await campaignNotesService.deleteCampaignNote(noteId);
      if (response.success) {
        return { noteId, message: response.message };
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const campaignNotesSlice = createSlice({
  name: "campaignNotes",
  initialState,
  reducers: {
    reset: (state) => {
      state.createCampaignNote = { ...generalState };
      state.getCampaignNotes = { ...generalState };
      state.getCampaignNoteById = { ...generalState };
      state.updateCampaignNote = { ...generalState };
      state.deleteCampaignNote = { ...generalState };
    },
    resetCreateCampaignNote: (state) => {
      state.createCampaignNote = { ...generalState };
    },
    resetUpdateCampaignNote: (state) => {
      state.updateCampaignNote = { ...generalState };
    },
    resetDeleteCampaignNote: (state) => {
      state.deleteCampaignNote = { ...generalState };
    },
  },
  extraReducers: (builder) => {
    builder
      // createCampaignNote
      .addCase(createCampaignNote.pending, (state) => {
        state.createCampaignNote.isLoading = true;
        state.createCampaignNote.isError = false;
        state.createCampaignNote.isSuccess = false;
      })
      .addCase(createCampaignNote.fulfilled, (state, action) => {
        state.createCampaignNote.isLoading = false;
        state.createCampaignNote.isSuccess = true;
        state.createCampaignNote.data = action.payload;
        state.createCampaignNote.message = "Note created successfully";
      })
      .addCase(createCampaignNote.rejected, (state, action) => {
        state.createCampaignNote.isLoading = false;
        state.createCampaignNote.isError = true;
        state.createCampaignNote.message = action.payload?.message || "Failed to create note";
      })

      // getCampaignNotes
      .addCase(getCampaignNotes.pending, (state) => {
        state.getCampaignNotes.isLoading = true;
        state.getCampaignNotes.isError = false;
        state.getCampaignNotes.isSuccess = false;
      })
      .addCase(getCampaignNotes.fulfilled, (state, action) => {
        state.getCampaignNotes.isLoading = false;
        state.getCampaignNotes.isSuccess = true;
        state.getCampaignNotes.data = action.payload;
      })
      .addCase(getCampaignNotes.rejected, (state, action) => {
        state.getCampaignNotes.isLoading = false;
        state.getCampaignNotes.isError = true;
        state.getCampaignNotes.message = action.payload?.message || "Failed to fetch notes";
      })

      // getCampaignNoteById
      .addCase(getCampaignNoteById.pending, (state) => {
        state.getCampaignNoteById.isLoading = true;
        state.getCampaignNoteById.isError = false;
        state.getCampaignNoteById.isSuccess = false;
      })
      .addCase(getCampaignNoteById.fulfilled, (state, action) => {
        state.getCampaignNoteById.isLoading = false;
        state.getCampaignNoteById.isSuccess = true;
        state.getCampaignNoteById.data = action.payload;
      })
      .addCase(getCampaignNoteById.rejected, (state, action) => {
        state.getCampaignNoteById.isLoading = false;
        state.getCampaignNoteById.isError = true;
        state.getCampaignNoteById.message = action.payload?.message || "Failed to fetch note";
      })

      // updateCampaignNote
      .addCase(updateCampaignNote.pending, (state) => {
        state.updateCampaignNote.isLoading = true;
        state.updateCampaignNote.isError = false;
        state.updateCampaignNote.isSuccess = false;
      })
      .addCase(updateCampaignNote.fulfilled, (state, action) => {
        state.updateCampaignNote.isLoading = false;
        state.updateCampaignNote.isSuccess = true;
        state.updateCampaignNote.data = action.payload;
        state.updateCampaignNote.message = "Note updated successfully";
      })
      .addCase(updateCampaignNote.rejected, (state, action) => {
        state.updateCampaignNote.isLoading = false;
        state.updateCampaignNote.isError = true;
        state.updateCampaignNote.message = action.payload?.message || "Failed to update note";
      })

      // deleteCampaignNote
      .addCase(deleteCampaignNote.pending, (state) => {
        state.deleteCampaignNote.isLoading = true;
        state.deleteCampaignNote.isError = false;
        state.deleteCampaignNote.isSuccess = false;
      })
      .addCase(deleteCampaignNote.fulfilled, (state, action) => {
        state.deleteCampaignNote.isLoading = false;
        state.deleteCampaignNote.isSuccess = true;
        state.deleteCampaignNote.data = action.payload;
        state.deleteCampaignNote.message = action.payload.message;
      })
      .addCase(deleteCampaignNote.rejected, (state, action) => {
        state.deleteCampaignNote.isLoading = false;
        state.deleteCampaignNote.isError = true;
        state.deleteCampaignNote.message = action.payload?.message || "Failed to delete note";
      });
  },
});

export const { reset, resetCreateCampaignNote, resetUpdateCampaignNote, resetDeleteCampaignNote } =
  campaignNotesSlice.actions;

export default campaignNotesSlice.reducer;
