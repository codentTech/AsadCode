import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import deliveryTermService from './delivery-term.service';

const initialState = {
  createDeliveryTerm: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getDeliveryTerm: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateDeliveryTerm: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  deleteDeliveryTerm: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};
export const createDeliveryTerm = createAsyncThunk(
  '/deliveryTerm/create',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await deliveryTermService.createDeliveryTerm(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getDeliveryTerm = createAsyncThunk(
  '/deliveryTerm/get',
  async (_, thunkAPI) => {
    try {
      const response = await deliveryTermService.getDeliveryTerm();
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateDeliveryTerm = createAsyncThunk(
  '/deliveryTerm/update',
  async ({ payload: { id, data } }, thunkAPI) => {
    try {
      const response = await deliveryTermService.updateDeliveryTerm(id, data);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteDeliveryTerm = createAsyncThunk(
  '/deliveryTerm/delete',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await deliveryTermService.deleteDeliveryTerm(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deliveryTermSlice = createSlice({
  name: 'deliveryTerm',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDeliveryTerm.pending, (state) => {
        state.createDeliveryTerm.isLoading = true;
        state.createDeliveryTerm.message = '';
        state.createDeliveryTerm.isError = false;
        state.createDeliveryTerm.isSuccess = false;
        state.createDeliveryTerm.data = null;
      })
      .addCase(createDeliveryTerm.fulfilled, (state, action) => {
        state.createDeliveryTerm.isLoading = false;
        state.createDeliveryTerm.isSuccess = true;
        state.createDeliveryTerm.data = action.payload;
      })
      .addCase(createDeliveryTerm.rejected, (state, action) => {
        state.createDeliveryTerm.message = action.payload.message;
        state.createDeliveryTerm.isLoading = false;
        state.createDeliveryTerm.isError = true;
        state.createDeliveryTerm.data = null;
      })
      .addCase(updateDeliveryTerm.pending, (state) => {
        state.updateDeliveryTerm.isLoading = true;
        state.updateDeliveryTerm.message = '';
        state.updateDeliveryTerm.isError = false;
        state.updateDeliveryTerm.isSuccess = false;
        state.updateDeliveryTerm.data = null;
      })
      .addCase(updateDeliveryTerm.fulfilled, (state, action) => {
        state.updateDeliveryTerm.isLoading = false;
        state.updateDeliveryTerm.isSuccess = true;
        state.updateDeliveryTerm.data = action.payload;
      })
      .addCase(updateDeliveryTerm.rejected, (state, action) => {
        state.updateDeliveryTerm.message = action.payload.message;
        state.updateDeliveryTerm.isLoading = false;
        state.updateDeliveryTerm.isError = true;
        state.updateDeliveryTerm.data = null;
      })
      .addCase(deleteDeliveryTerm.pending, (state) => {
        state.deleteDeliveryTerm.isLoading = true;
        state.deleteDeliveryTerm.message = '';
        state.deleteDeliveryTerm.isError = false;
        state.deleteDeliveryTerm.isSuccess = false;
        state.deleteDeliveryTerm.data = null;
      })
      .addCase(deleteDeliveryTerm.fulfilled, (state, action) => {
        state.deleteDeliveryTerm.isLoading = false;
        state.deleteDeliveryTerm.isSuccess = true;
        state.deleteDeliveryTerm.data = action.payload;
      })
      .addCase(deleteDeliveryTerm.rejected, (state, action) => {
        state.deleteDeliveryTerm.message = action.payload.message;
        state.deleteDeliveryTerm.isLoading = false;
        state.deleteDeliveryTerm.isError = true;
        state.deleteDeliveryTerm.data = null;
      })
      .addCase(getDeliveryTerm.pending, (state) => {
        state.getDeliveryTerm.isLoading = true;
        state.getDeliveryTerm.message = '';
        state.getDeliveryTerm.isError = false;
        state.getDeliveryTerm.isSuccess = false;
        state.getDeliveryTerm.data = null;
      })
      .addCase(getDeliveryTerm.fulfilled, (state, action) => {
        state.getDeliveryTerm.isLoading = false;
        state.getDeliveryTerm.isSuccess = true;
        state.getDeliveryTerm.data = action.payload;
      })
      .addCase(getDeliveryTerm.rejected, (state, action) => {
        state.getDeliveryTerm.message = action.payload.message;
        state.getDeliveryTerm.isLoading = false;
        state.getDeliveryTerm.isError = true;
        state.getDeliveryTerm.data = null;
      });
  }
});
export default deliveryTermSlice.reducer;
