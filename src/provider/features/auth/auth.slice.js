import { getUser } from "@/common/utils/users.util";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { resetOnboardingSession } from "@/provider/features/onboarding/onboarding.slice";
import authService from "./auth.service";

const normalizeAuthMessage = (value) => {
  if (value == null || value === "") return "";
  if (Array.isArray(value)) {
    const first = value.find((x) => x != null && String(x).trim() !== "");
    if (first != null) return String(first);
    return value.filter(Boolean).join(" ");
  }
  return String(value);
};

const getSerializableError = (error) => {
  if (error?.response?.data?.message != null) {
    return { message: normalizeAuthMessage(error.response.data.message) || "An unexpected error occurred" };
  }
  if (error?.message) {
    return { message: normalizeAuthMessage(error.message) || "An unexpected error occurred" };
  }
  if (typeof error === "string") {
    return { message: error };
  }
  return { message: "An unexpected error occurred" };
};

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const ensurePasswordResetRequest = (state) => {
  if (!state.passwordResetRequest) {
    state.passwordResetRequest = { ...generalState };
  }
};

const ensurePasswordResetSubmit = (state) => {
  if (!state.passwordResetSubmit) {
    state.passwordResetSubmit = { ...generalState };
  }
};

const ensureImpersonateUser = (state) => {
  if (!state.impersonateUser) {
    state.impersonateUser = { ...generalState };
  }
};

const ensureExitImpersonation = (state) => {
  if (!state.exitImpersonation) {
    state.exitImpersonation = { ...generalState };
  }
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
  sendVerificationEmail: generalState,
  resendEmail: generalState,
  passwordResetRequest: generalState,
  passwordResetSubmit: generalState,
  impersonateUser: generalState,
  exitImpersonation: generalState,
  logout: generalState,
  loginAndSignUpWithOAuth: generalState,
  loginAndSignUpWithLinkedin: generalState,
};

// Login user
export const login = createAsyncThunk("auth/login", async (payload, thunkAPI) => {
  try {
    const response = await authService.login(payload);
    if (response.success) {
      thunkAPI.dispatch(resetOnboardingSession());
      return response;
    }
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(getSerializableError(error));
  }
});

// signUp user
export const signUp = createAsyncThunk("auth/register", async (payload, thunkAPI) => {
  try {
    const response = await authService.signUp(payload);
    if (response.success) return response;

    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(getSerializableError(error));
  }
});

export const verifyEmail = createAsyncThunk("auth/verifyEmail", async (payload, thunkAPI) => {
  try {
    const response = await authService.verifyEmail(payload);
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(getSerializableError(error));
  }
});

