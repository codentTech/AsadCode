import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import uploadFileService from "./upload-file.service";

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

const initialState = {
  uploadSingleFile: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  uploadMultipleFiles: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
};

export const uploadSingleFile = createAsyncThunk(
  "uploadSingleFile",
  async ({ file, folder }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await uploadFileService.uploadSingleFile(formData);
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const uploadMultipleFiles = createAsyncThunk(
  "uploadMultipleFiles",
  async ({ files, folder }, thunkAPI) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("folder", folder);

      const response = await uploadFileService.uploadMultipleFiles(formData);
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const uploadFileSlice = createSlice({
  name: "uploadFile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Single file upload
      .addCase(uploadSingleFile.pending, (state) => {
        state.uploadSingleFile.isLoading = true;
        state.uploadSingleFile.message = "";
        state.uploadSingleFile.isError = false;
        state.uploadSingleFile.isSuccess = false;
        state.uploadSingleFile.data = null;
      })
      .addCase(uploadSingleFile.fulfilled, (state, action) => {
        state.uploadSingleFile.isLoading = false;
        state.uploadSingleFile.isSuccess = true;
        state.uploadSingleFile.data = action.payload;
      })
      .addCase(uploadSingleFile.rejected, (state, action) => {
        state.uploadSingleFile.message = action.payload?.message || "Upload failed";
        state.uploadSingleFile.isLoading = false;
        state.uploadSingleFile.isError = true;
        state.uploadSingleFile.data = null;
      })
      // Multiple files upload
      .addCase(uploadMultipleFiles.pending, (state) => {
        state.uploadMultipleFiles.isLoading = true;
        state.uploadMultipleFiles.message = "";
        state.uploadMultipleFiles.isError = false;
        state.uploadMultipleFiles.isSuccess = false;
        state.uploadMultipleFiles.data = null;
      })
      .addCase(uploadMultipleFiles.fulfilled, (state, action) => {
        state.uploadMultipleFiles.isLoading = false;
        state.uploadMultipleFiles.isSuccess = true;
        state.uploadMultipleFiles.data = action.payload;
      })
      .addCase(uploadMultipleFiles.rejected, (state, action) => {
        state.uploadMultipleFiles.message = action.payload?.message || "Upload failed";
        state.uploadMultipleFiles.isLoading = false;
        state.uploadMultipleFiles.isError = true;
        state.uploadMultipleFiles.data = null;
      });
  },
});

export default uploadFileSlice.reducer;
