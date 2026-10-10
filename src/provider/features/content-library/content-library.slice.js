import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import contentLibraryService from "./content-library.service";

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

const triggerBlobDownload = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "download";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const filenameFromContentDisposition = (header) => {
  if (!header || typeof header !== "string") return null;
  const match = /filename\*?=(?:UTF-8''|")?([^";]+)/i.exec(header);
  if (!match?.[1]) return null;
  return decodeURIComponent(match[1].replace(/"/g, ""));
};

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  listAssets: { ...generalState },
  filterOptions: { ...generalState },
  getAsset: { ...generalState },
  archiveAsset: { ...generalState },
  unarchiveAsset: { ...generalState },
  downloadAsset: { ...generalState },
};

export const fetchContentLibraryAssets = createAsyncThunk(
  "contentLibrary/listAssets",
  async (params, thunkAPI) => {
    try {
      const response = await contentLibraryService.listAssets(params);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const fetchContentLibraryFilterOptions = createAsyncThunk(
  "contentLibrary/filterOptions",
  async (_, thunkAPI) => {
    try {
      const response = await contentLibraryService.getFilterOptions();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const fetchContentLibraryAsset = createAsyncThunk(
  "contentLibrary/getAsset",
  async (id, thunkAPI) => {
    try {
      const response = await contentLibraryService.getAssetById(id);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const archiveContentLibraryAsset = createAsyncThunk(
  "contentLibrary/archiveAsset",
  async (id, thunkAPI) => {
    try {
      const response = await contentLibraryService.archiveAsset(id);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const unarchiveContentLibraryAsset = createAsyncThunk(
  "contentLibrary/unarchiveAsset",
  async (id, thunkAPI) => {
    try {
      const response = await contentLibraryService.unarchiveAsset(id);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const downloadContentLibraryAsset = createAsyncThunk(
  "contentLibrary/downloadAsset",
  async ({ id, filename }, thunkAPI) => {
    try {
      const response = await contentLibraryService.downloadAsset(id);
      const blob = response.data;
      const resolvedName =
        filenameFromContentDisposition(response.headers?.["content-disposition"]) ||
        filename ||
        "content-asset";
      triggerBlobDownload(blob, resolvedName);
      return { success: true, data: { id } };
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

const contentLibrarySlice = createSlice({
  name: "contentLibrary",
  initialState,
  reducers: {
    clearContentLibraryAsset(state) {
      state.getAsset = { ...generalState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContentLibraryAssets.pending, (state) => {
        state.listAssets.isLoading = true;
        state.listAssets.isError = false;
        state.listAssets.isSuccess = false;
        state.listAssets.message = "";
      })
      .addCase(fetchContentLibraryAssets.fulfilled, (state, action) => {
        state.listAssets.isLoading = false;
        state.listAssets.isSuccess = true;
        state.listAssets.data = action.payload.data;
      })
      .addCase(fetchContentLibraryAssets.rejected, (state, action) => {
        state.listAssets.isLoading = false;
        state.listAssets.isError = true;
        state.listAssets.message = action.payload?.message || "Failed to load assets";
      })
      .addCase(fetchContentLibraryFilterOptions.pending, (state) => {
        state.filterOptions.isLoading = true;
        state.filterOptions.isError = false;
      })
      .addCase(fetchContentLibraryFilterOptions.fulfilled, (state, action) => {
        state.filterOptions.isLoading = false;
        state.filterOptions.isSuccess = true;
        state.filterOptions.data = action.payload.data;
      })
      .addCase(fetchContentLibraryFilterOptions.rejected, (state, action) => {
        state.filterOptions.isLoading = false;
        state.filterOptions.isError = true;
        state.filterOptions.message =
          action.payload?.message || "Failed to load filters";
      })
      .addCase(fetchContentLibraryAsset.pending, (state) => {
        state.getAsset.isLoading = true;
        state.getAsset.isError = false;
        state.getAsset.isSuccess = false;
      })
      .addCase(fetchContentLibraryAsset.fulfilled, (state, action) => {
        state.getAsset.isLoading = false;
        state.getAsset.isSuccess = true;
        state.getAsset.data = action.payload.data;
      })
      .addCase(fetchContentLibraryAsset.rejected, (state, action) => {
        state.getAsset.isLoading = false;
        state.getAsset.isError = true;
        state.getAsset.message = action.payload?.message || "Failed to load asset";
      })
      .addCase(archiveContentLibraryAsset.pending, (state) => {
        state.archiveAsset.isLoading = true;
      })
      .addCase(archiveContentLibraryAsset.fulfilled, (state, action) => {
        state.archiveAsset.isLoading = false;
        state.archiveAsset.isSuccess = true;
        state.archiveAsset.data = action.payload.data;
        if (state.getAsset.data?.id === action.payload.data?.id) {
          state.getAsset.data = action.payload.data;
        }
      })
      .addCase(archiveContentLibraryAsset.rejected, (state, action) => {
        state.archiveAsset.isLoading = false;
        state.archiveAsset.isError = true;
        state.archiveAsset.message =
          action.payload?.message || "Failed to archive asset";
      })
      .addCase(unarchiveContentLibraryAsset.pending, (state) => {
        state.unarchiveAsset.isLoading = true;
      })
      .addCase(unarchiveContentLibraryAsset.fulfilled, (state, action) => {
        state.unarchiveAsset.isLoading = false;
        state.unarchiveAsset.isSuccess = true;
        state.unarchiveAsset.data = action.payload.data;
        if (state.getAsset.data?.id === action.payload.data?.id) {
          state.getAsset.data = action.payload.data;
        }
      })
      .addCase(unarchiveContentLibraryAsset.rejected, (state, action) => {
        state.unarchiveAsset.isLoading = false;
        state.unarchiveAsset.isError = true;
        state.unarchiveAsset.message =
          action.payload?.message || "Failed to unarchive asset";
      })
      .addCase(downloadContentLibraryAsset.pending, (state) => {
        state.downloadAsset.isLoading = true;
        state.downloadAsset.isError = false;
      })
      .addCase(downloadContentLibraryAsset.fulfilled, (state) => {
        state.downloadAsset.isLoading = false;
        state.downloadAsset.isSuccess = true;
      })
      .addCase(downloadContentLibraryAsset.rejected, (state, action) => {
        state.downloadAsset.isLoading = false;
        state.downloadAsset.isError = true;
        state.downloadAsset.message =
          action.payload?.message || "Failed to download asset";
      });
  },
});

export const { clearContentLibraryAsset } = contentLibrarySlice.actions;

export const selectContentLibraryList = (state) => state.contentLibrary.listAssets;
export const selectContentLibraryFilterOptions = (state) =>
  state.contentLibrary.filterOptions;
export const selectContentLibraryAsset = (state) => state.contentLibrary.getAsset;
export const selectContentLibraryArchive = (state) =>
  state.contentLibrary.archiveAsset;
export const selectContentLibraryUnarchive = (state) =>
  state.contentLibrary.unarchiveAsset;
export const selectContentLibraryDownload = (state) =>
  state.contentLibrary.downloadAsset;

export default contentLibrarySlice.reducer;
