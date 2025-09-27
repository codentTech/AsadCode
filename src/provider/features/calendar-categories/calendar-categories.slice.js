import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import calendarCategoryService from "./calendar-categories.service";

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  categories: [],
  createCategory: generalState,
  getAllCategories: generalState,
};

// Create calendar category
export const createCalendarCategory = createAsyncThunk(
  "calendarCategories/createCategory",
  async (payload, thunkAPI) => {
    try {
      const response = await calendarCategoryService.createCategory(payload);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Get all calendar categories
export const getAllCalendarCategories = createAsyncThunk(
  "calendarCategories/getAllCategories",
  async (_, thunkAPI) => {
    try {
      const response = await calendarCategoryService.getAllCategories();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

// Get categories by campaign
export const getCategoriesByCampaign = createAsyncThunk(
  "calendarCategories/getCategoriesByCampaign",
  async (campaignId, thunkAPI) => {
    try {
      const response = await calendarCategoryService.getCategoriesByCampaign(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const calendarCategoriesSlice = createSlice({
  name: "calendarCategories",
  initialState,
  reducers: {
    reset: (state) => {
      state.createCategory = generalState;
      state.getAllCategories = generalState;
    },
    clearCategories: (state) => {
      state.categories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create category
      .addCase(createCalendarCategory.pending, (state) => {
        state.createCategory.isLoading = true;
        state.createCategory.message = "";
        state.createCategory.isError = false;
        state.createCategory.isSuccess = false;
        state.createCategory.data = null;
      })
      .addCase(createCalendarCategory.fulfilled, (state, action) => {
        state.createCategory.isLoading = false;
        state.createCategory.isSuccess = true;
        state.createCategory.data = action.payload.data;
        state.categories.unshift(action.payload.data);
      })
      .addCase(createCalendarCategory.rejected, (state, action) => {
        state.createCategory.message = action.payload.message;
        state.createCategory.isLoading = false;
        state.createCategory.isError = true;
        state.createCategory.data = null;
      })

      // Get all categories
      .addCase(getAllCalendarCategories.pending, (state) => {
        state.getAllCategories.isLoading = true;
        state.getAllCategories.message = "";
        state.getAllCategories.isError = false;
        state.getAllCategories.isSuccess = false;
        state.getAllCategories.data = null;
      })
      .addCase(getAllCalendarCategories.fulfilled, (state, action) => {
        state.getAllCategories.isLoading = false;
        state.getAllCategories.isSuccess = true;
        state.getAllCategories.data = action.payload.data;
        state.categories = action.payload.data;
      })
      .addCase(getAllCalendarCategories.rejected, (state, action) => {
        state.getAllCategories.message = action.payload.message;
        state.getAllCategories.isLoading = false;
        state.getAllCategories.isError = true;
        state.getAllCategories.data = null;
      });
  },
});

export const { reset, clearCategories } = calendarCategoriesSlice.actions;

export default calendarCategoriesSlice.reducer;
