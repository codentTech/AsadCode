import { getUser } from "@/common/utils/users.util";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./auth.service";

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

// Get user from localStorage
const user = getUser();
const initialState = {
  isCreatorMode: null,
  sidebarActiveItem: null,
  sidebarSections: null,
  logoutLoader: false,
  login: generalState,
  signUp: generalState,
  verifyEmail: generalState,
  resendEmail: generalState,
  logout: generalState,
  loginAndSignUpWithOAuth: generalState,
  loginAndSignUpWithLinkedin: generalState,
};

// Login user
export const login = createAsyncThunk("auth/login", async (payload, thunkAPI) => {
  try {
    const response = await authService.login(payload);
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue({ payload: error });
  }
});
// signUp user
export const signUp = createAsyncThunk("auth/register", async (payload, thunkAPI) => {
  try {
    const response = await authService.signUp(payload);
    if (response.success) return response;

    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue({ payload: error });
  }
});

export const verifyEmail = createAsyncThunk("auth/verifyEmail", async (payload, thunkAPI) => {
  try {
    const response = await authService.verifyEmail(payload);
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue({ payload: error });
  }
});

export const resendEmail = createAsyncThunk("auth/resendEmail", async (payload, thunkAPI) => {
  try {
    const response = await authService.resendEmail(payload);
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue({ payload: error });
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsCreatorModeMode: (state, action) => {
      state.isCreatorMode = action.payload;
    },
    setSidebarActiveItem: (state, action) => {
      state.sidebarActiveItem = action.payload;
    },
    expandedSidebarSections: (state, action) => {
      state.sidebarSections = action.payload;
    },
    setLogoutLoader: (state, action) => {
      state.logoutLoader = action.payload;
    },
    reset: (state) => {
      state.login = generalState;
      state.logout = generalState;
      state.signUp = generalState;
      state.verifyEmail = generalState;
      state.resendEmail = generalState;
      state.loginAndSignUpWithOAuth = generalState;
      state.loginAndSignUpWithLinkedin = generalState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.login.isLoading = true;
        state.login.message = "";
        state.login.isError = false;
        state.login.isSuccess = false;
        state.login.data = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.login.isLoading = false;
        state.login.isSuccess = true;
        state.login.data = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.login.message = action.payload.message;
        state.login.isLoading = false;
        state.login.isError = true;
        state.login.data = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.signUp.isLoading = false;
        state.signUp.isSuccess = true;
        state.signUp.data = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.signUp.message = action.payload.message;
        state.signUp.isLoading = false;
        state.signUp.isError = true;
        state.signUp.data = null;
      })
      .addCase(signUp.pending, (state) => {
        state.signUp.isLoading = true;
        state.signUp.message = "";
        state.signUp.isError = false;
        state.signUp.isSuccess = false;
        state.signUp.data = null;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.verifyEmail.isLoading = true;
        state.verifyEmail.message = "";
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
      .addCase(resendEmail.pending, (state) => {
        state.resendEmail.isLoading = true;
        state.resendEmail.message = "";
        state.resendEmail.isError = false;
        state.resendEmail.isSuccess = false;
        state.resendEmail.data = null;
      })
      .addCase(resendEmail.fulfilled, (state, action) => {
        state.resendEmail.isLoading = false;
        state.resendEmail.isSuccess = true;
        state.resendEmail.data = action.payload;
      })
      .addCase(resendEmail.rejected, (state, action) => {
        state.resendEmail.message = action.payload.message;
        state.resendEmail.isLoading = false;
        state.resendEmail.isError = true;
        state.resendEmail.data = null;
      });
  },
});

export const {
  reset,
  setIsCreatorModeMode,
  setSidebarActiveItem,
  setLogoutLoader,
  expandedSidebarSections,
} = authSlice.actions;

export default authSlice.reducer;
