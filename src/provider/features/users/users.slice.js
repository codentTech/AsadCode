import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import usersService from "./users.service";

const generalState = {
  data: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const initialState = {
  getAllUsers: { ...generalState },
  toggleBlockUser: { ...generalState },
  adminToggleBlockUser: { ...generalState },
  getBlockedUsers: { ...generalState },
  isUserBlocked: { ...generalState },
};

export const getAllUsers = createAsyncThunk("users/getAllUsers", async (_, thunkAPI) => {
  try {
    const response = await usersService.getAllUsers();
    if (response.success) {
      return response;
    }
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const toggleBlockUser = createAsyncThunk("users/toggleBlockUser", async (data, thunkAPI) => {
  try {
    const response = await usersService.toggleBlockUser(data);
    if (response.success) {
      return response;
    }
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const adminToggleBlockUser = createAsyncThunk(
  "users/adminToggleBlockUser",
  async (data, thunkAPI) => {
    try {
      const response = await usersService.adminToggleBlockUser(data);
      if (response.success) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getBlockedUsers = createAsyncThunk("users/getBlockedUsers", async (_, thunkAPI) => {
  try {
    const response = await usersService.getBlockedUsers();
    if (response.success) {
      return response;
    }
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const isUserBlocked = createAsyncThunk("users/isUserBlocked", async (userId, thunkAPI) => {
  try {
    const response = await usersService.isUserBlocked(userId);
    if (response.success) {
      return response;
    }
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reset: (state) => {
      state.getAllUsers = { ...generalState };
      state.toggleBlockUser = { ...generalState };
      state.adminToggleBlockUser = { ...generalState };
      state.getBlockedUsers = { ...generalState };
      state.isUserBlocked = { ...generalState };
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllUsers
      .addCase(getAllUsers.pending, (state) => {
        state.getAllUsers.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.getAllUsers.isLoading = false;
        state.getAllUsers.isSuccess = true;
        state.getAllUsers.data = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.getAllUsers.isLoading = false;
        state.getAllUsers.isError = true;
        state.getAllUsers.message = action.payload;
      })
      // toggleBlockUser
      .addCase(toggleBlockUser.pending, (state) => {
        state.toggleBlockUser.isLoading = true;
      })
      .addCase(toggleBlockUser.fulfilled, (state, action) => {
        state.toggleBlockUser.isLoading = false;
        state.toggleBlockUser.isSuccess = true;
        state.toggleBlockUser.data = action.payload;
      })
      .addCase(toggleBlockUser.rejected, (state, action) => {
        state.toggleBlockUser.isLoading = false;
        state.toggleBlockUser.isError = true;
        state.toggleBlockUser.message = action.payload;
      })
      // adminToggleBlockUser
      .addCase(adminToggleBlockUser.pending, (state) => {
        state.adminToggleBlockUser.isLoading = true;
      })
      .addCase(adminToggleBlockUser.fulfilled, (state, action) => {
        state.adminToggleBlockUser.isLoading = false;
        state.adminToggleBlockUser.isSuccess = true;
        state.adminToggleBlockUser.data = action.payload;
      })
      .addCase(adminToggleBlockUser.rejected, (state, action) => {
        state.adminToggleBlockUser.isLoading = false;
        state.adminToggleBlockUser.isError = true;
        state.adminToggleBlockUser.message = action.payload;
      })
      // getBlockedUsers
      .addCase(getBlockedUsers.pending, (state) => {
        state.getBlockedUsers.isLoading = true;
      })
      .addCase(getBlockedUsers.fulfilled, (state, action) => {
        state.getBlockedUsers.isLoading = false;
        state.getBlockedUsers.isSuccess = true;
        state.getBlockedUsers.data = action.payload;
      })
      .addCase(getBlockedUsers.rejected, (state, action) => {
        state.getBlockedUsers.isLoading = false;
        state.getBlockedUsers.isError = true;
        state.getBlockedUsers.message = action.payload;
      })
      // isUserBlocked
      .addCase(isUserBlocked.pending, (state) => {
        state.isUserBlocked.isLoading = true;
      })
      .addCase(isUserBlocked.fulfilled, (state, action) => {
        state.isUserBlocked.isLoading = false;
        state.isUserBlocked.isSuccess = true;
        state.isUserBlocked.data = action.payload;
      })
      .addCase(isUserBlocked.rejected, (state, action) => {
        state.isUserBlocked.isLoading = false;
        state.isUserBlocked.isError = true;
        state.isUserBlocked.message = action.payload;
      });
  },
});

export const { reset } = usersSlice.actions;
export default usersSlice.reducer;
