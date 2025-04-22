import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import orderService from './order.service';

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
  getAllOrders: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getSingleOrder: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  updateOrder: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  getOrderHistory: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  bookAnOrder: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  orderRejection: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  addOrderTemplate: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  uploadOrderFiles: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  isTemplateSelected: false
};

export const addCustomer = createAsyncThunk(
  '/order/addCustomer',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderService.addCustomer(payload);
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
  '/order/createHeaderBody',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderService.createHeaderBody(payload);
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
  '/order/createLineItem',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderService.createLineItem(payload);
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
  '/order/addPageStructure',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderService.addPageStructure(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllOrders = createAsyncThunk(
  '/order/getAllOrders',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderService.getAllOrders(payload);
      if (response.Succeeded) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getSingleOrder = createAsyncThunk(
  '/order/getSingleOrder',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await orderService.getSingleOrder(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateOrder = createAsyncThunk(
  '/order/updateOrder',
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderService.updateOrder(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteOrder = createAsyncThunk(
  '/order/deleteOrder',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await orderService.deleteOrder(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getOrderHistory = createAsyncThunk(
  '/order/getOrderHistory',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await orderService.getOrderHistory(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const bookAnOrder = createAsyncThunk(
  '/order/bookAnOrder',
  async ({ payload, orderTemplateId }, thunkAPI) => {
    try {
      const response = await orderService.bookAnOrder(payload, orderTemplateId);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const orderRejection = createAsyncThunk(
  '/order/orderRejection',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await orderService.orderRejection(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const addOrderTemplate = createAsyncThunk(
  '/order/addOrderTemplate',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderService.addOrderTemplate(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const uploadOrderFiles = createAsyncThunk(
  '/offer/uploadFiles',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await orderService.uploadFiles({ payload });
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
      const response = await orderService.saveAsDraft(templateId, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    selectTemplate: (state) => {
      state.isTemplateSelected = true;
    },
    deselectTemplate: (state) => {
      state.isTemplateSelected = false;
    }
  },
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
      .addCase(getAllOrders.pending, (state) => {
        state.getAllOrders.isLoading = true;
        state.getAllOrders.message = '';
        state.getAllOrders.isError = false;
        state.getAllOrders.isSuccess = false;
        state.getAllOrders.data = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.getAllOrders.isLoading = false;
        state.getAllOrders.isSuccess = true;
        state.getAllOrders.data = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.getAllOrders.message = action.payload.message;
        state.getAllOrders.isLoading = false;
        state.getAllOrders.isError = true;
        state.getAllOrders.data = null;
      })
      .addCase(getSingleOrder.pending, (state) => {
        state.getSingleOrder.isLoading = true;
        state.getSingleOrder.message = '';
        state.getSingleOrder.isError = false;
        state.getSingleOrder.isSuccess = false;
        state.getSingleOrder.data = null;
      })
      .addCase(getSingleOrder.fulfilled, (state, action) => {
        state.getSingleOrder.isLoading = false;
        state.getSingleOrder.isSuccess = true;
        state.getSingleOrder.data = action.payload;
      })
      .addCase(getSingleOrder.rejected, (state, action) => {
        state.getSingleOrder.message = action.payload.message;
        state.getSingleOrder.isLoading = false;
        state.getSingleOrder.isError = true;
        state.getSingleOrder.data = null;
      })
      .addCase(updateOrder.pending, (state) => {
        state.updateOrder.isLoading = true;
        state.updateOrder.message = '';
        state.updateOrder.isError = false;
        state.updateOrder.isSuccess = false;
        state.updateOrder.data = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.updateOrder.isLoading = false;
        state.updateOrder.isSuccess = true;
        state.updateOrder.data = action.payload;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.updateOrder.message = action.payload.message;
        state.updateOrder.isLoading = false;
        state.updateOrder.isError = true;
        state.updateOrder.data = null;
      })
      .addCase(getOrderHistory.pending, (state) => {
        state.getOrderHistory.isLoading = true;
        state.getOrderHistory.message = '';
        state.getOrderHistory.isError = false;
        state.getOrderHistory.isSuccess = false;
        state.getOrderHistory.data = null;
      })
      .addCase(getOrderHistory.fulfilled, (state, action) => {
        state.getOrderHistory.isLoading = false;
        state.getOrderHistory.isSuccess = true;
        state.getOrderHistory.data = action.payload;
      })
      .addCase(getOrderHistory.rejected, (state, action) => {
        state.getOrderHistory.message = action.payload.message;
        state.getOrderHistory.isLoading = false;
        state.getOrderHistory.isError = true;
        state.getOrderHistory.data = null;
      })
      .addCase(bookAnOrder.pending, (state) => {
        state.bookAnOrder.isLoading = true;
        state.bookAnOrder.message = '';
        state.bookAnOrder.isError = false;
        state.bookAnOrder.isSuccess = false;
        state.bookAnOrder.data = null;
      })
      .addCase(bookAnOrder.fulfilled, (state, action) => {
        state.bookAnOrder.isLoading = false;
        state.bookAnOrder.isSuccess = true;
        state.bookAnOrder.data = action.payload;
      })
      .addCase(bookAnOrder.rejected, (state, action) => {
        state.bookAnOrder.message = action.payload.message;
        state.bookAnOrder.isLoading = false;
        state.bookAnOrder.isError = true;
        state.bookAnOrder.data = null;
      })
      .addCase(orderRejection.pending, (state) => {
        state.orderRejection.isLoading = true;
        state.orderRejection.message = '';
        state.orderRejection.isError = false;
        state.orderRejection.isSuccess = false;
        state.orderRejection.data = null;
      })
      .addCase(orderRejection.fulfilled, (state, action) => {
        state.orderRejection.isLoading = false;
        state.orderRejection.isSuccess = true;
        state.orderRejection.data = action.payload;
      })
      .addCase(orderRejection.rejected, (state, action) => {
        state.orderRejection.message = action.payload.message;
        state.orderRejection.isLoading = false;
        state.orderRejection.isError = true;
        state.orderRejection.data = null;
      })
      .addCase(addOrderTemplate.pending, (state) => {
        state.addOrderTemplate.isLoading = true;
        state.addOrderTemplate.message = '';
        state.addOrderTemplate.isError = false;
        state.addOrderTemplate.isSuccess = false;
        state.addOrderTemplate.data = null;
      })
      .addCase(addOrderTemplate.fulfilled, (state, action) => {
        state.addOrderTemplate.isLoading = false;
        state.addOrderTemplate.isSuccess = true;
        state.addOrderTemplate.data = action.payload;
      })
      .addCase(addOrderTemplate.rejected, (state, action) => {
        state.addOrderTemplate.message = action.payload.message;
        state.addOrderTemplate.isLoading = false;
        state.addOrderTemplate.isError = true;
        state.addOrderTemplate.data = null;
      })
      .addCase(uploadOrderFiles.pending, (state) => {
        state.uploadOrderFiles.isLoading = true;
        state.uploadOrderFiles.message = '';
        state.uploadOrderFiles.isError = false;
        state.uploadOrderFiles.isSuccess = false;
        state.uploadOrderFiles.data = null;
      })
      .addCase(uploadOrderFiles.fulfilled, (state, action) => {
        state.uploadOrderFiles.isLoading = false;
        state.uploadOrderFiles.isSuccess = true;
        state.uploadOrderFiles.data = action.payload;
      })
      .addCase(uploadOrderFiles.rejected, (state, action) => {
        state.uploadOrderFiles.message = action.payload.message;
        state.uploadOrderFiles.isLoading = false;
        state.uploadOrderFiles.isError = true;
        state.uploadOrderFiles.data = null;
      });
  }
});

export const { selectTemplate, deselectTemplate } = orderSlice.actions;
export default orderSlice.reducer;
