import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import galleryService from "./gallery.service";

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
  getCreatorGallery: generalState,
  importPost: generalState,
  uploadFile: generalState,
  refreshMetrics: generalState,
  deleteGalleryItem: generalState,
};

export const fetchCreatorGallery = createAsyncThunk(
  "gallery/getCreatorGallery",
  async ({ creatorId = null, nicheId = null }, thunkAPI) => {
    try {
      const response = await galleryService.getCreatorGallery(
        creatorId,
        nicheId
      );
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const importPostThunk = createAsyncThunk(
  "gallery/importPost",
  async (data, thunkAPI) => {
    try {
      const response = await galleryService.importPost(data);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const uploadFileThunk = createAsyncThunk(
  "gallery/uploadFile",
  async (data, thunkAPI) => {
    try {
      const response = await galleryService.uploadFile(data);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const refreshMetricsThunk = createAsyncThunk(
  "gallery/refreshMetrics",
  async (galleryId, thunkAPI) => {
    try {
      const response = await galleryService.refreshMetrics(galleryId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const deleteGalleryItemThunk = createAsyncThunk(
  "gallery/deleteGalleryItem",
  async (galleryId, thunkAPI) => {
    try {
      const response = await galleryService.deleteGalleryItem(galleryId);
      if (response.success) return { ...response, galleryId };
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    resetImportPostState: (state) => {
      state.importPost = generalState;
    },
    resetUploadFileState: (state) => {
      state.uploadFile = generalState;
    },
    resetRefreshMetricsState: (state) => {
      state.refreshMetrics = generalState;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCreatorGallery
      .addCase(fetchCreatorGallery.pending, (state) => {
        state.getCreatorGallery.isLoading = true;
        state.getCreatorGallery.isSuccess = false;
        state.getCreatorGallery.isError = false;
        state.getCreatorGallery.message = "";
      })
      .addCase(fetchCreatorGallery.fulfilled, (state, action) => {
        state.getCreatorGallery.isLoading = false;
        state.getCreatorGallery.isSuccess = true;
        state.getCreatorGallery.data = action.payload.data;
        state.getCreatorGallery.message = action.payload.message;
      })
      .addCase(fetchCreatorGallery.rejected, (state, action) => {
        state.getCreatorGallery.isLoading = false;
        state.getCreatorGallery.isError = true;
        state.getCreatorGallery.message =
          action.payload?.message || "Failed to fetch gallery";
      })
      // importPost
      .addCase(importPostThunk.pending, (state) => {
        state.importPost.isLoading = true;
        state.importPost.isSuccess = false;
        state.importPost.isError = false;
        state.importPost.message = "";
      })
      .addCase(importPostThunk.fulfilled, (state, action) => {
        state.importPost.isLoading = false;
        state.importPost.isSuccess = true;
        state.importPost.data = action.payload.data;
        state.importPost.message = action.payload.message;
        if (state.getCreatorGallery.data) {
          state.getCreatorGallery.data = [
            action.payload.data,
            ...state.getCreatorGallery.data,
          ];
        }
      })
      .addCase(importPostThunk.rejected, (state, action) => {
        state.importPost.isLoading = false;
        state.importPost.isError = true;
        state.importPost.message =
          action.payload?.message || "Failed to import post";
      })
      // uploadFile
      .addCase(uploadFileThunk.pending, (state) => {
        state.uploadFile.isLoading = true;
        state.uploadFile.isSuccess = false;
        state.uploadFile.isError = false;
        state.uploadFile.message = "";
      })
      .addCase(uploadFileThunk.fulfilled, (state, action) => {
        state.uploadFile.isLoading = false;
        state.uploadFile.isSuccess = true;
        state.uploadFile.data = action.payload.data;
        state.uploadFile.message = action.payload.message;
        if (state.getCreatorGallery.data) {
          state.getCreatorGallery.data = [
            action.payload.data,
            ...state.getCreatorGallery.data,
          ];
        }
      })
      .addCase(uploadFileThunk.rejected, (state, action) => {
        state.uploadFile.isLoading = false;
        state.uploadFile.isError = true;
        state.uploadFile.message =
          action.payload?.message || "Failed to upload file";
      })
      // refreshMetrics
      .addCase(refreshMetricsThunk.pending, (state) => {
        state.refreshMetrics.isLoading = true;
        state.refreshMetrics.isSuccess = false;
        state.refreshMetrics.isError = false;
        state.refreshMetrics.message = "";
      })
      .addCase(refreshMetricsThunk.fulfilled, (state, action) => {
        state.refreshMetrics.isLoading = false;
        state.refreshMetrics.isSuccess = true;
        state.refreshMetrics.data = action.payload.data;
        state.refreshMetrics.message = action.payload.message;
        if (state.getCreatorGallery.data) {
          const idx = state.getCreatorGallery.data.findIndex(
            (item) => item.id === action.payload.data.id
          );
          if (idx !== -1) {
            state.getCreatorGallery.data[idx] = action.payload.data;
          }
        }
      })
      .addCase(refreshMetricsThunk.rejected, (state, action) => {
        state.refreshMetrics.isLoading = false;
        state.refreshMetrics.isError = true;
        state.refreshMetrics.message =
          action.payload?.message || "Failed to refresh metrics";
      })
      // deleteGalleryItem
      .addCase(deleteGalleryItemThunk.pending, (state) => {
        state.deleteGalleryItem.isLoading = true;
        state.deleteGalleryItem.isSuccess = false;
        state.deleteGalleryItem.isError = false;
        state.deleteGalleryItem.message = "";
      })
      .addCase(deleteGalleryItemThunk.fulfilled, (state, action) => {
        state.deleteGalleryItem.isLoading = false;
        state.deleteGalleryItem.isSuccess = true;
        state.deleteGalleryItem.message = action.payload.message;
        if (state.getCreatorGallery.data) {
          state.getCreatorGallery.data = state.getCreatorGallery.data.filter(
            (item) => item.id !== action.payload.galleryId
          );
        }
      })
      .addCase(deleteGalleryItemThunk.rejected, (state, action) => {
        state.deleteGalleryItem.isLoading = false;
        state.deleteGalleryItem.isError = true;
        state.deleteGalleryItem.message =
          action.payload?.message || "Failed to delete item";
      });
  },
});

export const {
  resetImportPostState,
  resetUploadFileState,
  resetRefreshMetricsState,
} = gallerySlice.actions;

export const selectGalleryItems = (state) => state.gallery.getCreatorGallery;
export const selectImportPost = (state) => state.gallery.importPost;
export const selectUploadFile = (state) => state.gallery.uploadFile;
export const selectRefreshMetrics = (state) => state.gallery.refreshMetrics;
export const selectDeleteGalleryItem = (state) =>
  state.gallery.deleteGalleryItem;

export default gallerySlice.reducer;
