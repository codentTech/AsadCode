import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import templateService from './template.service';

const initialState = {
  createTemplate: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAllTemplates: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAllSimpleTemplates: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAllStandardTemplates: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  deleteTemplate: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getSingleTemplate: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateTemplate: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createTemplate = createAsyncThunk(
  'template/createTemplate',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await templateService.createTemplate(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllTemplates = createAsyncThunk(
  'template/getAllTemplates',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await templateService.getAllTemplates(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllSimpleTemplates = createAsyncThunk(
  'template/getAllSimpleTemplates',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await templateService.getAllTemplates(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllStandardTemplates = createAsyncThunk(
  'template/getAllStandardTemplates',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await templateService.getAllTemplates(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getSingleTemplate = createAsyncThunk(
  'template/getSingleTemplate',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await templateService.getSingleTemplate(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  'template/deleteTemplate',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await templateService.deleteTemplate(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateTemplate = createAsyncThunk(
  'template/updateTemplate',
  async ({ payload: { id, data } }, thunkAPI) => {
    try {
      const response = await templateService.updateTemplate(id, data);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTemplate.pending, (state) => {
        state.createTemplate.isLoading = true;
        state.createTemplate.message = '';
        state.createTemplate.isError = false;
        state.createTemplate.isSuccess = false;
        state.createTemplate.data = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.createTemplate.isLoading = false;
        state.createTemplate.isSuccess = true;
        state.createTemplate.data = action.payload;
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.createTemplate.message = action.payload.message;
        state.createTemplate.isLoading = false;
        state.createTemplate.isError = true;
        state.createTemplate.data = null;
      })
      .addCase(getAllTemplates.pending, (state) => {
        state.getAllTemplates.isLoading = true;
        state.getAllTemplates.message = '';
        state.getAllTemplates.isError = false;
        state.getAllTemplates.isSuccess = false;
        state.getAllTemplates.data = null;
      })
      .addCase(getAllTemplates.fulfilled, (state, action) => {
        state.getAllTemplates.isLoading = false;
        state.getAllTemplates.isSuccess = true;
        state.getAllTemplates.data = action.payload;
      })
      .addCase(getAllTemplates.rejected, (state, action) => {
        state.getAllTemplates.message = action.payload.message;
        state.getAllTemplates.isLoading = false;
        state.getAllTemplates.isError = true;
        state.getAllTemplates.data = null;
      })
      .addCase(getAllSimpleTemplates.pending, (state) => {
        state.getAllSimpleTemplates.isLoading = true;
        state.getAllSimpleTemplates.message = '';
        state.getAllSimpleTemplates.isError = false;
        state.getAllSimpleTemplates.isSuccess = false;
        state.getAllSimpleTemplates.data = null;
      })
      .addCase(getAllSimpleTemplates.fulfilled, (state, action) => {
        state.getAllSimpleTemplates.isLoading = false;
        state.getAllSimpleTemplates.isSuccess = true;
        state.getAllSimpleTemplates.data = action.payload;
      })
      .addCase(getAllSimpleTemplates.rejected, (state, action) => {
        state.getAllSimpleTemplates.message = action.payload.message;
        state.getAllSimpleTemplates.isLoading = false;
        state.getAllSimpleTemplates.isError = true;
        state.getAllSimpleTemplates.data = null;
      })
      .addCase(getAllStandardTemplates.pending, (state) => {
        state.getAllStandardTemplates.isLoading = true;
        state.getAllStandardTemplates.message = '';
        state.getAllStandardTemplates.isError = false;
        state.getAllStandardTemplates.isSuccess = false;
        state.getAllStandardTemplates.data = null;
      })
      .addCase(getAllStandardTemplates.fulfilled, (state, action) => {
        state.getAllStandardTemplates.isLoading = false;
        state.getAllStandardTemplates.isSuccess = true;
        state.getAllStandardTemplates.data = action.payload;
      })
      .addCase(getAllStandardTemplates.rejected, (state, action) => {
        state.getAllStandardTemplates.message = action.payload.message;
        state.getAllStandardTemplates.isLoading = false;
        state.getAllStandardTemplates.isError = true;
        state.getAllStandardTemplates.data = null;
      })
      .addCase(getSingleTemplate.pending, (state) => {
        state.getSingleTemplate.isLoading = true;
        state.getSingleTemplate.message = '';
        state.getSingleTemplate.isError = false;
        state.getSingleTemplate.isSuccess = false;
        state.getSingleTemplate.data = null;
      })
      .addCase(getSingleTemplate.fulfilled, (state, action) => {
        state.getSingleTemplate.isLoading = false;
        state.getSingleTemplate.isSuccess = true;
        state.getSingleTemplate.data = action.payload;
      })
      .addCase(getSingleTemplate.rejected, (state, action) => {
        state.message = action.payload.message;
        state.getSingleTemplate.isLoading = false;
        state.getSingleTemplate.isError = true;
        state.getSingleTemplate.data = null;
      })
      .addCase(deleteTemplate.pending, (state) => {
        state.deleteTemplate.isLoading = true;
        state.deleteTemplate.message = '';
        state.deleteTemplate.isError = false;
        state.deleteTemplate.isSuccess = false;
        state.deleteTemplate.data = null;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.deleteTemplate.isLoading = false;
        state.deleteTemplate.isSuccess = true;
        state.deleteTemplate.data = action.payload;
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.deleteTemplate.message = action.payload.message;
        state.deleteTemplate.isLoading = false;
        state.deleteTemplate.isError = true;
        state.deleteTemplate.data = null;
      })
      .addCase(updateTemplate.pending, (state) => {
        state.updateTemplate.isLoading = true;
        state.updateTemplate.message = '';
        state.updateTemplate.isError = false;
        state.updateTemplate.isSuccess = false;
        state.updateTemplate.data = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.updateTemplate.isLoading = false;
        state.updateTemplate.isSuccess = true;
        state.updateTemplate.data = action.payload;
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.updateTemplate.message = action.payload.message;
        state.updateTemplate.isLoading = false;
        state.updateTemplate.isError = true;
        state.updateTemplate.data = null;
      });
  }
});

export default templateSlice.reducer;
