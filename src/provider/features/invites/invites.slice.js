import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { parseInviteValidationBody } from "@/common/utils/invite-token.util";
import invitesService from "./invites.service";

const generalState = {
  data: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const initialState = {
  validateInviteToken: { ...generalState },
};

export const validateInviteToken = createAsyncThunk(
  "invites/validateInviteToken",
  async (token, thunkAPI) => {
    try {
      const body = await invitesService.validateTokenOnly(token);
      const parsed = parseInviteValidationBody(body);
      if (parsed.valid) {
        return parsed;
      }
      return thunkAPI.rejectWithValue({
        message:
          parsed.message || body?.message || "This invite link is invalid or has expired.",
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Could not verify this invite link. Please try again.";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

const invitesSlice = createSlice({
  name: "invites",
  initialState,
  reducers: {
    resetValidateInviteToken: (state) => {
      state.validateInviteToken = { ...generalState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateInviteToken.pending, (state) => {
        state.validateInviteToken.isLoading = true;
        state.validateInviteToken.isError = false;
        state.validateInviteToken.isSuccess = false;
        state.validateInviteToken.message = "";
        state.validateInviteToken.data = null;
      })
      .addCase(validateInviteToken.fulfilled, (state, action) => {
        state.validateInviteToken.isLoading = false;
        state.validateInviteToken.isSuccess = true;
        state.validateInviteToken.isError = false;
        state.validateInviteToken.message = "";
        state.validateInviteToken.data = action.payload;
      })
      .addCase(validateInviteToken.rejected, (state, action) => {
        state.validateInviteToken.isLoading = false;
        state.validateInviteToken.isSuccess = false;
        state.validateInviteToken.isError = true;
        state.validateInviteToken.message =
          action.payload?.message || "Could not verify this invite link. Please try again.";
        state.validateInviteToken.data = null;
      });
  },
});

export const { resetValidateInviteToken } = invitesSlice.actions;

export const selectValidateInviteToken = (state) => state.invites?.validateInviteToken;

export default invitesSlice.reducer;
