import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dashboardService from './dashboard.service';

const initialState = {
  getDashboardStats: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  }
};

export const getDashboardStats = createAsyncThunk(
  'dashboard/get-stats',
  async ({ errorCallBack, successCallBack }, thunkAPI) => {
    try {
      const response = await dashboardService.getDashboardStats();
      if (response.Succeeded) {
        successCallBack(response.data);
        return response.data;
      }
      errorCallBack();
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    reset: (state) => {
      state.getDashboardStats = {
        data: null,
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: ''
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.getDashboardStats.isLoading = true;
        state.getDashboardStats.message = '';
        state.getDashboardStats.isError = false;
        state.getDashboardStats.isSuccess = false;
        state.getDashboardStats.data = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.getDashboardStats.isLoading = false;
        state.getDashboardStats.isSuccess = true;
        state.getDashboardStats.data = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.getDashboardStats.message = action.payload.message;
        state.getDashboardStats.isLoading = false;
        state.getDashboardStats.isError = true;
        state.getDashboardStats.data = null;
      });
  }
});

export default dashboardSlice.reducer;
