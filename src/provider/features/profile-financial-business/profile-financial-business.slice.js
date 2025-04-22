import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import profileFinancialBusinessService from './profile-financial-business.service';

// Get user from localStorage
const initialState = {
  data: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

export const profileFinancialBusiness = createAsyncThunk(
  '/profile-financial-business',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response =
        await profileFinancialBusinessService.createProfileFinancialBusiness(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateProfileFinancialBusiness = createAsyncThunk(
  '/update-profile-financial-business',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response =
        await profileFinancialBusinessService.updateProfileFinancialBusiness(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const profileFinancialBusinessSlice = createSlice({
  name: 'profileFinancialBusiness',
  initialState,
  reducers: {
    reset: (state) => {
      state = {
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
      .addCase(profileFinancialBusiness.pending, (state) => {
        state.isLoading = true;
        state.message = '';
        state.isError = false;
        state.isSuccess = false;
        state.data = null;
      })
      .addCase(profileFinancialBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(profileFinancialBusiness.rejected, (state, action) => {
        state.message = action.payload.message;
        state.isLoading = false;
        state.isError = true;
        state.data = null;
      });
  }
});

export const { reset } = profileFinancialBusinessSlice.actions;

export default profileFinancialBusinessSlice.reducer;