export const sendVerificationEmail = createAsyncThunk(
  "auth/sendVerificationEmail",
  async (payload, thunkAPI) => {
    try {
      const response = await authService.sendVerificationEmail(payload);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const resendEmail = createAsyncThunk("auth/resendEmail", async (payload, thunkAPI) => {
  try {
    const response = await authService.resendEmail(payload);
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(getSerializableError(error));
  }
});

export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (email, thunkAPI) => {
    try {
      const response = await authService.requestPasswordReset(email);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const resetPasswordWithToken = createAsyncThunk(
  "auth/resetPasswordWithToken",
  async (payload, thunkAPI) => {
    try {
      const response = await authService.resetPasswordWithToken(payload);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const impersonateUser = createAsyncThunk(
  "auth/impersonateUser",
  async (userId, thunkAPI) => {
    try {
      const response = await authService.impersonate(userId);
      if (!response?.success) {
        return thunkAPI.rejectWithValue(response);
      }

      const payload = response?.data;
      if (payload?.token && payload?.user && typeof window === "object" && window?.localStorage) {
        const activeToken = localStorage.getItem("token");
        const activeUser = localStorage.getItem("user");
        if (!localStorage.getItem("admin_token") && activeToken) {
          localStorage.setItem("admin_token", activeToken);
        }
        if (!localStorage.getItem("admin_user") && activeUser) {
          localStorage.setItem("admin_user", activeUser);
        }
        localStorage.setItem("token", payload.token);
        localStorage.setItem("user", JSON.stringify(payload.user));
      }

      thunkAPI.dispatch(resetOnboardingSession());

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const exitImpersonation = createAsyncThunk(
  "auth/exitImpersonation",
  async (_, thunkAPI) => {
    try {
      const response = await authService.exitImpersonation();
      if (!response?.success) {
        return thunkAPI.rejectWithValue(response);
      }

      const payload = response?.data;
      if (payload?.token && payload?.user && typeof window === "object" && window?.localStorage) {
        localStorage.setItem("token", payload.token);
        localStorage.setItem("user", JSON.stringify(payload.user));
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
      }

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

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
      state.sendVerificationEmail = generalState;
      state.resendEmail = generalState;
      state.passwordResetRequest = generalState;
      state.passwordResetSubmit = generalState;
      state.impersonateUser = generalState;
      state.exitImpersonation = generalState;
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
        const role = action.payload?.data?.user?.role;
        if (role === "CREATOR") {
          state.isCreatorMode = true;
        } else if (role === "BRAND") {
          state.isCreatorMode = false;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.login.message = action.payload?.message || "Login failed";
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
        state.signUp.message = action.payload?.message || "Sign up failed";
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
        state.verifyEmail.message = action.payload?.message || "Email verification failed";
        state.verifyEmail.isLoading = false;
        state.verifyEmail.isError = true;
        state.verifyEmail.data = null;
      })
      .addCase(sendVerificationEmail.pending, (state) => {
        if (!state.sendVerificationEmail) state.sendVerificationEmail = { ...generalState };
        state.sendVerificationEmail.isLoading = true;
        state.sendVerificationEmail.message = "";
        state.sendVerificationEmail.isError = false;
        state.sendVerificationEmail.isSuccess = false;
        state.sendVerificationEmail.data = null;
      })
      .addCase(sendVerificationEmail.fulfilled, (state, action) => {
        if (!state.sendVerificationEmail) state.sendVerificationEmail = { ...generalState };
        state.sendVerificationEmail.isLoading = false;
        state.sendVerificationEmail.isSuccess = true;
        state.sendVerificationEmail.data = action.payload;
      })
      .addCase(sendVerificationEmail.rejected, (state, action) => {
        if (!state.sendVerificationEmail) state.sendVerificationEmail = { ...generalState };
        state.sendVerificationEmail.message = action.payload?.message || "Failed to send email";
        state.sendVerificationEmail.isLoading = false;
        state.sendVerificationEmail.isError = true;
        state.sendVerificationEmail.data = null;
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
        state.resendEmail.message = action.payload?.message || "Resend email failed";
        state.resendEmail.isLoading = false;
        state.resendEmail.isError = true;
        state.resendEmail.data = null;
      })
      .addCase(requestPasswordReset.pending, (state) => {
        ensurePasswordResetRequest(state);
        state.passwordResetRequest.isLoading = true;
        state.passwordResetRequest.message = "";
        state.passwordResetRequest.isError = false;
        state.passwordResetRequest.isSuccess = false;
        state.passwordResetRequest.data = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        ensurePasswordResetRequest(state);
        state.passwordResetRequest.isLoading = false;
        state.passwordResetRequest.isSuccess = true;
        state.passwordResetRequest.message = action.payload?.message || "";
        state.passwordResetRequest.data = action.payload;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        ensurePasswordResetRequest(state);
        state.passwordResetRequest.message =
          action.payload?.message || "Could not send reset email";
        state.passwordResetRequest.isLoading = false;
        state.passwordResetRequest.isError = true;
        state.passwordResetRequest.data = null;
      })
      .addCase(resetPasswordWithToken.pending, (state) => {
        ensurePasswordResetSubmit(state);
        state.passwordResetSubmit.isLoading = true;
        state.passwordResetSubmit.message = "";
        state.passwordResetSubmit.isError = false;
        state.passwordResetSubmit.isSuccess = false;
        state.passwordResetSubmit.data = null;
      })
      .addCase(resetPasswordWithToken.fulfilled, (state, action) => {
        ensurePasswordResetSubmit(state);
        state.passwordResetSubmit.isLoading = false;
        state.passwordResetSubmit.isSuccess = true;
        state.passwordResetSubmit.data = action.payload;
      })
      .addCase(resetPasswordWithToken.rejected, (state, action) => {
        ensurePasswordResetSubmit(state);
        state.passwordResetSubmit.message =
          action.payload?.message || "Password reset failed";
        state.passwordResetSubmit.isLoading = false;
        state.passwordResetSubmit.isError = true;
        state.passwordResetSubmit.data = null;
      })
      .addCase(impersonateUser.pending, (state) => {
        ensureImpersonateUser(state);
        state.impersonateUser.isLoading = true;
        state.impersonateUser.isError = false;
        state.impersonateUser.isSuccess = false;
        state.impersonateUser.message = "";
        state.impersonateUser.data = null;
      })
      .addCase(impersonateUser.fulfilled, (state, action) => {
        ensureImpersonateUser(state);
        state.impersonateUser.isLoading = false;
        state.impersonateUser.isSuccess = true;
        state.impersonateUser.data = action.payload;
      })
      .addCase(impersonateUser.rejected, (state, action) => {
        ensureImpersonateUser(state);
        state.impersonateUser.isLoading = false;
        state.impersonateUser.isError = true;
        state.impersonateUser.message = action.payload?.message || "Failed to impersonate user";
        state.impersonateUser.data = null;
      })
      .addCase(exitImpersonation.pending, (state) => {
        ensureExitImpersonation(state);
        state.exitImpersonation.isLoading = true;
        state.exitImpersonation.isError = false;
        state.exitImpersonation.isSuccess = false;
        state.exitImpersonation.message = "";
        state.exitImpersonation.data = null;
      })
      .addCase(exitImpersonation.fulfilled, (state, action) => {
        ensureExitImpersonation(state);
        state.exitImpersonation.isLoading = false;
        state.exitImpersonation.isSuccess = true;
        state.exitImpersonation.data = action.payload;
      })
      .addCase(exitImpersonation.rejected, (state, action) => {
        ensureExitImpersonation(state);
        state.exitImpersonation.isLoading = false;
        state.exitImpersonation.isError = true;
        state.exitImpersonation.message =
          action.payload?.message || "Failed to exit impersonation";
        state.exitImpersonation.data = null;
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
