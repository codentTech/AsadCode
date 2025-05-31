import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productService from "./product.service";

const initialState = {
  create: { data: null, isError: false, isSuccess: false, isLoading: false, message: "" },
  update: { data: null, isError: false, isSuccess: false, isLoading: false, message: "" },
  getSingle: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: true,
    message: "",
  },
  getProductNumber: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  getAllProduct: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: true,
    message: "",
  },
  delete: { data: null, isError: false, isSuccess: false, isLoading: false, message: "" },
  productForModules: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  duplicate: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  productNumber: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  productSkuNumber: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  productGtin: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
};

export const createProduct = createAsyncThunk(
  "product/create",
  async ({ payload, successCallback }, thunkAPI) => {
    try {
      const response = await productService.createProduct(payload);
      if (response.Succeeded) {
        if (successCallback) {
          successCallback();
        }
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getSingleProduct = createAsyncThunk("product/get", async ({ payload }, thunkAPI) => {
  try {
    const response = await productService.getSingleProduct(payload);
    if (response.Succeeded) {
      return response.data;
    }
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const getAllProduct = createAsyncThunk(
  "product/getAllProduct",
  async ({ payload }, thunkAPI) => {
    try {
      const response = await productService.getAllProduct(payload);

      if (response.Succeeded) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getProductNumber = createAsyncThunk(
  "product/getProductNumber",
  async (_, thunkAPI) => {
    try {
      const response = await productService.getProductNumber();

      if (response.Succeeded) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/update",
  async ({ payload: { id, data }, successCallback }, thunkAPI) => {
    try {
      const response = await productService.updateProduct(id, data);
      if (response.Succeeded) {
        if (successCallback) {
          successCallback();
        }
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteProduct = createAsyncThunk("product/delete", async ({ payload }, thunkAPI) => {
  try {
    const response = await productService.deleteProduct(payload);
    if (response.Succeeded) {
      return response.data;
    }
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const productForModules = createAsyncThunk(
  "product/productForModules",
  async ({ payload, module, id }, thunkAPI) => {
    try {
      const response = await productService.productForModules(payload, module, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const productDuplicate = createAsyncThunk(
  "/product/duplicate",
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await productService.productDuplicate(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);
export const productNumberUnique = createAsyncThunk(
  "/product/productNumberUnique",
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await productService.productNumberUnique(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);
export const productSkuNumberUnique = createAsyncThunk(
  "/product/productSkuNumberUnique",
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await productService.productSkuNumberUnique(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);
export const productGtinUnique = createAsyncThunk(
  "/product/productGtinUnique",
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await productService.productGtinUnique(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.create.isLoading = true;
        state.create.message = "";
        state.create.isError = false;
        state.create.isSuccess = false;
        state.create.data = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.create.isLoading = false;
        state.create.isSuccess = true;
        state.create.data = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.create.message = action.payload.message;
        state.create.isLoading = false;
        state.create.isError = true;
        state.create.data = null;
      })
      .addCase(getProductNumber.pending, (state) => {
        state.getProductNumber.isLoading = true;
        state.getProductNumber.message = "";
        state.getProductNumber.isError = false;
        state.getProductNumber.isSuccess = false;
        state.getProductNumber.data = null;
      })
      .addCase(getProductNumber.fulfilled, (state, action) => {
        state.getProductNumber.isLoading = false;
        state.getProductNumber.isSuccess = true;
        state.getProductNumber.data = action.payload;
      })
      .addCase(getProductNumber.rejected, (state, action) => {
        state.getProductNumber.message = action.payload.message;
        state.getProductNumber.isLoading = false;
        state.getProductNumber.isError = true;
        state.getProductNumber.data = null;
      })
      .addCase(productGtinUnique.pending, (state) => {
        state.productGtin.isLoading = true;
        state.productGtin.message = "";
        state.productGtin.isError = false;
        state.productGtin.isSuccess = false;
        state.productGtin.data = null;
      })
      .addCase(productGtinUnique.fulfilled, (state, action) => {
        state.productGtin.isLoading = false;
        state.productGtin.isSuccess = true;
        state.productGtin.data = action.payload;
      })
      .addCase(productGtinUnique.rejected, (state, action) => {
        state.productGtin.message = action.payload.message;
        state.productGtin.isLoading = false;
        state.productGtin.isError = true;
        state.productGtin.data = null;
      })
      .addCase(productSkuNumberUnique.pending, (state) => {
        state.productSkuNumber.isLoading = true;
        state.productSkuNumber.message = "";
        state.productSkuNumber.isError = false;
        state.productSkuNumber.isSuccess = false;
        state.productSkuNumber.data = null;
      })
      .addCase(productSkuNumberUnique.fulfilled, (state, action) => {
        state.productSkuNumber.isLoading = false;
        state.productSkuNumber.isSuccess = true;
        state.productSkuNumber.data = action.payload;
      })
      .addCase(productSkuNumberUnique.rejected, (state, action) => {
        state.productSkuNumber.message = action.payload.message;
        state.productSkuNumber.isLoading = false;
        state.productSkuNumber.isError = true;
        state.productSkuNumber.data = null;
      })
      .addCase(productNumberUnique.pending, (state) => {
        state.productNumber.isLoading = true;
        state.productNumber.message = "";
        state.productNumber.isError = false;
        state.productNumber.isSuccess = false;
        state.productNumber.data = null;
      })
      .addCase(productNumberUnique.fulfilled, (state, action) => {
        state.productNumber.isLoading = false;
        state.productNumber.isSuccess = true;
        state.productNumber.data = action.payload;
      })
      .addCase(productNumberUnique.rejected, (state, action) => {
        state.productNumber.message = action.payload.message;
        state.productNumber.isLoading = false;
        state.productNumber.isError = true;
        state.productNumber.data = null;
      })
      .addCase(productDuplicate.pending, (state) => {
        state.duplicate.isLoading = true;
        state.duplicate.message = "";
        state.duplicate.isError = false;
        state.duplicate.isSuccess = false;
        state.duplicate.data = null;
      })
      .addCase(productDuplicate.fulfilled, (state, action) => {
        state.duplicate.isLoading = false;
        state.duplicate.isSuccess = true;
        state.duplicate.data = action.payload;
      })
      .addCase(productDuplicate.rejected, (state, action) => {
        state.duplicate.message = action.payload.message;
        state.duplicate.isLoading = false;
        state.duplicate.isError = true;
        state.duplicate.data = null;
      })
      .addCase(updateProduct.pending, (state) => {
        state.update.isLoading = true;
        state.update.message = "";
        state.update.isError = false;
        state.update.isSuccess = false;
        state.update.data = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.update.isLoading = false;
        state.update.isSuccess = true;
        state.update.data = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.update.message = action.payload.message;
        state.update.isLoading = false;
        state.update.isError = true;
        state.update.data = null;
      })
      .addCase(getSingleProduct.pending, (state) => {
        state.getSingle.isLoading = true;
        state.getSingle.message = "";
        state.getSingle.isError = false;
        state.getSingle.isSuccess = false;
        state.getSingle.data = null;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.getSingle.isLoading = false;
        state.getSingle.isSuccess = true;
        state.getSingle.data = action.payload;
      })
      .addCase(getSingleProduct.rejected, (state, action) => {
        state.getSingle.message = action.payload.message;
        state.getSingle.isLoading = false;
        state.getSingle.isError = true;
        state.getSingle.data = null;
      })
      .addCase(getAllProduct.pending, (state) => {
        state.getAllProduct.isLoading = true;
        state.getAllProduct.message = "";
        state.getAllProduct.isError = false;
        state.getAllProduct.isSuccess = false;
        state.getAllProduct.data = null;
      })
      .addCase(getAllProduct.fulfilled, (state, action) => {
        state.getAllProduct.isLoading = false;
        state.getAllProduct.isSuccess = true;
        state.getAllProduct.data = action.payload;
      })
      .addCase(getAllProduct.rejected, (state, action) => {
        state.getAllProduct.message = action.payload.message;
        state.getAllProduct.isLoading = false;
        state.getAllProduct.isError = true;
        state.getAllProduct.data = null;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.delete.isLoading = true;
        state.delete.message = "";
        state.delete.isError = false;
        state.delete.isSuccess = false;
        state.delete.data = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.delete.isLoading = false;
        state.delete.isSuccess = true;
        state.delete.data = action.payload;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.delete.message = action.payload.message;
        state.delete.isLoading = false;
        state.delete.isError = true;
        state.delete.data = null;
      })
      .addCase(productForModules.pending, (state) => {
        state.productForModules.isLoading = true;
        state.productForModules.message = "";
        state.productForModules.isError = false;
        state.productForModules.isSuccess = false;
        state.productForModules.data = null;
      })
      .addCase(productForModules.fulfilled, (state, action) => {
        state.productForModules.isLoading = false;
        state.productForModules.isSuccess = true;
        state.productForModules.data = action.payload;
      })
      .addCase(productForModules.rejected, (state, action) => {
        state.productForModules.message = action.payload.message;
        state.productForModules.isLoading = false;
        state.productForModules.isError = true;
        state.productForModules.data = null;
      });
  },
});

export default productSlice.reducer;
