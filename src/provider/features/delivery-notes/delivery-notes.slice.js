import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deliveryNotesService from './delivery-notes.service';

const initialState = {
  addCustomer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  createHeaderBody: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  createLineItem: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  addPageStructure: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAllDeliveryNotes: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: true,
    message: ''
  },
  getSingleDeliveryNotes: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateDeliveryNotes: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getDeliveryNotesHistory: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  bookAnDeliveryNotes: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  deliveryNotesRejection: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  uploadDeliveryNotesFiles: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  addDeliveryNotesTemplate: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const addCustomer = createAsyncThunk(
  '/deliveryNotes/addCustomer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesService.addCustomer(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createHeaderBody = createAsyncThunk(
  '/deliveryNotes/createHeaderBody',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesService.createHeaderBody(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createLineItem = createAsyncThunk(
  '/deliveryNotes/createLineItem',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesService.createLineItem(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const addPageStructure = createAsyncThunk(
  '/deliveryNotes/addPageStructure',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesService.addPageStructure(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllDeliveryNotes = createAsyncThunk(
  '/deliveryNotes/getAllDeliveryNotes',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesService.getAllDeliveryNotes(payload);
      if (response.Succeeded) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getSingleDeliveryNotes = createAsyncThunk(
  '/deliveryNotes/getSingleDeliveryNotes',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await deliveryNotesService.getSingleDeliveryNotes(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateDeliveryNotes = createAsyncThunk(
  '/deliveryNotes/updateDeliveryNotes',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesService.updateDeliveryNotes(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteDeliveryNotes = createAsyncThunk(
  '/deliveryNotes/deleteDeliveryNotes',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await deliveryNotesService.deleteDeliveryNotes(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getDeliveryNotesHistory = createAsyncThunk(
  '/deliveryNotes/getDeliveryNotesHistory',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await deliveryNotesService.getDeliveryNotesHistory(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const bookAnDeliveryNotes = createAsyncThunk(
  '/deliveryNotes/bookAnDeliveryNotes',
  async ({ payload, deliveryNotesTemplateId }, thunkAPI) => {
    try {
      const response = await deliveryNotesService.bookAnDeliveryNotes(
        payload,
        deliveryNotesTemplateId
      );
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deliveryNotesRejection = createAsyncThunk(
  '/deliveryNotes/deliveryNotesRejection',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await deliveryNotesService.deliveryNotesRejection(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const addDeliveryNotesTemplate = createAsyncThunk(
  '/deliveryNotes/addDeliveryNotesTemplate',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesService.addDeliveryNotesTemplate(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const saveAsDraft = createAsyncThunk(
  '/deliveryNotes/saveAsDraft',
  async ({ templateId, id }, thunkAPI) => {
    try {
      const response = await deliveryNotesService.saveAsDraft(templateId, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const uploadDeliveryNotesFiles = createAsyncThunk(
  '/deliveryNotes/uploadFiles',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryNotesService.uploadFiles({ payload });
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deliveryNotesSlice = createSlice({
  name: 'deliveryNotes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCustomer.pending, (state) => {
        state.addCustomer.isLoading = true;
        state.addCustomer.message = '';
        state.addCustomer.isError = false;
        state.addCustomer.isSuccess = false;
        state.addCustomer.data = null;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.addCustomer.isLoading = false;
        state.addCustomer.isSuccess = true;
        state.addCustomer.data = action.payload;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.addCustomer.message = action.payload.message;
        state.addCustomer.isLoading = false;
        state.addCustomer.isError = true;
        state.addCustomer.data = null;
      })
      .addCase(createHeaderBody.pending, (state) => {
        state.createHeaderBody.isLoading = true;
        state.createHeaderBody.message = '';
        state.createHeaderBody.isError = false;
        state.createHeaderBody.isSuccess = false;
        state.createHeaderBody.data = null;
      })
      .addCase(createHeaderBody.fulfilled, (state, action) => {
        state.createHeaderBody.isLoading = false;
        state.createHeaderBody.isSuccess = true;
        state.createHeaderBody.data = action.payload;
      })
      .addCase(createHeaderBody.rejected, (state, action) => {
        state.createHeaderBody.message = action.payload.message;
        state.createHeaderBody.isLoading = false;
        state.createHeaderBody.isError = true;
        state.createHeaderBody.data = null;
      })
      .addCase(createLineItem.pending, (state) => {
        state.createLineItem.isLoading = true;
        state.createLineItem.message = '';
        state.createLineItem.isError = false;
        state.createLineItem.isSuccess = false;
        state.createLineItem.data = null;
      })
      .addCase(createLineItem.fulfilled, (state, action) => {
        state.createLineItem.isLoading = false;
        state.createLineItem.isSuccess = true;
        state.createLineItem.data = action.payload;
      })
      .addCase(createLineItem.rejected, (state, action) => {
        state.createLineItem.message = action.payload.message;
        state.createLineItem.isLoading = false;
        state.createLineItem.isError = true;
        state.createLineItem.data = null;
      })
      .addCase(addPageStructure.pending, (state) => {
        state.addPageStructure.isLoading = true;
        state.addPageStructure.message = '';
        state.addPageStructure.isError = false;
        state.addPageStructure.isSuccess = false;
        state.addPageStructure.data = null;
      })
      .addCase(addPageStructure.fulfilled, (state, action) => {
        state.addPageStructure.isLoading = false;
        state.addPageStructure.isSuccess = true;
        state.addPageStructure.data = action.payload;
      })
      .addCase(addPageStructure.rejected, (state, action) => {
        state.addPageStructure.message = action.payload.message;
        state.addPageStructure.isLoading = false;
        state.addPageStructure.isError = true;
        state.addPageStructure.data = null;
      })
      .addCase(getAllDeliveryNotes.pending, (state) => {
        state.getAllDeliveryNotes.isLoading = true;
        state.getAllDeliveryNotes.message = '';
        state.getAllDeliveryNotes.isError = false;
        state.getAllDeliveryNotes.isSuccess = false;
        state.getAllDeliveryNotes.data = null;
      })
      .addCase(getAllDeliveryNotes.fulfilled, (state, action) => {
        state.getAllDeliveryNotes.isLoading = false;
        state.getAllDeliveryNotes.isSuccess = true;
        state.getAllDeliveryNotes.data = action.payload;
      })
      .addCase(getAllDeliveryNotes.rejected, (state, action) => {
        state.getAllDeliveryNotes.message = action.payload.message;
        state.getAllDeliveryNotes.isLoading = false;
        state.getAllDeliveryNotes.isError = true;
        state.getAllDeliveryNotes.data = null;
      })
      .addCase(getSingleDeliveryNotes.pending, (state) => {
        state.getSingleDeliveryNotes.isLoading = true;
        state.getSingleDeliveryNotes.message = '';
        state.getSingleDeliveryNotes.isError = false;
        state.getSingleDeliveryNotes.isSuccess = false;
        state.getSingleDeliveryNotes.data = null;
      })
      .addCase(getSingleDeliveryNotes.fulfilled, (state, action) => {
        state.getSingleDeliveryNotes.isLoading = false;
        state.getSingleDeliveryNotes.isSuccess = true;
        state.getSingleDeliveryNotes.data = action.payload;
      })
      .addCase(getSingleDeliveryNotes.rejected, (state, action) => {
        state.getSingleDeliveryNotes.message = action.payload.message;
        state.getSingleDeliveryNotes.isLoading = false;
        state.getSingleDeliveryNotes.isError = true;
        state.getSingleDeliveryNotes.data = null;
      })
      .addCase(updateDeliveryNotes.pending, (state) => {
        state.updateDeliveryNotes.isLoading = true;
        state.updateDeliveryNotes.message = '';
        state.updateDeliveryNotes.isError = false;
        state.updateDeliveryNotes.isSuccess = false;
        state.updateDeliveryNotes.data = null;
      })
      .addCase(updateDeliveryNotes.fulfilled, (state, action) => {
        state.updateDeliveryNotes.isLoading = false;
        state.updateDeliveryNotes.isSuccess = true;
        state.updateDeliveryNotes.data = action.payload;
      })
      .addCase(updateDeliveryNotes.rejected, (state, action) => {
        state.updateDeliveryNotes.message = action.payload.message;
        state.updateDeliveryNotes.isLoading = false;
        state.updateDeliveryNotes.isError = true;
        state.updateDeliveryNotes.data = null;
      })
      .addCase(getDeliveryNotesHistory.pending, (state) => {
        state.getDeliveryNotesHistory.isLoading = true;
        state.getDeliveryNotesHistory.message = '';
        state.getDeliveryNotesHistory.isError = false;
        state.getDeliveryNotesHistory.isSuccess = false;
        state.getDeliveryNotesHistory.data = null;
      })
      .addCase(getDeliveryNotesHistory.fulfilled, (state, action) => {
        state.getDeliveryNotesHistory.isLoading = false;
        state.getDeliveryNotesHistory.isSuccess = true;
        state.getDeliveryNotesHistory.data = action.payload;
      })
      .addCase(getDeliveryNotesHistory.rejected, (state, action) => {
        state.getDeliveryNotesHistory.message = action.payload.message;
        state.getDeliveryNotesHistory.isLoading = false;
        state.getDeliveryNotesHistory.isError = true;
        state.getDeliveryNotesHistory.data = null;
      })
      .addCase(bookAnDeliveryNotes.pending, (state) => {
        state.bookAnDeliveryNotes.isLoading = true;
        state.bookAnDeliveryNotes.message = '';
        state.bookAnDeliveryNotes.isError = false;
        state.bookAnDeliveryNotes.isSuccess = false;
        state.bookAnDeliveryNotes.data = null;
      })
      .addCase(bookAnDeliveryNotes.fulfilled, (state, action) => {
        state.bookAnDeliveryNotes.isLoading = false;
        state.bookAnDeliveryNotes.isSuccess = true;
        state.bookAnDeliveryNotes.data = action.payload;
      })
      .addCase(bookAnDeliveryNotes.rejected, (state, action) => {
        state.bookAnDeliveryNotes.message = action.payload.message;
        state.bookAnDeliveryNotes.isLoading = false;
        state.bookAnDeliveryNotes.isError = true;
        state.bookAnDeliveryNotes.data = null;
      })
      .addCase(deliveryNotesRejection.pending, (state) => {
        state.deliveryNotesRejection.isLoading = true;
        state.deliveryNotesRejection.message = '';
        state.deliveryNotesRejection.isError = false;
        state.deliveryNotesRejection.isSuccess = false;
        state.deliveryNotesRejection.data = null;
      })
      .addCase(deliveryNotesRejection.fulfilled, (state, action) => {
        state.deliveryNotesRejection.isLoading = false;
        state.deliveryNotesRejection.isSuccess = true;
        state.deliveryNotesRejection.data = action.payload;
      })
      .addCase(deliveryNotesRejection.rejected, (state, action) => {
        state.deliveryNotesRejection.message = action.payload.message;
        state.deliveryNotesRejection.isLoading = false;
        state.deliveryNotesRejection.isError = true;
        state.deliveryNotesRejection.data = null;
      })
      .addCase(addDeliveryNotesTemplate.pending, (state) => {
        state.addDeliveryNotesTemplate.isLoading = true;
        state.addDeliveryNotesTemplate.message = '';
        state.addDeliveryNotesTemplate.isError = false;
        state.addDeliveryNotesTemplate.isSuccess = false;
        state.addDeliveryNotesTemplate.data = null;
      })
      .addCase(addDeliveryNotesTemplate.fulfilled, (state, action) => {
        state.addDeliveryNotesTemplate.isLoading = false;
        state.addDeliveryNotesTemplate.isSuccess = true;
        state.addDeliveryNotesTemplate.data = action.payload;
      })
      .addCase(addDeliveryNotesTemplate.rejected, (state, action) => {
        state.addDeliveryNotesTemplate.message = action.payload.message;
        state.addDeliveryNotesTemplate.isLoading = false;
        state.addDeliveryNotesTemplate.isError = true;
        state.addDeliveryNotesTemplate.data = null;
      })
      .addCase(uploadDeliveryNotesFiles.pending, (state) => {
        state.uploadDeliveryNotesFiles.isLoading = true;
        state.uploadDeliveryNotesFiles.message = '';
        state.uploadDeliveryNotesFiles.isError = false;
        state.uploadDeliveryNotesFiles.isSuccess = false;
        state.uploadDeliveryNotesFiles.data = null;
      })
      .addCase(uploadDeliveryNotesFiles.fulfilled, (state, action) => {
        state.uploadDeliveryNotesFiles.isLoading = false;
        state.uploadDeliveryNotesFiles.isSuccess = true;
        state.uploadDeliveryNotesFiles.data = action.payload;
      })
      .addCase(uploadDeliveryNotesFiles.rejected, (state, action) => {
        state.uploadDeliveryNotesFiles.message = action.payload.message;
        state.uploadDeliveryNotesFiles.isLoading = false;
        state.uploadDeliveryNotesFiles.isError = true;
        state.uploadDeliveryNotesFiles.data = null;
      });
  }
});

export default deliveryNotesSlice.reducer;
