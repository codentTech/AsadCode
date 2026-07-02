import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import emailPreferencesService from "./email-preferences.service";

const generalState = {
  data: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const emailPreferencesInitialState = {
  getEmailPreferences: { ...generalState },
  updateEmailPreferences: { ...generalState },
  dismissEmailPreferencesPopup: { ...generalState },
};

const initialState = emailPreferencesInitialState;

export const selectGetEmailPreferencesState = (state) =>
  state?.emailPreferences?.getEmailPreferences ??
  emailPreferencesInitialState.getEmailPreferences;

export const selectUpdateEmailPreferencesState = (state) =>
  state?.emailPreferences?.updateEmailPreferences ??
  emailPreferencesInitialState.updateEmailPreferences;

export const getEmailPreferences = createAsyncThunk(
  "emailPreferences/getEmailPreferences",
  async (_, thunkAPI) => {
    try {
      const response = await emailPreferencesService.getEmailPreferences();
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateEmailPreferences = createAsyncThunk(
  "emailPreferences/updateEmailPreferences",
  async (payload, thunkAPI) => {
    try {
      const response = await emailPreferencesService.updateEmailPreferences(payload);
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const dismissEmailPreferencesPopup = createAsyncThunk(
  "emailPreferences/dismissEmailPreferencesPopup",
  async (_, thunkAPI) => {
    try {
      const response = await emailPreferencesService.dismissEmailPreferencesPopup();
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const emailPreferencesSlice = createSlice({
  name: "emailPreferences",
  initialState,
  reducers: {
    resetUpdateEmailPreferences: (state) => {
      state.updateEmailPreferences = { ...generalState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmailPreferences.pending, (state) => {
        state.getEmailPreferences.isLoading = true;
      })
      .addCase(getEmailPreferences.fulfilled, (state, action) => {
        state.getEmailPreferences = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload,
        };
      })
      .addCase(getEmailPreferences.rejected, (state, action) => {
        state.getEmailPreferences = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: action.payload?.message,
          data: null,
        };
      })
      .addCase(updateEmailPreferences.pending, (state) => {
        state.updateEmailPreferences.isLoading = true;
      })
      .addCase(updateEmailPreferences.fulfilled, (state, action) => {
        state.getEmailPreferences.data = action.payload;
        state.updateEmailPreferences = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload,
        };
      })
      .addCase(updateEmailPreferences.rejected, (state, action) => {
        state.updateEmailPreferences = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: action.payload?.message,
          data: null,
        };
      })
      .addCase(dismissEmailPreferencesPopup.fulfilled, (state, action) => {
        state.getEmailPreferences.data = action.payload;
      });
  },
});

export const { resetUpdateEmailPreferences } = emailPreferencesSlice.actions;
export default emailPreferencesSlice.reducer;
