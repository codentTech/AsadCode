import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import expenditureService from './expenditure.service';

const initialState = {
  createExpenditure: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getAllExpenditure: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: true,
    message: ''
  },
  deleteExpenditure: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getSingleExpenditure: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: true,
    message: ''
  },
  updateExpenditure: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  payExpenditure: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getExpenditureHistory: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const createExpenditure = createAsyncThunk(
  'expenditure/createExpenditure',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await expenditureService.createExpenditure(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);
export const getAllExpenditure = createAsyncThunk(
  'expenditure/getAllExpenditure',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await expenditureService.getAllExpenditure(payload);
      if (response.Succeeded) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteExpenditure = createAsyncThunk(
  'expenditure/deleteExpenditure',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await expenditureService.deleteExpenditure(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getSingleExpenditure = createAsyncThunk(
  'expenditure/getSingle',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await expenditureService.getSingleExpenditure(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateExpenditure = createAsyncThunk(
  'expenditure/update',
  async ({ payload: { id, data } }, thunkAPI) => {
    try {
      const response = await expenditureService.updateExpenditure(id, data);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const payExpenditure = createAsyncThunk(
  'expenditure/payExpenditure',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await expenditureService.payExpenditure(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getExpenditureHistory = createAsyncThunk(
  '/expenditure/getExpenditureHistory',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await expenditureService.getExpenditureHistory(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const expenditureSlice = createSlice({
  name: 'expenditure',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createExpenditure.pending, (state) => {
        state.createExpenditure.isLoading = true;
        state.createExpenditure.message = '';
        state.createExpenditure.isError = false;
        state.createExpenditure.isSuccess = false;
        state.createExpenditure.data = null;
      })
      .addCase(createExpenditure.fulfilled, (state, action) => {
        state.createExpenditure.isLoading = false;
        state.createExpenditure.isSuccess = true;
        state.createExpenditure.data = action.payload;
      })
      .addCase(createExpenditure.rejected, (state, action) => {
        state.createExpenditure.message = action.payload.message;
        state.createExpenditure.isLoading = false;
        state.createExpenditure.isError = true;
        state.createExpenditure.data = null;
      })
      .addCase(getAllExpenditure.pending, (state) => {
        state.getAllExpenditure.isLoading = true;
        state.getAllExpenditure.message = '';
        state.getAllExpenditure.isError = false;
        state.getAllExpenditure.isSuccess = false;
        state.getAllExpenditure.data = null;
      })
      .addCase(getAllExpenditure.fulfilled, (state, action) => {
        state.getAllExpenditure.isLoading = false;
        state.getAllExpenditure.isSuccess = true;
        state.getAllExpenditure.data = action.payload;
      })
      .addCase(getAllExpenditure.rejected, (state, action) => {
        state.getAllExpenditure.message = action.payload.message;
        state.getAllExpenditure.isLoading = false;
        state.getAllExpenditure.isError = true;
        state.getAllExpenditure.data = null;
      })
      .addCase(deleteExpenditure.pending, (state) => {
        state.deleteExpenditure.isLoading = true;
        state.deleteExpenditure.message = '';
        state.deleteExpenditure.isError = false;
        state.deleteExpenditure.isSuccess = false;
        state.deleteExpenditure.data = null;
      })
      .addCase(deleteExpenditure.fulfilled, (state, action) => {
        state.deleteExpenditure.isLoading = false;
        state.deleteExpenditure.isSuccess = true;
        state.deleteExpenditure.data = action.payload;
      })
      .addCase(deleteExpenditure.rejected, (state, action) => {
        state.deleteExpenditure.message = action.payload.message;
        state.deleteExpenditure.isLoading = false;
        state.deleteExpenditure.isError = true;
        state.deleteExpenditure.data = null;
      })
      .addCase(getSingleExpenditure.pending, (state) => {
        state.getSingleExpenditure.isLoading = true;
        state.getSingleExpenditure.message = '';
        state.getSingleExpenditure.isError = false;
        state.getSingleExpenditure.isSuccess = false;
        state.getSingleExpenditure.data = null;
      })
      .addCase(getSingleExpenditure.fulfilled, (state, action) => {
        state.getSingleExpenditure.isLoading = false;
        state.getSingleExpenditure.isSuccess = true;
        state.getSingleExpenditure.data = action.payload;
      })
      .addCase(getSingleExpenditure.rejected, (state, action) => {
        state.getSingleExpenditure.message = action.payload.message;
        state.getSingleExpenditure.isLoading = false;
        state.getSingleExpenditure.isError = true;
        state.getSingleExpenditure.data = null;
      })
      .addCase(updateExpenditure.pending, (state) => {
        state.updateExpenditure.isLoading = true;
        state.updateExpenditure.message = '';
        state.updateExpenditure.isError = false;
        state.updateExpenditure.isSuccess = false;
        state.updateExpenditure.data = null;
      })
      .addCase(updateExpenditure.fulfilled, (state, action) => {
        state.updateExpenditure.isLoading = false;
        state.updateExpenditure.isSuccess = true;
        state.updateExpenditure.data = action.payload;
      })
      .addCase(updateExpenditure.rejected, (state, action) => {
        state.updateExpenditure.message = action.payload.message;
        state.updateExpenditure.isLoading = false;
        state.updateExpenditure.isError = true;
        state.updateExpenditure.data = null;
      })
      .addCase(payExpenditure.pending, (state) => {
        state.payExpenditure.isLoading = true;
        state.payExpenditure.message = '';
        state.payExpenditure.isError = false;
        state.payExpenditure.isSuccess = false;
        state.payExpenditure.data = null;
      })
      .addCase(payExpenditure.fulfilled, (state, action) => {
        state.payExpenditure.isLoading = false;
        state.payExpenditure.isSuccess = true;
        state.payExpenditure.data = action.payload;
      })
      .addCase(payExpenditure.rejected, (state, action) => {
        state.payExpenditure.message = action.payload.message;
        state.payExpenditure.isLoading = false;
        state.payExpenditure.isError = true;
        state.payExpenditure.data = null;
      })
      .addCase(getExpenditureHistory.pending, (state) => {
        state.getExpenditureHistory.isLoading = true;
        state.getExpenditureHistory.message = '';
        state.getExpenditureHistory.isError = false;
        state.getExpenditureHistory.isSuccess = false;
        state.getExpenditureHistory.data = null;
      })
      .addCase(getExpenditureHistory.fulfilled, (state, action) => {
        state.getExpenditureHistory.isLoading = false;
        state.getExpenditureHistory.isSuccess = true;
        state.getExpenditureHistory.data = action.payload;
      })
      .addCase(getExpenditureHistory.rejected, (state, action) => {
        state.getExpenditureHistory.message = action.payload.message;
        state.getExpenditureHistory.isLoading = false;
        state.getExpenditureHistory.isError = true;
        state.getExpenditureHistory.data = null;
      });
  }
});

export default expenditureSlice.reducer;
