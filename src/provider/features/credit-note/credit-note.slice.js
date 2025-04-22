import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import creditNoteService from './credit-note.service';
import config from '@/provider/features/credit-note/credit-note.config';

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
  getAllCreditNotes: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: true,
    message: ''
  },
  getSingleCreditNote: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateCreditNote: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getCreditNoteHistory: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  bookAnCreditNote: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  creditNoteRejection: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  addCreditNoteTemplate: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  uploadCreditNoteFiles: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  isTemplateSelected: false
};

export const addCustomer = createAsyncThunk(
  '/credit-note/addCustomer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteService.addCustomer(payload);
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
  '/credit-note/createHeaderBody',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteService.createHeaderBody(payload);
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
  '/credit-note/createLineItem',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteService.createLineItem(payload);
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
  '/credit-note/addPageStructure',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteService.addPageStructure(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllCreditNotes = createAsyncThunk(
  '/credit-note/getAll',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteService.getAllCreditNotes(payload);
      if (response.Succeeded) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getSingleCreditNote = createAsyncThunk(
  '/credit-note/getSingle',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await creditNoteService.getSingleCreditNote(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateCreditNote = createAsyncThunk(
  '/credit-note/update',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteService.updateCreditNote(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteCreditNote = createAsyncThunk(
  '/credit-note/delete',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await creditNoteService.deleteCreditNote(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getCreditNoteHistory = createAsyncThunk(
  '/credit-note/getHistory',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await creditNoteService.getCreditNoteHistory(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const bookAnCreditNote = createAsyncThunk(
  '/credit-note/book',
  async ({ payload, creditNoteTemplateId }, thunkAPI) => {
    try {
      const response = await creditNoteService.bookAnCreditNote(
        payload,
        creditNoteTemplateId
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

export const saveAsDraft = createAsyncThunk(
  '/credit-note/saveAsDraft',
  async ({ templateId, id }, thunkAPI) => {
    try {
      const response = await creditNoteService.saveAsDraft(templateId, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const creditNoteRejection = createAsyncThunk(
  '/credit-note/rejection',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await creditNoteService.creditNoteRejection({ payload });
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const addCreditNoteTemplate = createAsyncThunk(
  '/credit-note/addTemplate',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteService.addCreditNoteTemplate(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const uploadCreditNoteFiles = createAsyncThunk(
  '/credit-note/uploadFiles',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await creditNoteService.uploadFiles({ payload });
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const creditNoteSlice = createSlice({
  name: config.name,
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
      .addCase(getAllCreditNotes.pending, (state) => {
        state.getAllCreditNotes.isLoading = true;
        state.getAllCreditNotes.message = '';
        state.getAllCreditNotes.isError = false;
        state.getAllCreditNotes.isSuccess = false;
        state.getAllCreditNotes.data = null;
      })
      .addCase(getAllCreditNotes.fulfilled, (state, action) => {
        state.getAllCreditNotes.isLoading = false;
        state.getAllCreditNotes.isSuccess = true;
        state.getAllCreditNotes.data = action.payload;
      })
      .addCase(getAllCreditNotes.rejected, (state, action) => {
        state.getAllCreditNotes.message = action.payload.message;
        state.getAllCreditNotes.isLoading = false;
        state.getAllCreditNotes.isError = true;
        state.getAllCreditNotes.data = null;
      })
      .addCase(getSingleCreditNote.pending, (state) => {
        state.getSingleCreditNote.isLoading = true;
        state.getSingleCreditNote.message = '';
        state.getSingleCreditNote.isError = false;
        state.getSingleCreditNote.isSuccess = false;
        state.getSingleCreditNote.data = null;
      })
      .addCase(getSingleCreditNote.fulfilled, (state, action) => {
        state.getSingleCreditNote.isLoading = false;
        state.getSingleCreditNote.isSuccess = true;
        state.getSingleCreditNote.data = action.payload;
      })
      .addCase(getSingleCreditNote.rejected, (state, action) => {
        state.getSingleCreditNote.message = action.payload.message;
        state.getSingleCreditNote.isLoading = false;
        state.getSingleCreditNote.isError = true;
        state.getSingleCreditNote.data = null;
      })
      .addCase(updateCreditNote.pending, (state) => {
        state.updateCreditNote.isLoading = true;
        state.updateCreditNote.message = '';
        state.updateCreditNote.isError = false;
        state.updateCreditNote.isSuccess = false;
        state.updateCreditNote.data = null;
      })
      .addCase(updateCreditNote.fulfilled, (state, action) => {
        state.updateCreditNote.isLoading = false;
        state.updateCreditNote.isSuccess = true;
        state.updateCreditNote.data = action.payload;
      })
      .addCase(updateCreditNote.rejected, (state, action) => {
        state.updateCreditNote.message = action.payload.message;
        state.updateCreditNote.isLoading = false;
        state.updateCreditNote.isError = true;
        state.updateCreditNote.data = null;
      })
      .addCase(getCreditNoteHistory.pending, (state) => {
        state.getCreditNoteHistory.isLoading = true;
        state.getCreditNoteHistory.message = '';
        state.getCreditNoteHistory.isError = false;
        state.getCreditNoteHistory.isSuccess = false;
        state.getCreditNoteHistory.data = null;
      })
      .addCase(getCreditNoteHistory.fulfilled, (state, action) => {
        state.getCreditNoteHistory.isLoading = false;
        state.getCreditNoteHistory.isSuccess = true;
        state.getCreditNoteHistory.data = action.payload;
      })
      .addCase(getCreditNoteHistory.rejected, (state, action) => {
        state.getCreditNoteHistory.message = action.payload.message;
        state.getCreditNoteHistory.isLoading = false;
        state.getCreditNoteHistory.isError = true;
        state.getCreditNoteHistory.data = null;
      })
      .addCase(bookAnCreditNote.pending, (state) => {
        state.bookAnCreditNote.isLoading = true;
        state.bookAnCreditNote.message = '';
        state.bookAnCreditNote.isError = false;
        state.bookAnCreditNote.isSuccess = false;
        state.bookAnCreditNote.data = null;
      })
      .addCase(bookAnCreditNote.fulfilled, (state, action) => {
        state.bookAnCreditNote.isLoading = false;
        state.bookAnCreditNote.isSuccess = true;
        state.bookAnCreditNote.data = action.payload;
      })
      .addCase(bookAnCreditNote.rejected, (state, action) => {
        state.bookAnCreditNote.message = action.payload.message;
        state.bookAnCreditNote.isLoading = false;
        state.bookAnCreditNote.isError = true;
        state.bookAnCreditNote.data = null;
      })
      .addCase(creditNoteRejection.pending, (state) => {
        state.creditNoteRejection.isLoading = true;
        state.creditNoteRejection.message = '';
        state.creditNoteRejection.isError = false;
        state.creditNoteRejection.isSuccess = false;
        state.creditNoteRejection.data = null;
      })
      .addCase(creditNoteRejection.fulfilled, (state, action) => {
        state.creditNoteRejection.isLoading = false;
        state.creditNoteRejection.isSuccess = true;
        state.creditNoteRejection.data = action.payload;
      })
      .addCase(creditNoteRejection.rejected, (state, action) => {
        state.creditNoteRejection.message = action.payload.message;
        state.creditNoteRejection.isLoading = false;
        state.creditNoteRejection.isError = true;
        state.creditNoteRejection.data = null;
      })
      .addCase(addCreditNoteTemplate.pending, (state) => {
        state.addCreditNoteTemplate.isLoading = true;
        state.addCreditNoteTemplate.message = '';
        state.addCreditNoteTemplate.isError = false;
        state.addCreditNoteTemplate.isSuccess = false;
        state.addCreditNoteTemplate.data = null;
      })
      .addCase(addCreditNoteTemplate.fulfilled, (state, action) => {
        state.addCreditNoteTemplate.isLoading = false;
        state.addCreditNoteTemplate.isSuccess = true;
        state.addCreditNoteTemplate.data = action.payload;
      })
      .addCase(addCreditNoteTemplate.rejected, (state, action) => {
        state.addCreditNoteTemplate.message = action.payload.message;
        state.addCreditNoteTemplate.isLoading = false;
        state.addCreditNoteTemplate.isError = true;
        state.addCreditNoteTemplate.data = null;
      })
      .addCase(uploadCreditNoteFiles.pending, (state) => {
        state.uploadCreditNoteFiles.isLoading = true;
        state.uploadCreditNoteFiles.message = '';
        state.uploadCreditNoteFiles.isError = false;
        state.uploadCreditNoteFiles.isSuccess = false;
        state.uploadCreditNoteFiles.data = null;
      })
      .addCase(uploadCreditNoteFiles.fulfilled, (state, action) => {
        state.uploadCreditNoteFiles.isLoading = false;
        state.uploadCreditNoteFiles.isSuccess = true;
        state.uploadCreditNoteFiles.data = action.payload;
      })
      .addCase(uploadCreditNoteFiles.rejected, (state, action) => {
        state.uploadCreditNoteFiles.message = action.payload.message;
        state.uploadCreditNoteFiles.isLoading = false;
        state.uploadCreditNoteFiles.isError = true;
        state.uploadCreditNoteFiles.data = null;
      });
  }
});

export default creditNoteSlice.reducer;
