import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import priceGroupService from "./price-group.service";

const initialState = {
  create: { data: null, isError: false, isSuccess: false, isLoading: false, message: "" },
  update: { data: null, isError: false, isSuccess: false, isLoading: false, message: "" },
  getSingle: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  getAll: { data: null, isError: false, isSuccess: false, isLoading: false, message: "" },
  delete: { data: null, isError: false, isSuccess: false, isLoading: false, message: "" },
};

export const createPriceGroup = createAsyncThunk(
  "priceGroup/create",
  async ({ payload, successCallBack = null }, thunkAPI) => {
    try {
      const response = await priceGroupService.createPriceGroup(payload);
      if (response.Succeeded) {
        if (successCallBack) {
          successCallBack();
        }
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getSinglePriceGroup = createAsyncThunk(
  "priceGroup/get",
  async ({ payload }, thunkAPI) => {
    try {
      const response = await priceGroupService.getSinglePriceGroup(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllPriceGroup = createAsyncThunk("priceGroup/getAll", async (payload, thunkAPI) => {
  try {
    const response = await priceGroupService.getAllPriceGroup();
    if (response.Succeeded) {
      return response.data;
    }
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue({ payload: error });
  }
});

export const updatePriceGroup = createAsyncThunk(
  "priceGroup/update",
  async ({ payload: { id, data } }, thunkAPI) => {
    try {
      const response = await priceGroupService.updatePriceGroup(id, data);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deletePriceGroup = createAsyncThunk(
  "priceGroup/delete",
  async ({ payload }, thunkAPI) => {
    try {
      const response = await priceGroupService.deletePriceGroup(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const priceGroupSlice = createSlice({
  name: "priceGroup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPriceGroup.pending, (state) => {
        state.create.isLoading = true;
        state.create.message = "";
        state.create.isError = false;
        state.create.isSuccess = false;
        state.create.data = null;
      })
      .addCase(createPriceGroup.fulfilled, (state, action) => {
        state.create.isLoading = false;
        state.create.isSuccess = true;
        state.create.data = action.payload;
      })
      .addCase(createPriceGroup.rejected, (state, action) => {
        state.create.message = action.payload.message;
        state.create.isLoading = false;
        state.create.isError = true;
        state.create.data = null;
      })
      .addCase(updatePriceGroup.pending, (state) => {
        state.update.isLoading = true;
        state.update.message = "";
        state.update.isError = false;
        state.update.isSuccess = false;
        state.update.data = null;
      })
      .addCase(updatePriceGroup.fulfilled, (state, action) => {
        state.update.isLoading = false;
        state.update.isSuccess = true;
        state.update.data = action.payload;
      })
      .addCase(updatePriceGroup.rejected, (state, action) => {
        state.update.message = action.payload.message;
        state.update.isLoading = false;
        state.update.isError = true;
        state.update.data = null;
      })
      .addCase(getSinglePriceGroup.pending, (state) => {
        state.getSingle.isLoading = true;
        state.getSingle.message = "";
        state.getSingle.isError = false;
        state.getSingle.isSuccess = false;
        state.getSingle.data = null;
      })
      .addCase(getSinglePriceGroup.fulfilled, (state, action) => {
        state.getSingle.isLoading = false;
        state.getSingle.isSuccess = true;
        state.getSingle.data = action.payload;
      })
      .addCase(getSinglePriceGroup.rejected, (state, action) => {
        state.getSingle.message = action.payload.message;
        state.getSingle.isLoading = false;
        state.getSingle.isError = true;
        state.getSingle.data = null;
      })
      .addCase(getAllPriceGroup.pending, (state) => {
        state.getAll.isLoading = true;
        state.getAll.message = "";
        state.getAll.isError = false;
        state.getAll.isSuccess = false;
        state.getAll.data = null;
      })
      .addCase(getAllPriceGroup.fulfilled, (state, action) => {
        state.getAll.isLoading = false;
        state.getAll.isSuccess = true;
        state.getAll.data = action.payload;
      })
      .addCase(getAllPriceGroup.rejected, (state, action) => {
        state.getAll.message = action.payload.message;
        state.getAll.isLoading = false;
        state.getAll.isError = true;
        state.getAll.data = null;
      })
      .addCase(deletePriceGroup.pending, (state) => {
        state.delete.isLoading = true;
        state.delete.message = "";
        state.delete.isError = false;
        state.delete.isSuccess = false;
        state.delete.data = null;
      })
      .addCase(deletePriceGroup.fulfilled, (state, action) => {
        state.delete.isLoading = false;
        state.delete.isSuccess = true;
        state.delete.data = action.payload;
      })
      .addCase(deletePriceGroup.rejected, (state, action) => {
        state.delete.message = action.payload.message;
        state.delete.isLoading = false;
        state.delete.isError = true;
        state.delete.data = null;
      });
  },
});

export default priceGroupSlice.reducer;
