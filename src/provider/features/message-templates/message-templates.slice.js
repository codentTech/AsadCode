import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import messageTemplatesService from "./message-templates.service";

const initialState = {
  templates: [],
  createTemplate: {
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
  getAllTemplates: {
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
  updateTemplate: {
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
  deleteTemplate: {
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
};

export const createTemplate = createAsyncThunk(
  "messageTemplates/createTemplate",
  async (templateData, thunkAPI) => {
    try {
      const response = await messageTemplatesService.createTemplate(templateData);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: "Failed to create template" }
      );
    }
  }
);

export const getAllTemplates = createAsyncThunk(
  "messageTemplates/getAllTemplates",
  async (_, thunkAPI) => {
    try {
      const response = await messageTemplatesService.getAllTemplates();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: "Failed to fetch templates" }
      );
    }
  }
);

export const updateTemplate = createAsyncThunk(
  "messageTemplates/updateTemplate",
  async ({ templateId, templateData }, thunkAPI) => {
    try {
      const response = await messageTemplatesService.updateTemplate(templateId, templateData);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: "Failed to update template" }
      );
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  "messageTemplates/deleteTemplate",
  async (templateId, thunkAPI) => {
    try {
      const response = await messageTemplatesService.deleteTemplate(templateId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: "Failed to delete template" }
      );
    }
  }
);

const messageTemplatesSlice = createSlice({
  name: "messageTemplates",
  initialState,
  reducers: {
    clearTemplates: (state) => {
      state.templates = [];
    },
  },
  extraReducers: (builder) => {
    // Create Template
    builder
      .addCase(createTemplate.pending, (state) => {
        state.createTemplate.isLoading = true;
        state.createTemplate.isSuccess = false;
        state.createTemplate.isError = false;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.createTemplate.isLoading = false;
        state.createTemplate.isSuccess = true;
        state.createTemplate.data = action.payload.data;
        // Add to templates list
        if (action.payload.data) {
          state.templates.unshift(action.payload.data);
        }
      })
      .addCase(createTemplate.rejected, (state) => {
        state.createTemplate.isLoading = false;
        state.createTemplate.isError = true;
      });

    // Get All Templates
    builder
      .addCase(getAllTemplates.pending, (state) => {
        state.getAllTemplates.isLoading = true;
        state.getAllTemplates.isSuccess = false;
        state.getAllTemplates.isError = false;
      })
      .addCase(getAllTemplates.fulfilled, (state, action) => {
        state.getAllTemplates.isLoading = false;
        state.getAllTemplates.isSuccess = true;
        state.getAllTemplates.data = action.payload.data;
        state.templates = action.payload.data || [];
      })
      .addCase(getAllTemplates.rejected, (state) => {
        state.getAllTemplates.isLoading = false;
        state.getAllTemplates.isError = true;
      });

    // Update Template
    builder
      .addCase(updateTemplate.pending, (state) => {
        state.updateTemplate.isLoading = true;
        state.updateTemplate.isSuccess = false;
        state.updateTemplate.isError = false;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.updateTemplate.isLoading = false;
        state.updateTemplate.isSuccess = true;
        state.updateTemplate.data = action.payload.data;
        // Update in templates list
        const index = state.templates.findIndex((t) => t.id === action.payload.data.id);
        if (index !== -1) {
          state.templates[index] = action.payload.data;
        }
      })
      .addCase(updateTemplate.rejected, (state) => {
        state.updateTemplate.isLoading = false;
        state.updateTemplate.isError = true;
      });

    // Delete Template
    builder
      .addCase(deleteTemplate.pending, (state) => {
        state.deleteTemplate.isLoading = true;
        state.deleteTemplate.isSuccess = false;
        state.deleteTemplate.isError = false;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.deleteTemplate.isLoading = false;
        state.deleteTemplate.isSuccess = true;
        // Remove from templates list
        state.templates = state.templates.filter((t) => t.id !== action.meta.arg);
      })
      .addCase(deleteTemplate.rejected, (state) => {
        state.deleteTemplate.isLoading = false;
        state.deleteTemplate.isError = true;
      });
  },
});

export const { clearTemplates } = messageTemplatesSlice.actions;
export default messageTemplatesSlice.reducer;
