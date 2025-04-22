import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import invoiceService from './invoice.service';

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
  getAllInvoice: {
    data: null,
    isError: false,
    isSuccess: true,
    isLoading: false,
    message: ''
  },
  getSingleInvoice: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateInvoice: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getInvoiceHistory: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  bookAnInvoice: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  invoiceRejection: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  uploadInvoiceFiles: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  addInvoiceTemplate: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const addCustomer = createAsyncThunk(
  '/invoice/addCustomer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await invoiceService.addCustomer(payload);
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
  '/invoice/createHeaderBody',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await invoiceService.createHeaderBody(payload);
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
  '/invoice/createLineItem',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await invoiceService.createLineItem(payload);
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
  '/invoice/addPageStructure',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await invoiceService.addPageStructure(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllInvoice = createAsyncThunk(
  '/invoice/getAllInvoice',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await invoiceService.getAllInvoice(payload);
      if (response.Succeeded) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getSingleInvoice = createAsyncThunk(
  '/invoice/getSingleInvoice',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await invoiceService.getSingleInvoice(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateInvoice = createAsyncThunk(
  '/invoice/updateInvoice',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await invoiceService.updateInvoice(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  '/invoice/deleteInvoice',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await invoiceService.deleteInvoice(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getInvoiceHistory = createAsyncThunk(
  '/invoice/getInvoiceHistory',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await invoiceService.getInvoiceHistory(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const bookAnInvoice = createAsyncThunk(
  '/invoice/bookAnInvoice',
  async ({ payload, invoiceTemplateId }, thunkAPI) => {
    try {
      const response = await invoiceService.bookAnInvoice(payload, invoiceTemplateId);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const invoiceRejection = createAsyncThunk(
  '/invoice/invoiceRejection',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await invoiceService.invoiceRejection({ payload });
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createInvoicePayment = createAsyncThunk(
  '/invoice/createInvoicePayment',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await invoiceService.createInvoicePayment({ payload });
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getInvoicePayment = createAsyncThunk(
  '/invoice/getInvoicePayment',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await invoiceService.getInvoicePayment(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const addInvoiceTemplate = createAsyncThunk(
  '/invoice/addInvoiceTemplate',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await invoiceService.addInvoiceTemplate(payload);
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
  '/invoice/saveAsDraft',
  async ({ templateId, id }, thunkAPI) => {
    try {
      const response = await invoiceService.saveAsDraft(templateId, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const uploadInvoiceFiles = createAsyncThunk(
  '/invoice/uploadInvoiceFiles',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await invoiceService.uploadFiles({ payload });
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const invoiceSlice = createSlice({
  name: 'invoice',
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
      .addCase(getAllInvoice.pending, (state) => {
        state.getAllInvoice.isLoading = true;
        state.getAllInvoice.message = '';
        state.getAllInvoice.isError = false;
        state.getAllInvoice.isSuccess = false;
        state.getAllInvoice.data = null;
      })
      .addCase(getAllInvoice.fulfilled, (state, action) => {
        state.getAllInvoice.isLoading = false;
        state.getAllInvoice.isSuccess = true;
        state.getAllInvoice.data = action.payload;
      })
      .addCase(getAllInvoice.rejected, (state, action) => {
        state.getAllInvoice.message = action.payload.message;
        state.getAllInvoice.isLoading = false;
        state.getAllInvoice.isError = true;
        state.getAllInvoice.data = null;
      })
      .addCase(getSingleInvoice.pending, (state) => {
        state.getSingleInvoice.isLoading = true;
        state.getSingleInvoice.message = '';
        state.getSingleInvoice.isError = false;
        state.getSingleInvoice.isSuccess = false;
        state.getSingleInvoice.data = null;
      })
      .addCase(getSingleInvoice.fulfilled, (state, action) => {
        state.getSingleInvoice.isLoading = false;
        state.getSingleInvoice.isSuccess = true;
        state.getSingleInvoice.data = action.payload;
      })
      .addCase(getSingleInvoice.rejected, (state, action) => {
        state.getSingleInvoice.message = action.payload.message;
        state.getSingleInvoice.isLoading = false;
        state.getSingleInvoice.isError = true;
        state.getSingleInvoice.data = null;
      })
      .addCase(updateInvoice.pending, (state) => {
        state.updateInvoice.isLoading = true;
        state.updateInvoice.message = '';
        state.updateInvoice.isError = false;
        state.updateInvoice.isSuccess = false;
        state.updateInvoice.data = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.updateInvoice.isLoading = false;
        state.updateInvoice.isSuccess = true;
        state.updateInvoice.data = action.payload;
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.updateInvoice.message = action.payload.message;
        state.updateInvoice.isLoading = false;
        state.updateInvoice.isError = true;
        state.updateInvoice.data = null;
      })
      .addCase(getInvoiceHistory.pending, (state) => {
        state.getInvoiceHistory.isLoading = true;
        state.getInvoiceHistory.message = '';
        state.getInvoiceHistory.isError = false;
        state.getInvoiceHistory.isSuccess = false;
        state.getInvoiceHistory.data = null;
      })
      .addCase(getInvoiceHistory.fulfilled, (state, action) => {
        state.getInvoiceHistory.isLoading = false;
        state.getInvoiceHistory.isSuccess = true;
        state.getInvoiceHistory.data = action.payload;
      })
      .addCase(getInvoiceHistory.rejected, (state, action) => {
        state.getInvoiceHistory.message = action.payload.message;
        state.getInvoiceHistory.isLoading = false;
        state.getInvoiceHistory.isError = true;
        state.getInvoiceHistory.data = null;
      })
      .addCase(bookAnInvoice.pending, (state) => {
        state.bookAnInvoice.isLoading = true;
        state.bookAnInvoice.message = '';
        state.bookAnInvoice.isError = false;
        state.bookAnInvoice.isSuccess = false;
        state.bookAnInvoice.data = null;
      })
      .addCase(bookAnInvoice.fulfilled, (state, action) => {
        state.bookAnInvoice.isLoading = false;
        state.bookAnInvoice.isSuccess = true;
        state.bookAnInvoice.data = action.payload;
      })
      .addCase(bookAnInvoice.rejected, (state, action) => {
        state.bookAnInvoice.message = action.payload.message;
        state.bookAnInvoice.isLoading = false;
        state.bookAnInvoice.isError = true;
        state.bookAnInvoice.data = null;
      })
      .addCase(invoiceRejection.pending, (state) => {
        state.invoiceRejection.isLoading = true;
        state.invoiceRejection.message = '';
        state.invoiceRejection.isError = false;
        state.invoiceRejection.isSuccess = false;
        state.invoiceRejection.data = null;
      })
      .addCase(invoiceRejection.fulfilled, (state, action) => {
        state.invoiceRejection.isLoading = false;
        state.invoiceRejection.isSuccess = true;
        state.invoiceRejection.data = action.payload;
      })
      .addCase(invoiceRejection.rejected, (state, action) => {
        state.invoiceRejection.message = action.payload.message;
        state.invoiceRejection.isLoading = false;
        state.invoiceRejection.isError = true;
        state.invoiceRejection.data = null;
      })
      .addCase(addInvoiceTemplate.pending, (state) => {
        state.addInvoiceTemplate.isLoading = true;
        state.addInvoiceTemplate.message = '';
        state.addInvoiceTemplate.isError = false;
        state.addInvoiceTemplate.isSuccess = false;
        state.addInvoiceTemplate.data = null;
      })
      .addCase(addInvoiceTemplate.fulfilled, (state, action) => {
        state.addInvoiceTemplate.isLoading = false;
        state.addInvoiceTemplate.isSuccess = true;
        state.addInvoiceTemplate.data = action.payload;
      })
      .addCase(addInvoiceTemplate.rejected, (state, action) => {
        state.addInvoiceTemplate.message = action.payload.message;
        state.addInvoiceTemplate.isLoading = false;
        state.addInvoiceTemplate.isError = true;
        state.addInvoiceTemplate.data = null;
      })
      .addCase(uploadInvoiceFiles.pending, (state) => {
        state.uploadInvoiceFiles.isLoading = true;
        state.uploadInvoiceFiles.message = '';
        state.uploadInvoiceFiles.isError = false;
        state.uploadInvoiceFiles.isSuccess = false;
        state.uploadInvoiceFiles.data = null;
      })
      .addCase(uploadInvoiceFiles.fulfilled, (state, action) => {
        state.uploadInvoiceFiles.isLoading = false;
        state.uploadInvoiceFiles.isSuccess = true;
        state.uploadInvoiceFiles.data = action.payload;
      })
      .addCase(uploadInvoiceFiles.rejected, (state, action) => {
        state.uploadInvoiceFiles.message = action.payload.message;
        state.uploadInvoiceFiles.isLoading = false;
        state.uploadInvoiceFiles.isError = true;
        state.uploadInvoiceFiles.data = null;
      });
  }
});

export default invoiceSlice.reducer;
