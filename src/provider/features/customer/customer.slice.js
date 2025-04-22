import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import customerService from './customer.service';

const initialState = {
  createPersonalDetail: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  createAccountDetail: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  createDiscount: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  createCompanyDetail: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  createCustomerTermOfPaymentAndDelivey: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  update: { data: null, isError: false, isSuccess: false, isLoading: false, message: '' },
  getSingle: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: true,
    message: ''
  },
  duplicateCustomer: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: true,
    message: ''
  },
  getAll: { data: null, isError: false, isSuccess: false, isLoading: true, message: '' },
  delete: { data: null, isError: false, isSuccess: false, isLoading: true, message: '' },
  uploadCustomerFiles: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createCustomerPersonalDetail = createAsyncThunk(
  'customer/createPersonalDetail',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await customerService.createCustomerPersonalDetail(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createCustomerAccountDetail = createAsyncThunk(
  'customer/createAccountDetail',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await customerService.createCustomerAccountDetail(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createCustomerDiscount = createAsyncThunk(
  'customer/createDiscount',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await customerService.createCustomerDiscount(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createCustomerCompanyDetail = createAsyncThunk(
  'customer/createCompanyDetail',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await customerService.createCustomerCompanyDetail(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createCustomerTermOfPaymentAndDelivey = createAsyncThunk(
  'customer/createTermOfPaymentAndDelivey',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await customerService.createCustomerTermOfPaymentAndDelivey(
        payload
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

export const getSingleCustomer = createAsyncThunk(
  'customer/get',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await customerService.getSingleCustomer(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllCustomer = createAsyncThunk(
  'customer/getAll',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await customerService.getAllCustomer(payload);
      if (response.Succeeded) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);
export const customerDuplicate = createAsyncThunk(
  'customer/customerDuplicate',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await customerService.customerDuplicate(payload);
      if (response.Succeeded) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customer/update',
  async ({ payload: { id, data } }, thunkAPI) => {
    try {
      const response = await customerService.updateCustomer(id, data);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customer/delete',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await customerService.deleteCustomer(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const uploadCustomerFiles = createAsyncThunk(
  '/offer/uploadFiles',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await customerService.uploadFiles({ payload });
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCustomerPersonalDetail.pending, (state) => {
        state.createPersonalDetail.isLoading = true;
        state.createPersonalDetail.message = '';
        state.createPersonalDetail.isError = false;
        state.createPersonalDetail.isSuccess = false;
        state.createPersonalDetail.data = null;
      })
      .addCase(createCustomerPersonalDetail.fulfilled, (state, action) => {
        state.createPersonalDetail.isLoading = false;
        state.createPersonalDetail.isSuccess = true;
        state.createPersonalDetail.data = action.payload;
      })
      .addCase(createCustomerPersonalDetail.rejected, (state, action) => {
        state.createPersonalDetail.message = action.payload.message;
        state.createPersonalDetail.isLoading = false;
        state.createPersonalDetail.isError = true;
        state.createPersonalDetail.data = null;
      })
      .addCase(customerDuplicate.pending, (state) => {
        state.duplicateCustomer.isLoading = true;
        state.duplicateCustomer.message = '';
        state.duplicateCustomer.isError = false;
        state.duplicateCustomer.isSuccess = false;
        state.duplicateCustomer.data = null;
      })
      .addCase(customerDuplicate.fulfilled, (state, action) => {
        state.duplicateCustomer.isLoading = false;
        state.duplicateCustomer.isSuccess = true;
        state.duplicateCustomer.data = action.payload;
      })
      .addCase(customerDuplicate.rejected, (state, action) => {
        state.duplicateCustomer.message = action.payload.message;
        state.duplicateCustomer.isLoading = false;
        state.duplicateCustomer.isError = true;
        state.duplicateCustomer.data = null;
      })
      .addCase(createCustomerAccountDetail.pending, (state) => {
        state.createAccountDetail.isLoading = true;
        state.createAccountDetail.message = '';
        state.createAccountDetail.isError = false;
        state.createAccountDetail.isSuccess = false;
        state.createAccountDetail.data = null;
      })
      .addCase(createCustomerAccountDetail.fulfilled, (state, action) => {
        state.createAccountDetail.isLoading = false;
        state.createAccountDetail.isSuccess = true;
        state.createAccountDetail.data = action.payload;
      })
      .addCase(createCustomerAccountDetail.rejected, (state, action) => {
        state.createAccountDetail.message = action.payload.message;
        state.createAccountDetail.isLoading = false;
        state.createAccountDetail.isError = true;
        state.createAccountDetail.data = null;
      })
      .addCase(createCustomerCompanyDetail.pending, (state) => {
        state.createCompanyDetail.isLoading = true;
        state.createCompanyDetail.message = '';
        state.createCompanyDetail.isError = false;
        state.createCompanyDetail.isSuccess = false;
        state.createCompanyDetail.data = null;
      })
      .addCase(createCustomerCompanyDetail.fulfilled, (state, action) => {
        state.createCompanyDetail.isLoading = false;
        state.createCompanyDetail.isSuccess = true;
        state.createCompanyDetail.data = action.payload;
      })
      .addCase(createCustomerCompanyDetail.rejected, (state, action) => {
        state.createCompanyDetail.message = action.payload.message;
        state.createCompanyDetail.isLoading = false;
        state.createCompanyDetail.isError = true;
        state.createCompanyDetail.data = null;
      })
      .addCase(createCustomerDiscount.pending, (state) => {
        state.createDiscount.isLoading = true;
        state.createDiscount.message = '';
        state.createDiscount.isError = false;
        state.createDiscount.isSuccess = false;
        state.createDiscount.data = null;
      })
      .addCase(createCustomerDiscount.fulfilled, (state, action) => {
        state.createDiscount.isLoading = false;
        state.createDiscount.isSuccess = true;
        state.createDiscount.data = action.payload;
      })
      .addCase(createCustomerDiscount.rejected, (state, action) => {
        state.createDiscount.message = action.payload.message;
        state.createDiscount.isLoading = false;
        state.createDiscount.isError = true;
        state.createDiscount.data = null;
      })
      .addCase(createCustomerTermOfPaymentAndDelivey.pending, (state) => {
        state.createCustomerTermOfPaymentAndDelivey.isLoading = true;
        state.createCustomerTermOfPaymentAndDelivey.message = '';
        state.createCustomerTermOfPaymentAndDelivey.isError = false;
        state.createCustomerTermOfPaymentAndDelivey.isSuccess = false;
        state.createCustomerTermOfPaymentAndDelivey.data = null;
      })
      .addCase(createCustomerTermOfPaymentAndDelivey.fulfilled, (state, action) => {
        state.createCustomerTermOfPaymentAndDelivey.isLoading = false;
        state.createCustomerTermOfPaymentAndDelivey.isSuccess = true;
        state.createCustomerTermOfPaymentAndDelivey.data = action.payload;
      })
      .addCase(createCustomerTermOfPaymentAndDelivey.rejected, (state, action) => {
        state.createCustomerTermOfPaymentAndDelivey.message = action.payload.message;
        state.createCustomerTermOfPaymentAndDelivey.isLoading = false;
        state.createCustomerTermOfPaymentAndDelivey.isError = true;
        state.createCustomerTermOfPaymentAndDelivey.data = null;
      })
      .addCase(updateCustomer.pending, (state) => {
        state.update.isLoading = true;
        state.update.message = '';
        state.update.isError = false;
        state.update.isSuccess = false;
        state.update.data = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.update.isLoading = false;
        state.update.isSuccess = true;
        state.update.data = action.payload;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.update.message = action.payload.message;
        state.update.isLoading = false;
        state.update.isError = true;
        state.update.data = null;
      })
      .addCase(getSingleCustomer.pending, (state) => {
        state.getSingle.isLoading = true;
        state.getSingle.message = '';
        state.getSingle.isError = false;
        state.getSingle.isSuccess = false;
        state.getSingle.data = null;
      })
      .addCase(getSingleCustomer.fulfilled, (state, action) => {
        state.getSingle.isLoading = false;
        state.getSingle.isSuccess = true;
        state.getSingle.data = action.payload;
      })
      .addCase(getSingleCustomer.rejected, (state, action) => {
        state.getSingle.message = action.payload?.message;
        state.getSingle.isLoading = false;
        state.getSingle.isError = true;
        state.getSingle.data = null;
      })
      .addCase(getAllCustomer.pending, (state) => {
        state.getAll.isLoading = true;
        state.getAll.message = '';
        state.getAll.isError = false;
        state.getAll.isSuccess = false;
        state.getAll.data = null;
      })
      .addCase(getAllCustomer.fulfilled, (state, action) => {
        state.getAll.isLoading = false;
        state.getAll.isSuccess = true;
        state.getAll.data = action.payload;
      })
      .addCase(getAllCustomer.rejected, (state, action) => {
        state.getAll.message = action.payload.message;
        state.getAll.isLoading = false;
        state.getAll.isError = true;
        state.getAll.data = null;
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.delete.isLoading = true;
        state.delete.message = '';
        state.delete.isError = false;
        state.delete.isSuccess = false;
        state.delete.data = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.delete.isLoading = false;
        state.delete.isSuccess = true;
        state.delete.data = action.payload;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.delete.message = action.payload.message;
        state.delete.isLoading = false;
        state.delete.isError = true;
        state.delete.data = null;
      })
      .addCase(uploadCustomerFiles.pending, (state) => {
        state.uploadCustomerFiles.isLoading = true;
        state.uploadCustomerFiles.message = '';
        state.uploadCustomerFiles.isError = false;
        state.uploadCustomerFiles.isSuccess = false;
        state.uploadCustomerFiles.data = null;
      })
      .addCase(uploadCustomerFiles.fulfilled, (state, action) => {
        state.uploadCustomerFiles.isLoading = false;
        state.uploadCustomerFiles.isSuccess = true;
        state.uploadCustomerFiles.data = action.payload;
      })
      .addCase(uploadCustomerFiles.rejected, (state, action) => {
        state.uploadCustomerFiles.message = action.payload.message;
        state.uploadCustomerFiles.isLoading = false;
        state.uploadCustomerFiles.isError = true;
        state.uploadCustomerFiles.data = null;
      });
  }
});

export default customerSlice.reducer;
