import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import offerService from './offer.service';

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
  getAllOffers: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: true,
    message: ''
  },
  getSingleOffer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateOffer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getOfferHistory: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  bookAnOffer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  offerRejection: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  addOfferTemplate: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  uploadOfferFiles: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  isTemplateSelected: false
};

export const addCustomer = createAsyncThunk(
  '/offer/addCustomer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerService.addCustomer(payload);
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
  '/offer/createHeaderBody',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerService.createHeaderBody(payload);
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
  '/offer/createLineItem',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerService.createLineItem(payload);
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
  '/offer/addPageStructure',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerService.addPageStructure(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllOffers = createAsyncThunk(
  '/offer/getAllOffers',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerService.getAllOffers(payload);
      if (response.Succeeded) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getSingleOffer = createAsyncThunk(
  '/offer/getSingleOffer',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await offerService.getSingleOffer(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateOffer = createAsyncThunk(
  '/offer/updateOffer',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerService.updateOffer(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteOffer = createAsyncThunk(
  '/offer/deleteOffer',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await offerService.deleteOffer(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getOfferHistory = createAsyncThunk(
  '/offer/getOfferHistory',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await offerService.getOfferHistory(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const bookAnOffer = createAsyncThunk(
  '/offer/bookAnOffer',
  async ({ payload, offerTemplateId }, thunkAPI) => {
    try {
      const response = await offerService.bookAnOffer(payload, offerTemplateId);
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
  '/offer/saveAsDraft',
  async ({ templateId, id }, thunkAPI) => {
    try {
      const response = await offerService.saveAsDraft(templateId, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const offerRejection = createAsyncThunk(
  '/offer/offerRejection',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await offerService.offerRejection({ payload });
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const addOfferTemplate = createAsyncThunk(
  '/offer/addOfferTemplate',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerService.addOfferTemplate(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const uploadOfferFiles = createAsyncThunk(
  '/offer/uploadFiles',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await offerService.uploadFiles({ payload });
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const offerSlice = createSlice({
  name: 'offer',
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
      .addCase(getAllOffers.pending, (state) => {
        state.getAllOffers.isLoading = true;
        state.getAllOffers.message = '';
        state.getAllOffers.isError = false;
        state.getAllOffers.isSuccess = false;
        state.getAllOffers.data = null;
      })
      .addCase(getAllOffers.fulfilled, (state, action) => {
        state.getAllOffers.isLoading = false;
        state.getAllOffers.isSuccess = true;
        state.getAllOffers.data = action.payload;
      })
      .addCase(getAllOffers.rejected, (state, action) => {
        state.getAllOffers.message = action.payload.message;
        state.getAllOffers.isLoading = false;
        state.getAllOffers.isError = true;
        state.getAllOffers.data = null;
      })
      .addCase(getSingleOffer.pending, (state) => {
        state.getSingleOffer.isLoading = true;
        state.getSingleOffer.message = '';
        state.getSingleOffer.isError = false;
        state.getSingleOffer.isSuccess = false;
        state.getSingleOffer.data = null;
      })
      .addCase(getSingleOffer.fulfilled, (state, action) => {
        state.getSingleOffer.isLoading = false;
        state.getSingleOffer.isSuccess = true;
        state.getSingleOffer.data = action.payload;
      })
      .addCase(getSingleOffer.rejected, (state, action) => {
        state.getSingleOffer.message = action.payload.message;
        state.getSingleOffer.isLoading = false;
        state.getSingleOffer.isError = true;
        state.getSingleOffer.data = null;
      })
      .addCase(updateOffer.pending, (state) => {
        state.updateOffer.isLoading = true;
        state.updateOffer.message = '';
        state.updateOffer.isError = false;
        state.updateOffer.isSuccess = false;
        state.updateOffer.data = null;
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        state.updateOffer.isLoading = false;
        state.updateOffer.isSuccess = true;
        state.updateOffer.data = action.payload;
      })
      .addCase(updateOffer.rejected, (state, action) => {
        state.updateOffer.message = action.payload.message;
        state.updateOffer.isLoading = false;
        state.updateOffer.isError = true;
        state.updateOffer.data = null;
      })
      .addCase(getOfferHistory.pending, (state) => {
        state.getOfferHistory.isLoading = true;
        state.getOfferHistory.message = '';
        state.getOfferHistory.isError = false;
        state.getOfferHistory.isSuccess = false;
        state.getOfferHistory.data = null;
      })
      .addCase(getOfferHistory.fulfilled, (state, action) => {
        state.getOfferHistory.isLoading = false;
        state.getOfferHistory.isSuccess = true;
        state.getOfferHistory.data = action.payload;
      })
      .addCase(getOfferHistory.rejected, (state, action) => {
        state.getOfferHistory.message = action.payload.message;
        state.getOfferHistory.isLoading = false;
        state.getOfferHistory.isError = true;
        state.getOfferHistory.data = null;
      })
      .addCase(bookAnOffer.pending, (state) => {
        state.bookAnOffer.isLoading = true;
        state.bookAnOffer.message = '';
        state.bookAnOffer.isError = false;
        state.bookAnOffer.isSuccess = false;
        state.bookAnOffer.data = null;
      })
      .addCase(bookAnOffer.fulfilled, (state, action) => {
        state.bookAnOffer.isLoading = false;
        state.bookAnOffer.isSuccess = true;
        state.bookAnOffer.data = action.payload;
      })
      .addCase(bookAnOffer.rejected, (state, action) => {
        state.bookAnOffer.message = action.payload.message;
        state.bookAnOffer.isLoading = false;
        state.bookAnOffer.isError = true;
        state.bookAnOffer.data = null;
      })
      .addCase(offerRejection.pending, (state) => {
        state.offerRejection.isLoading = true;
        state.offerRejection.message = '';
        state.offerRejection.isError = false;
        state.offerRejection.isSuccess = false;
        state.offerRejection.data = null;
      })
      .addCase(offerRejection.fulfilled, (state, action) => {
        state.offerRejection.isLoading = false;
        state.offerRejection.isSuccess = true;
        state.offerRejection.data = action.payload;
      })
      .addCase(offerRejection.rejected, (state, action) => {
        state.offerRejection.message = action.payload.message;
        state.offerRejection.isLoading = false;
        state.offerRejection.isError = true;
        state.offerRejection.data = null;
      })
      .addCase(addOfferTemplate.pending, (state) => {
        state.addOfferTemplate.isLoading = true;
        state.addOfferTemplate.message = '';
        state.addOfferTemplate.isError = false;
        state.addOfferTemplate.isSuccess = false;
        state.addOfferTemplate.data = null;
      })
      .addCase(addOfferTemplate.fulfilled, (state, action) => {
        state.addOfferTemplate.isLoading = false;
        state.addOfferTemplate.isSuccess = true;
        state.addOfferTemplate.data = action.payload;
      })
      .addCase(addOfferTemplate.rejected, (state, action) => {
        state.addOfferTemplate.message = action.payload.message;
        state.addOfferTemplate.isLoading = false;
        state.addOfferTemplate.isError = true;
        state.addOfferTemplate.data = null;
      })
      .addCase(uploadOfferFiles.pending, (state) => {
        state.uploadOfferFiles.isLoading = true;
        state.uploadOfferFiles.message = '';
        state.uploadOfferFiles.isError = false;
        state.uploadOfferFiles.isSuccess = false;
        state.uploadOfferFiles.data = null;
      })
      .addCase(uploadOfferFiles.fulfilled, (state, action) => {
        state.uploadOfferFiles.isLoading = false;
        state.uploadOfferFiles.isSuccess = true;
        state.uploadOfferFiles.data = action.payload;
      })
      .addCase(uploadOfferFiles.rejected, (state, action) => {
        state.uploadOfferFiles.message = action.payload.message;
        state.uploadOfferFiles.isLoading = false;
        state.uploadOfferFiles.isError = true;
        state.uploadOfferFiles.data = null;
      });
  }
});

export default offerSlice.reducer;
