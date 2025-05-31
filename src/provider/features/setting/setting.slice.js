import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import settinService from "./setting.service";

const initialState = {
  createGeneralSetting: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  generalSettingCurrentBusiness: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  getSingleGeneralSetting: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  updateGeneralSetting: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  createOfferDocumentSetting: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  updateOfferDocumentSetting: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  createCreditNoteDocumentSetting: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  updateCreditNoteDocumentSetting: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  createOrderDocumentSetting: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  updateOrderDocumentSetting: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  createDeliveryNotesDocumentSetting: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  updateDeliveryNotesDocumentSetting: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  createInvoiceDocumentSetting: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  updateInvoiceDocumentSetting: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  createProductDocumentSetting: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  updateProductDocumentSetting: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  getDocumentSetting: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  getCancellation: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  createInvoiceCancellation: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
  updateInvoiceCancellation: {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  },
};

export const createGeneralSetting = createAsyncThunk(
  "/createGeneralSetting",
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.createGeneralSetting(payload);
      if (response.Succeeded) {
        if (response.data[0]) {
          localStorage.setItem("defaultNumberOfRecords", payload.noRecordToDisplayInTable);
        }
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const generalSettingCurrentBusiness = createAsyncThunk(
  "/generalSettingCurrentBusiness",
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.generalSettingCurrentBusiness();
      if (response.Succeeded) {
        localStorage.setItem("defaultNumberOfRecords", response.data.noRecordToDisplayInTable);
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getSingleGeneralSetting = createAsyncThunk(
  "/getSingleGeneralSetting",
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.getSingleGeneralSetting(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateGeneralSetting = createAsyncThunk(
  "/updateGeneralSetting",
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.updateGeneralSetting(payload, id);
      if (response.Succeeded) {
        localStorage.setItem("defaultNumberOfRecords", payload.noRecordToDisplayInTable);
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createOfferDocumentSetting = createAsyncThunk(
  "/createOfferDocumentSetting",
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.createOfferDocumentSetting(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateOfferDocumentSetting = createAsyncThunk(
  "/updateOfferDocumentSetting",
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.updateOfferDocumentSetting(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createCreditNoteDocumentSetting = createAsyncThunk(
  "/createCreditNoteDocumentSetting",
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.createCreditNoteDocumentSetting(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateCreditNoteDocumentSetting = createAsyncThunk(
  "/updateCreditNoteDocumentSetting",
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.updateCreditNoteDocumentSetting(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createOrderDocumentSetting = createAsyncThunk(
  "/createOrderDocumentSetting",
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.createOrderDocumentSetting(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateOrderDocumentSetting = createAsyncThunk(
  "/updateOrderDocumentSetting",
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.updateOrderrDocumentSetting(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createDeliveryNotesDocumentSetting = createAsyncThunk(
  "/createDeliveryNotesDocumentSetting",
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.createDeliveryNotesDocumentSetting(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateDeliveryNotesDocumentSetting = createAsyncThunk(
  "/updateDeliveryNotesDocumentSetting",
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.updateDeliveryNotesDocumentSetting(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createInvoiceDocumentSetting = createAsyncThunk(
  "/createInvoiceDocumentSetting",
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.createInvoiceDocumentSetting(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateInvoiceDocumentSetting = createAsyncThunk(
  "/updateInvoiceDocumentSetting",
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.updateInvoiceDocumentSetting(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createProductDocumentSetting = createAsyncThunk(
  "/createProductDocumentSetting",
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.createProductDocumentSetting(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateProductDocumentSetting = createAsyncThunk(
  "/updateProductDocumentSetting",
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.updateProductDocumentSetting(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getDocumentSetting = createAsyncThunk(
  "/getDocumentSetting",
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.getDocumentSetting(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getCancellation = createAsyncThunk(
  "/get/cancellation",
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.getCancellation(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createInvoiceCancellation = createAsyncThunk(
  "/create/cancellation",
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.createInvoiceCancellation(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateInvoiceCancellation = createAsyncThunk(
  "/update/cancellation",
  async ({ payload, id, callBackMessage }, thunkAPI) => {
    try {
      const response = await settinService.updateInvoiceCancellation(payload, id);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createGeneralSetting.pending, (state) => {
        state.createGeneralSetting.isLoading = true;
        state.createGeneralSetting.message = "";
        state.createGeneralSetting.isError = false;
        state.createGeneralSetting.isSuccess = false;
        state.createGeneralSetting.data = null;
      })
      .addCase(createGeneralSetting.fulfilled, (state, action) => {
        state.createGeneralSetting.isLoading = false;
        state.createGeneralSetting.isSuccess = true;
        state.createGeneralSetting.data = action.payload;
      })
      .addCase(createGeneralSetting.rejected, (state, action) => {
        state.createGeneralSetting.message = action.payload.message;
        state.createGeneralSetting.isLoading = false;
        state.createGeneralSetting.isError = true;
        state.createGeneralSetting.data = null;
      })
      .addCase(generalSettingCurrentBusiness.pending, (state) => {
        state.generalSettingCurrentBusiness.isLoading = true;
        state.generalSettingCurrentBusiness.message = "";
        state.generalSettingCurrentBusiness.isError = false;
        state.generalSettingCurrentBusiness.isSuccess = false;
        state.generalSettingCurrentBusiness.data = null;
      })
      .addCase(generalSettingCurrentBusiness.fulfilled, (state, action) => {
        state.generalSettingCurrentBusiness.isLoading = false;
        state.generalSettingCurrentBusiness.isSuccess = true;
        state.generalSettingCurrentBusiness.data = action.payload;
      })
      .addCase(generalSettingCurrentBusiness.rejected, (state, action) => {
        state.generalSettingCurrentBusiness.message = action.payload.message;
        state.generalSettingCurrentBusiness.isLoading = false;
        state.generalSettingCurrentBusiness.isError = true;
        state.generalSettingCurrentBusiness.data = null;
      })
      .addCase(getSingleGeneralSetting.pending, (state) => {
        state.getSingleGeneralSetting.isLoading = true;
        state.getSingleGeneralSetting.message = "";
        state.getSingleGeneralSetting.isError = false;
        state.getSingleGeneralSetting.isSuccess = false;
        state.getSingleGeneralSetting.data = null;
      })
      .addCase(getSingleGeneralSetting.fulfilled, (state, action) => {
        state.getSingleGeneralSetting.isLoading = false;
        state.getSingleGeneralSetting.isSuccess = true;
        state.getSingleGeneralSetting.data = action.payload;
      })
      .addCase(getSingleGeneralSetting.rejected, (state, action) => {
        state.getSingleGeneralSetting.message = action.payload.message;
        state.getSingleGeneralSetting.isLoading = false;
        state.getSingleGeneralSetting.isError = true;
        state.getSingleGeneralSetting.data = null;
      })
      .addCase(updateGeneralSetting.pending, (state) => {
        state.updateGeneralSetting.isLoading = true;
        state.updateGeneralSetting.message = "";
        state.updateGeneralSetting.isError = false;
        state.updateGeneralSetting.isSuccess = false;
        state.updateGeneralSetting.data = null;
      })
      .addCase(updateGeneralSetting.fulfilled, (state, action) => {
        state.updateGeneralSetting.isLoading = false;
        state.updateGeneralSetting.isSuccess = true;
        state.updateGeneralSetting.data = action.payload;
      })
      .addCase(updateGeneralSetting.rejected, (state, action) => {
        state.updateGeneralSetting.message = action.payload.message;
        state.updateGeneralSetting.isLoading = false;
        state.updateGeneralSetting.isError = true;
        state.updateGeneralSetting.data = null;
      })
      .addCase(createOfferDocumentSetting.pending, (state) => {
        state.createOfferDocumentSetting.isLoading = true;
        state.createOfferDocumentSetting.message = "";
        state.createOfferDocumentSetting.isError = false;
        state.createOfferDocumentSetting.isSuccess = false;
        state.createOfferDocumentSetting.data = null;
      })
      .addCase(createOfferDocumentSetting.fulfilled, (state, action) => {
        state.createOfferDocumentSetting.isLoading = false;
        state.createOfferDocumentSetting.isSuccess = true;
        state.createOfferDocumentSetting.data = action.payload;
      })
      .addCase(createOfferDocumentSetting.rejected, (state, action) => {
        state.createOfferDocumentSetting.message = action.payload.message;
        state.createOfferDocumentSetting.isLoading = false;
        state.createOfferDocumentSetting.isError = true;
        state.createOfferDocumentSetting.data = null;
      })
      .addCase(updateOfferDocumentSetting.pending, (state) => {
        state.updateOfferDocumentSetting.isLoading = true;
        state.updateOfferDocumentSetting.message = "";
        state.updateOfferDocumentSetting.isError = false;
        state.updateOfferDocumentSetting.isSuccess = false;
        state.updateOfferDocumentSetting.data = null;
      })
      .addCase(updateOfferDocumentSetting.fulfilled, (state, action) => {
        state.updateOfferDocumentSetting.isLoading = false;
        state.updateOfferDocumentSetting.isSuccess = true;
        state.updateOfferDocumentSetting.data = action.payload;
      })
      .addCase(updateOfferDocumentSetting.rejected, (state, action) => {
        state.updateOfferDocumentSetting.message = action.payload.message;
        state.updateOfferDocumentSetting.isLoading = false;
        state.updateOfferDocumentSetting.isError = true;
        state.updateOfferDocumentSetting.data = null;
      })
      .addCase(createCreditNoteDocumentSetting.pending, (state) => {
        state.createCreditNoteDocumentSetting.isLoading = true;
        state.createCreditNoteDocumentSetting.message = "";
        state.createCreditNoteDocumentSetting.isError = false;
        state.createCreditNoteDocumentSetting.isSuccess = false;
        state.createCreditNoteDocumentSetting.data = null;
      })
      .addCase(createCreditNoteDocumentSetting.fulfilled, (state, action) => {
        state.createCreditNoteDocumentSetting.isLoading = false;
        state.createCreditNoteDocumentSetting.isSuccess = true;
        state.createCreditNoteDocumentSetting.data = action.payload;
      })
      .addCase(createCreditNoteDocumentSetting.rejected, (state, action) => {
        state.createCreditNoteDocumentSetting.message = action?.payload?.message;
        state.createCreditNoteDocumentSetting.isLoading = false;
        state.createCreditNoteDocumentSetting.isError = true;
        state.createCreditNoteDocumentSetting.data = null;
      })
      .addCase(updateCreditNoteDocumentSetting.pending, (state) => {
        state.updateCreditNoteDocumentSetting.isLoading = true;
        state.updateCreditNoteDocumentSetting.message = "";
        state.updateCreditNoteDocumentSetting.isError = false;
        state.updateCreditNoteDocumentSetting.isSuccess = false;
        state.updateCreditNoteDocumentSetting.data = null;
      })
      .addCase(updateCreditNoteDocumentSetting.fulfilled, (state, action) => {
        state.updateCreditNoteDocumentSetting.isLoading = false;
        state.updateCreditNoteDocumentSetting.isSuccess = true;
        state.updateCreditNoteDocumentSetting.data = action.payload;
      })
      .addCase(updateCreditNoteDocumentSetting.rejected, (state, action) => {
        state.updateCreditNoteDocumentSetting.message = action?.payload?.message;
        state.updateCreditNoteDocumentSetting.isLoading = false;
        state.updateCreditNoteDocumentSetting.isError = true;
        state.updateCreditNoteDocumentSetting.data = null;
      })
      .addCase(createOrderDocumentSetting.pending, (state) => {
        state.createOrderDocumentSetting.isLoading = true;
        state.createOrderDocumentSetting.message = "";
        state.createOrderDocumentSetting.isError = false;
        state.createOrderDocumentSetting.isSuccess = false;
        state.createOrderDocumentSetting.data = null;
      })
      .addCase(createOrderDocumentSetting.fulfilled, (state, action) => {
        state.createOrderDocumentSetting.isLoading = false;
        state.createOrderDocumentSetting.isSuccess = true;
        state.createOrderDocumentSetting.data = action.payload;
      })
      .addCase(createOrderDocumentSetting.rejected, (state, action) => {
        state.createOrderDocumentSetting.message = action.payload.message;
        state.createOrderDocumentSetting.isLoading = false;
        state.createOrderDocumentSetting.isError = true;
        state.createOrderDocumentSetting.data = null;
      })
      .addCase(updateOrderDocumentSetting.pending, (state) => {
        state.updateOrderDocumentSetting.isLoading = true;
        state.updateOrderDocumentSetting.message = "";
        state.updateOrderDocumentSetting.isError = false;
        state.updateOrderDocumentSetting.isSuccess = false;
        state.updateOrderDocumentSetting.data = null;
      })
      .addCase(updateOrderDocumentSetting.fulfilled, (state, action) => {
        state.updateOrderDocumentSetting.isLoading = false;
        state.updateOrderDocumentSetting.isSuccess = true;
        state.updateOrderDocumentSetting.data = action.payload;
      })
      .addCase(updateOrderDocumentSetting.rejected, (state, action) => {
        state.updateOrderDocumentSetting.message = action.payload.message;
        state.updateOrderDocumentSetting.isLoading = false;
        state.updateOrderDocumentSetting.isError = true;
        state.updateOrderDocumentSetting.data = null;
      })
      .addCase(createDeliveryNotesDocumentSetting.pending, (state) => {
        state.createDeliveryNotesDocumentSetting.isLoading = true;
        state.createDeliveryNotesDocumentSetting.message = "";
        state.createDeliveryNotesDocumentSetting.isError = false;
        state.createDeliveryNotesDocumentSetting.isSuccess = false;
        state.createDeliveryNotesDocumentSetting.data = null;
      })
      .addCase(createDeliveryNotesDocumentSetting.fulfilled, (state, action) => {
        state.createDeliveryNotesDocumentSetting.isLoading = false;
        state.createDeliveryNotesDocumentSetting.isSuccess = true;
        state.createDeliveryNotesDocumentSetting.data = action.payload;
      })
      .addCase(createDeliveryNotesDocumentSetting.rejected, (state, action) => {
        state.createDeliveryNotesDocumentSetting.message = action.payload.message;
        state.createDeliveryNotesDocumentSetting.isLoading = false;
        state.createDeliveryNotesDocumentSetting.isError = true;
        state.createDeliveryNotesDocumentSetting.data = null;
      })
      .addCase(updateDeliveryNotesDocumentSetting.pending, (state) => {
        state.updateDeliveryNotesDocumentSetting.isLoading = true;
        state.updateDeliveryNotesDocumentSetting.message = "";
        state.updateDeliveryNotesDocumentSetting.isError = false;
        state.updateDeliveryNotesDocumentSetting.isSuccess = false;
        state.updateDeliveryNotesDocumentSetting.data = null;
      })
      .addCase(updateDeliveryNotesDocumentSetting.fulfilled, (state, action) => {
        state.updateDeliveryNotesDocumentSetting.isLoading = false;
        state.updateDeliveryNotesDocumentSetting.isSuccess = true;
        state.updateDeliveryNotesDocumentSetting.data = action.payload;
      })
      .addCase(updateDeliveryNotesDocumentSetting.rejected, (state, action) => {
        state.updateDeliveryNotesDocumentSetting.message = action.payload.message;
        state.updateDeliveryNotesDocumentSetting.isLoading = false;
        state.updateDeliveryNotesDocumentSetting.isError = true;
        state.updateDeliveryNotesDocumentSetting.data = null;
      })
      .addCase(createInvoiceDocumentSetting.pending, (state) => {
        state.createInvoiceDocumentSetting.isLoading = true;
        state.createInvoiceDocumentSetting.message = "";
        state.createInvoiceDocumentSetting.isError = false;
        state.createInvoiceDocumentSetting.isSuccess = false;
        state.createInvoiceDocumentSetting.data = null;
      })
      .addCase(createInvoiceDocumentSetting.fulfilled, (state, action) => {
        state.createInvoiceDocumentSetting.isLoading = false;
        state.createInvoiceDocumentSetting.isSuccess = true;
        state.createInvoiceDocumentSetting.data = action.payload;
      })
      .addCase(createInvoiceDocumentSetting.rejected, (state, action) => {
        state.createInvoiceDocumentSetting.message = action.payload.message;
        state.createInvoiceDocumentSetting.isLoading = false;
        state.createInvoiceDocumentSetting.isError = true;
        state.createInvoiceDocumentSetting.data = null;
      })
      .addCase(updateInvoiceDocumentSetting.pending, (state) => {
        state.updateInvoiceDocumentSetting.isLoading = true;
        state.updateInvoiceDocumentSetting.message = "";
        state.updateInvoiceDocumentSetting.isError = false;
        state.updateInvoiceDocumentSetting.isSuccess = false;
        state.updateInvoiceDocumentSetting.data = null;
      })
      .addCase(updateInvoiceDocumentSetting.fulfilled, (state, action) => {
        state.updateInvoiceDocumentSetting.isLoading = false;
        state.updateInvoiceDocumentSetting.isSuccess = true;
        state.updateInvoiceDocumentSetting.data = action.payload;
      })
      .addCase(updateInvoiceDocumentSetting.rejected, (state, action) => {
        state.updateInvoiceDocumentSetting.message = action.payload.message;
        state.updateInvoiceDocumentSetting.isLoading = false;
        state.updateInvoiceDocumentSetting.isError = true;
        state.updateInvoiceDocumentSetting.data = null;
      })
      .addCase(createProductDocumentSetting.pending, (state) => {
        state.createProductDocumentSetting.isLoading = true;
        state.createProductDocumentSetting.message = "";
        state.createProductDocumentSetting.isError = false;
        state.createProductDocumentSetting.isSuccess = false;
        state.createProductDocumentSetting.data = null;
      })
      .addCase(createProductDocumentSetting.fulfilled, (state, action) => {
        state.createProductDocumentSetting.isLoading = false;
        state.createProductDocumentSetting.isSuccess = true;
        state.createProductDocumentSetting.data = action.payload;
      })
      .addCase(createProductDocumentSetting.rejected, (state, action) => {
        state.createProductDocumentSetting.message = action.payload.message;
        state.createProductDocumentSetting.isLoading = false;
        state.createProductDocumentSetting.isError = true;
        state.createProductDocumentSetting.data = null;
      })
      .addCase(updateProductDocumentSetting.pending, (state) => {
        state.updateProductDocumentSetting.isLoading = true;
        state.updateProductDocumentSetting.message = "";
        state.updateProductDocumentSetting.isError = false;
        state.updateProductDocumentSetting.isSuccess = false;
        state.updateProductDocumentSetting.data = null;
      })
      .addCase(updateProductDocumentSetting.fulfilled, (state, action) => {
        state.updateProductDocumentSetting.isLoading = false;
        state.updateProductDocumentSetting.isSuccess = true;
        state.updateProductDocumentSetting.data = action.payload;
      })
      .addCase(updateProductDocumentSetting.rejected, (state, action) => {
        state.updateProductDocumentSetting.message = action.payload.message;
        state.updateProductDocumentSetting.isLoading = false;
        state.updateProductDocumentSetting.isError = true;
        state.updateProductDocumentSetting.data = null;
      })
      .addCase(getDocumentSetting.pending, (state) => {
        state.getDocumentSetting.isLoading = true;
        state.getDocumentSetting.message = "";
        state.getDocumentSetting.isError = false;
        state.getDocumentSetting.isSuccess = false;
        state.getDocumentSetting.data = null;
      })
      .addCase(getDocumentSetting.fulfilled, (state, action) => {
        state.getDocumentSetting.isLoading = false;
        state.getDocumentSetting.isSuccess = true;
        state.getDocumentSetting.data = action.payload;
      })
      .addCase(getDocumentSetting.rejected, (state, action) => {
        state.getDocumentSetting.message = action.payload.message;
        state.getDocumentSetting.isLoading = false;
        state.getDocumentSetting.isError = true;
        state.getDocumentSetting.data = null;
      })
      .addCase(getCancellation.pending, (state) => {
        state.getCancellation.isLoading = true;
        state.getCancellation.message = "";
        state.getCancellation.isError = false;
        state.getCancellation.isSuccess = false;
        state.getCancellation.data = null;
      })
      .addCase(getCancellation.fulfilled, (state, action) => {
        state.getCancellation.isLoading = false;
        state.getCancellation.isSuccess = true;
        state.getCancellation.data = action.payload;
      })
      .addCase(getCancellation.rejected, (state, action) => {
        state.getCancellation.message = action.payload.message;
        state.getCancellation.isLoading = false;
        state.getCancellation.isError = true;
        state.getCancellation.data = null;
      })
      .addCase(createInvoiceCancellation.pending, (state) => {
        state.createInvoiceCancellation.isLoading = true;
        state.createInvoiceCancellation.message = "";
        state.createInvoiceCancellation.isError = false;
        state.createInvoiceCancellation.isSuccess = false;
        state.createInvoiceCancellation.data = null;
      })
      .addCase(createInvoiceCancellation.fulfilled, (state, action) => {
        state.createInvoiceCancellation.isLoading = false;
        state.createInvoiceCancellation.isSuccess = true;
        state.createInvoiceCancellation.data = action.payload;
      })
      .addCase(createInvoiceCancellation.rejected, (state, action) => {
        state.createInvoiceCancellation.message = action.payload.message;
        state.createInvoiceCancellation.isLoading = false;
        state.createInvoiceCancellation.isError = true;
        state.createInvoiceCancellation.data = null;
      })
      .addCase(updateInvoiceCancellation.pending, (state) => {
        state.updateInvoiceCancellation.isLoading = true;
        state.updateInvoiceCancellation.message = "";
        state.updateInvoiceCancellation.isError = false;
        state.updateInvoiceCancellation.isSuccess = false;
        state.updateInvoiceCancellation.data = null;
      })
      .addCase(updateInvoiceCancellation.fulfilled, (state, action) => {
        state.updateInvoiceCancellation.isLoading = false;
        state.updateInvoiceCancellation.isSuccess = true;
        state.updateInvoiceCancellation.data = action.payload;
      })
      .addCase(updateInvoiceCancellation.rejected, (state, action) => {
        state.updateInvoiceCancellation.message = action.payload.message;
        state.updateInvoiceCancellation.isLoading = false;
        state.updateInvoiceCancellation.isError = true;
        state.updateInvoiceCancellation.data = null;
      });
  },
});

export default settingSlice.reducer;
