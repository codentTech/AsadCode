import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from './user.service';

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  data: null
};

const initialState = {
  addPhoneAndGenerateOtp: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
    data: null
  },
  getAllBusinessOwner: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
    data: null
  },
  createBusinessOwner: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
    data: null
  },
  getSingleBusinessOwner: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
    data: null
  },
  updateBusinessOwner: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
    data: null
  },
  deleteBusinessOwner: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
    data: null
  },
  blockOrUnBlockBusinessOwner: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
    data: null
  },
  generateOtp: { ...generalState },
  verifyOtp: { ...generalState },
  user: { ...generalState },
  generateForgetPasswordLink: { ...generalState },
  regenerateEmailLink: { ...generalState },
  changePasswordFromLink: { ...generalState },
  changePassword: { ...generalState },
  verifyEmail: { ...generalState },
  twoFactorAuth: { ...generalState },
  checkEmailExists: { ...generalState },
  checkUsernameExists: { ...generalState },
  updateEmail: { ...generalState }
};

export const twoFactorAuth = createAsyncThunk(
  'user/twoFactorAuth',
  async ({ payload, callBackSuccess }, thunkAPI) => {
    try {
      const response = await userService.twoFactorAuth(payload);
      if (response.Succeeded) {
        return response.data;
      }
      callBackSuccess(response.Succeeded);
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const addPhoneAndGenerateOtp = createAsyncThunk(
  'user/addPhoneAndGenerateOtp',
  async ({ payload, successCallBack }, thunkAPI) => {
    try {
      const response = await userService.addPhoneAndGenerateOtp(payload);
      if (response.Succeeded) {
        successCallBack(response.Succeeded);
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const generateOtp = createAsyncThunk(
  'user/generateOtp',
  async ({ payload, callBackMessage, successCallBack }, thunkAPI) => {
    try {
      const response = await userService.generateOtp();
      if (response.Succeeded) {
        // successCallBack(response.data);
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'user/verifyOtp',
  async ({ payload, successCallBack, callBackMessage }, thunkAPI) => {
    try {
      const response = await userService.verifyOtp(payload);
      if (response.Succeeded) {
        successCallBack(response.Succeeded);
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'user/getCurrentUser',
  async ({ successCallBack }, thunkAPI) => {
    try {
      const response = await userService.getCurrentUser();
      if (response.Succeeded) {
        successCallBack(response.data);
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const regenerateEmailLink = createAsyncThunk(
  'user/regenerateEmailLink',
  async ({ payload, successCallBack }, thunkAPI) => {
    try {
      const response = await userService.regenerateEmailLink(payload);
      if (response.Succeeded) {
        successCallBack(response);
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const changePasswordFromLink = createAsyncThunk(
  'user/changePasswordFromLink',
  async ({ payload, successCallBack, callBackMessage }, thunkAPI) => {
    try {
      const response = await userService.changePasswordFromLink(payload);
      if (response.Succeeded) {
        successCallBack();
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await userService.changePassword(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const generateForgetPasswordLink = createAsyncThunk(
  'user/generateForgetPasswordLink',
  async ({ payload, successCallBack }, thunkAPI) => {
    try {
      const response = await userService.generateForgetPasswordLink(payload);
      if (response.Succeeded) {
        successCallBack(response.data);
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'user/verifyEmail',
  async ({ payload, successCallBack, errorCallBack }, thunkAPI) => {
    try {
      const response = await userService.verifyEmail(payload);
      if (response.Succeeded) {
        localStorage.setItem('user', JSON.stringify(response.data));
        successCallBack(response.data);
        return response.data;
      } else {
        errorCallBack();
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllBusinessOwner = createAsyncThunk(
  '/business-owner/getAllBusinessOwner',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await userService.getAllBusinessOwner(payload);
      if (response.Succeeded) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);
export const createBusinessOwner = createAsyncThunk(
  '/business-owner/createBusinessOwner',
  async ({ payload, callBackMessage }, thunkAPI) => {
    try {
      const response = await userService.createBusinessOwner(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getSingleBusinessOwner = createAsyncThunk(
  '/business-owner/getSingleBusinessOwner',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await userService.getSingleBusinessOwner(payload);
      if (response.Succeeded) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateBusinessOwner = createAsyncThunk(
  '/business-owner/updateBusinessOwner',
  async ({ payload, id, successCallback }, thunkAPI) => {
    try {
      const response = await userService.updateBusinessOwner(payload, id);
      if (response.Succeeded) {
        if (successCallback) {
          successCallback();
        }
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const blockOrUnBlockBusinessOwner = createAsyncThunk(
  '/business-owner/blockOrUnBlockBusinessOwner',
  async ({ payload: { id, data }, successCallback }, thunkAPI) => {
    try {
      const response = await userService.blockOrUnBlockBusinessOwner(data, id);
      if (response.Succeeded) {
        if (successCallback) {
          successCallback();
        }
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteBusinessOwner = createAsyncThunk(
  '/business-owner/deleteBusinessOwner',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await userService.deleteBusinessOwner(payload);
      if (response.Succeeded) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const checkEmailExists = createAsyncThunk(
  '/business-owner/checkEmailExists',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await userService.checkEmailExists(payload);
      if (response.Succeeded) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const checkUsernameExists = createAsyncThunk(
  '/business-owner/checkUsernameExists',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await userService.checkUsernameExists(payload);
      if (response.Succeeded) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateEmail = createAsyncThunk(
  '/user/updateEmail',
  async ({ payload }, thunkAPI) => {
    try {
      const response = await userService.updateEmail(payload);
      if (response.Succeeded) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(blockOrUnBlockBusinessOwner.pending, (state) => {
        state.blockOrUnBlockBusinessOwner.isLoading = true;
        state.blockOrUnBlockBusinessOwner.message = '';
        state.blockOrUnBlockBusinessOwner.isError = false;
        state.blockOrUnBlockBusinessOwner.isSuccess = false;
        state.blockOrUnBlockBusinessOwner.data = null;
      })
      .addCase(blockOrUnBlockBusinessOwner.fulfilled, (state, action) => {
        state.blockOrUnBlockBusinessOwner.isLoading = false;
        state.blockOrUnBlockBusinessOwner.isSuccess = true;
        state.blockOrUnBlockBusinessOwner.data = action.payload;
      })
      .addCase(blockOrUnBlockBusinessOwner.rejected, (state, action) => {
        state.blockOrUnBlockBusinessOwner.message = action.payload.message;
        state.blockOrUnBlockBusinessOwner.isLoading = false;
        state.blockOrUnBlockBusinessOwner.isError = true;
        state.blockOrUnBlockBusinessOwner.data = null;
      })
      .addCase(checkEmailExists.pending, (state) => {
        state.checkEmailExists.isLoading = true;
        state.checkEmailExists.message = '';
        state.checkEmailExists.isError = false;
        state.checkEmailExists.isSuccess = false;
        state.checkEmailExists.data = null;
      })
      .addCase(checkEmailExists.fulfilled, (state, action) => {
        state.checkEmailExists.isLoading = false;
        state.checkEmailExists.isSuccess = true;
        state.checkEmailExists.data = action.payload;
      })
      .addCase(checkEmailExists.rejected, (state, action) => {
        state.checkEmailExists.message = action.payload.message;
        state.checkEmailExists.isLoading = false;
        state.checkEmailExists.isError = true;
        state.checkEmailExists.data = null;
      })
      .addCase(checkUsernameExists.pending, (state) => {
        state.checkUsernameExists.isLoading = true;
        state.checkUsernameExists.message = '';
        state.checkUsernameExists.isError = false;
        state.checkUsernameExists.isSuccess = false;
        state.checkUsernameExists.data = null;
      })
      .addCase(checkUsernameExists.fulfilled, (state, action) => {
        state.checkUsernameExists.isLoading = false;
        state.checkUsernameExists.isSuccess = true;
        state.checkUsernameExists.data = action.payload;
      })
      .addCase(checkUsernameExists.rejected, (state, action) => {
        state.checkUsernameExists.message = action.payload.message;
        state.checkUsernameExists.isLoading = false;
        state.checkUsernameExists.isError = true;
        state.checkUsernameExists.data = null;
      })
      .addCase(deleteBusinessOwner.pending, (state) => {
        state.deleteBusinessOwner.isLoading = true;
        state.deleteBusinessOwner.message = '';
        state.deleteBusinessOwner.isError = false;
        state.deleteBusinessOwner.isSuccess = false;
        state.deleteBusinessOwner.data = null;
      })
      .addCase(deleteBusinessOwner.fulfilled, (state, action) => {
        state.deleteBusinessOwner.isLoading = false;
        state.deleteBusinessOwner.isSuccess = true;
        state.deleteBusinessOwner.data = action.payload;
      })
      .addCase(deleteBusinessOwner.rejected, (state, action) => {
        state.deleteBusinessOwner.message = action.payload.message;
        state.deleteBusinessOwner.isLoading = false;
        state.deleteBusinessOwner.isError = true;
        state.deleteBusinessOwner.data = null;
      })
      .addCase(getSingleBusinessOwner.pending, (state) => {
        state.getSingleBusinessOwner.isLoading = true;
        state.getSingleBusinessOwner.message = '';
        state.getSingleBusinessOwner.isError = false;
        state.getSingleBusinessOwner.isSuccess = false;
        state.getSingleBusinessOwner.data = null;
      })
      .addCase(getSingleBusinessOwner.fulfilled, (state, action) => {
        state.getSingleBusinessOwner.isLoading = false;
        state.getSingleBusinessOwner.isSuccess = true;
        state.getSingleBusinessOwner.data = action.payload;
      })
      .addCase(getSingleBusinessOwner.rejected, (state, action) => {
        state.getSingleBusinessOwner.message = action.payload.message;
        state.getSingleBusinessOwner.isLoading = false;
        state.getSingleBusinessOwner.isError = true;
        state.getSingleBusinessOwner.data = null;
      })
      .addCase(createBusinessOwner.pending, (state) => {
        state.createBusinessOwner.isLoading = true;
        state.createBusinessOwner.message = '';
        state.createBusinessOwner.isError = false;
        state.createBusinessOwner.isSuccess = false;
        state.createBusinessOwner.data = null;
      })
      .addCase(createBusinessOwner.fulfilled, (state, action) => {
        state.createBusinessOwner.isLoading = false;
        state.createBusinessOwner.isSuccess = true;
        state.createBusinessOwner.data = action.payload;
      })
      .addCase(createBusinessOwner.rejected, (state, action) => {
        state.createBusinessOwner.message = action.payload.message;
        state.createBusinessOwner.isLoading = false;
        state.createBusinessOwner.isError = true;
        state.createBusinessOwner.data = null;
      })
      .addCase(updateBusinessOwner.pending, (state) => {
        state.updateBusinessOwner.isLoading = true;
        state.updateBusinessOwner.message = '';
        state.updateBusinessOwner.isError = false;
        state.updateBusinessOwner.isSuccess = false;
        state.updateBusinessOwner.data = null;
      })
      .addCase(updateBusinessOwner.fulfilled, (state, action) => {
        state.updateBusinessOwner.isLoading = false;
        state.updateBusinessOwner.isSuccess = true;
        state.updateBusinessOwner.data = action.payload;
      })
      .addCase(updateBusinessOwner.rejected, (state, action) => {
        state.updateBusinessOwner.message = action.payload.message;
        state.updateBusinessOwner.isLoading = false;
        state.updateBusinessOwner.isError = true;
        state.updateBusinessOwner.data = null;
      })
      .addCase(getAllBusinessOwner.pending, (state) => {
        state.getAllBusinessOwner.isLoading = true;
        state.getAllBusinessOwner.message = '';
        state.getAllBusinessOwner.isError = false;
        state.getAllBusinessOwner.isSuccess = false;
        state.getAllBusinessOwner.data = null;
      })
      .addCase(getAllBusinessOwner.fulfilled, (state, action) => {
        state.getAllBusinessOwner.isLoading = false;
        state.getAllBusinessOwner.isSuccess = true;
        state.getAllBusinessOwner.data = action.payload;
      })
      .addCase(getAllBusinessOwner.rejected, (state, action) => {
        state.getAllBusinessOwner.message = action.payload.message;
        state.getAllBusinessOwner.isLoading = false;
        state.getAllBusinessOwner.isError = true;
        state.getAllBusinessOwner.data = null;
      })
      .addCase(addPhoneAndGenerateOtp.pending, (state) => {
        state.addPhoneAndGenerateOtp.isLoading = true;
        state.addPhoneAndGenerateOtp.message = '';
        state.addPhoneAndGenerateOtp.isError = false;
        state.addPhoneAndGenerateOtp.isSuccess = false;
        state.addPhoneAndGenerateOtp.data = null;
      })
      .addCase(addPhoneAndGenerateOtp.fulfilled, (state, action) => {
        state.addPhoneAndGenerateOtp.isLoading = false;
        state.addPhoneAndGenerateOtp.isSuccess = true;
        state.addPhoneAndGenerateOtp.data = action.payload;
      })
      .addCase(addPhoneAndGenerateOtp.rejected, (state, action) => {
        state.addPhoneAndGenerateOtp.message = action.payload.message;
        state.addPhoneAndGenerateOtp.isLoading = false;
        state.addPhoneAndGenerateOtp.isError = true;
        state.addPhoneAndGenerateOtp.data = null;
      })
      .addCase(generateOtp.pending, (state) => {
        state.generateOtp.isLoading = true;
        state.generateOtp.message = '';
        state.generateOtp.isError = false;
        state.generateOtp.isSuccess = false;
        state.generateOtp.data = null;
      })
      .addCase(generateOtp.fulfilled, (state, action) => {
        state.generateOtp.isLoading = false;
        state.generateOtp.isSuccess = true;
        state.generateOtp.data = action.payload;
      })
      .addCase(generateOtp.rejected, (state, action) => {
        // state.generateOtp.message = action.payload.message;
        state.generateOtp.isLoading = false;
        state.generateOtp.isError = true;
        state.generateOtp.data = null;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.verifyOtp.isLoading = true;
        state.verifyOtp.message = '';
        state.verifyOtp.isError = false;
        state.verifyOtp.isSuccess = false;
        state.verifyOtp.data = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.verifyOtp.isLoading = false;
        state.verifyOtp.isSuccess = true;
        state.verifyOtp.data = action.payload;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.verifyOtp.message = action.payload.message;
        state.verifyOtp.isLoading = false;
        state.verifyOtp.isError = true;
        state.verifyOtp.data = null;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.user.isLoading = true;
        state.user.message = '';
        state.user.isError = false;
        state.user.isSuccess = false;
        state.user.data = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user.isLoading = false;
        state.user.isSuccess = true;
        state.user.data = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.user.message = action?.payload?.message;
        state.user.isLoading = false;
        state.user.isError = true;
        state.user.data = null;
      })
      .addCase(generateForgetPasswordLink.pending, (state) => {
        state.generateForgetPasswordLink.isLoading = true;
        state.generateForgetPasswordLink.message = '';
        state.generateForgetPasswordLink.isError = false;
        state.generateForgetPasswordLink.isSuccess = false;
        state.generateForgetPasswordLink.data = null;
      })
      .addCase(generateForgetPasswordLink.fulfilled, (state, action) => {
        state.generateForgetPasswordLink.isLoading = false;
        state.generateForgetPasswordLink.isSuccess = true;
        state.generateForgetPasswordLink.data = action.payload;
      })
      .addCase(generateForgetPasswordLink.rejected, (state, action) => {
        state.generateForgetPasswordLink.message = action.payload.message;
        state.generateForgetPasswordLink.isLoading = false;
        state.generateForgetPasswordLink.isError = true;
        state.generateForgetPasswordLink.data = null;
      })
      .addCase(regenerateEmailLink.pending, (state) => {
        state.regenerateEmailLink.isLoading = true;
        state.regenerateEmailLink.message = '';
        state.regenerateEmailLink.isError = false;
        state.regenerateEmailLink.isSuccess = false;
        state.regenerateEmailLink.data = null;
      })
      .addCase(regenerateEmailLink.fulfilled, (state, action) => {
        state.regenerateEmailLink.isLoading = false;
        state.regenerateEmailLink.isSuccess = true;
        state.regenerateEmailLink.data = action.payload;
      })
      .addCase(regenerateEmailLink.rejected, (state, action) => {
        state.regenerateEmailLink.message = action.payload.message;
        state.regenerateEmailLink.isLoading = false;
        state.regenerateEmailLink.isError = true;
        state.regenerateEmailLink.data = null;
      })
      .addCase(changePasswordFromLink.pending, (state) => {
        state.changePasswordFromLink.isLoading = true;
        state.changePasswordFromLink.message = '';
        state.changePasswordFromLink.isError = false;
        state.changePasswordFromLink.isSuccess = false;
        state.changePasswordFromLink.data = null;
      })
      .addCase(changePasswordFromLink.fulfilled, (state, action) => {
        state.changePasswordFromLink.isLoading = false;
        state.changePasswordFromLink.isSuccess = true;
        state.changePasswordFromLink.data = action.payload;
      })
      .addCase(changePasswordFromLink.rejected, (state, action) => {
        state.changePasswordFromLink.message = action.payload.message;
        state.changePasswordFromLink.isLoading = false;
        state.changePasswordFromLink.isError = true;
        state.changePasswordFromLink.data = null;
      })
      .addCase(changePassword.pending, (state) => {
        state.changePassword.isLoading = true;
        state.changePassword.message = '';
        state.changePassword.isError = false;
        state.changePassword.isSuccess = false;
        state.changePassword.data = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.changePassword.isLoading = false;
        state.changePassword.isSuccess = true;
        state.changePassword.data = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePassword.message = action.payload.message;
        state.changePassword.isLoading = false;
        state.changePassword.isError = true;
        state.changePassword.data = null;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.verifyEmail.isLoading = true;
        state.verifyEmail.message = '';
        state.verifyEmail.isError = false;
        state.verifyEmail.isSuccess = false;
        state.verifyEmail.data = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.verifyEmail.isLoading = false;
        state.verifyEmail.isSuccess = true;
        state.verifyEmail.data = action.payload;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.verifyEmail.message = action.payload.message;
        state.verifyEmail.isLoading = false;
        state.verifyEmail.isError = true;
        state.verifyEmail.data = null;
      })
      .addCase(twoFactorAuth.pending, (state) => {
        state.twoFactorAuth.isLoading = true;
        state.twoFactorAuth.message = '';
        state.twoFactorAuth.isError = false;
        state.twoFactorAuth.isSuccess = false;
        state.twoFactorAuth.data = null;
      })
      .addCase(twoFactorAuth.fulfilled, (state, action) => {
        state.twoFactorAuth.isLoading = false;
        state.twoFactorAuth.isSuccess = true;
        state.twoFactorAuth.data = action.payload;
      })
      .addCase(twoFactorAuth.rejected, (state, action) => {
        state.twoFactorAuth.message = action.payload.message;
        state.twoFactorAuth.isLoading = false;
        state.twoFactorAuth.isError = true;
        state.twoFactorAuth.data = null;
      })
      .addCase(updateEmail.pending, (state) => {
        state.updateEmail.isLoading = true;
        state.updateEmail.message = '';
        state.updateEmail.isError = false;
        state.updateEmail.isSuccess = false;
        state.updateEmail.data = null;
      })
      .addCase(updateEmail.fulfilled, (state, action) => {
        state.updateEmail.isLoading = false;
        state.updateEmail.isSuccess = true;
        state.updateEmail.data = action.payload;
      })
      .addCase(updateEmail.rejected, (state, action) => {
        state.updateEmail.message = action.payload.message;
        state.updateEmail.isLoading = false;
        state.updateEmail.isError = true;
        state.updateEmail.data = null;
      });
  }
});

export default userSlice.reducer;
