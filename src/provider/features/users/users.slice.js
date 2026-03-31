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
  discoverCreators: { ...generalState },
  updateUser: { ...generalState },
  getUserById: { ...generalState },
  updateCreatorPreferences: { ...generalState },
  updateCampaignDefaults: { ...generalState },
  toggleBlockUser: { ...generalState },
  adminToggleBlockUser: { ...generalState },
  getBlockedUsers: { ...generalState },
  isUserBlocked: { ...generalState },
  addUserToWaitlist: { ...generalState },
  connectSocialMedia: { ...generalState },
  getSocialAccounts: { ...generalState },
  disconnectSocialAccount: { ...generalState },
  adminGetConnectedAccounts: { ...generalState },
  adminRemoveConnectedAccount: { ...generalState },
};

const getSerializableErrorMessage = (error, fallback = "Request failed") => {
  if (typeof error === "string") return error;
  return error?.response?.data?.message || error?.message || fallback;
};

export const getAllUsers = createAsyncThunk("users/getAllUsers", async (payload, thunkAPI) => {
  try {
    const response = await usersService.getAllUsers(payload);
    if (response.success) {
      return response.data;
    }
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const discoverCreators = createAsyncThunk(
  "users/discoverCreators",
  async (payload, thunkAPI) => {
    try {
      const response = await usersService.discoverCreators(payload);
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response.message || "Request failed");
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "An error occurred");
    }
  }
);

export const updateUser = createAsyncThunk("users/updateUser", async (data, thunkAPI) => {
  try {
    const response = await usersService.updateUser(data);
    if (response.success) {
      return response;
    }
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const getUserById = createAsyncThunk("users/getUserById", async (userId, thunkAPI) => {
  try {
    const response = await usersService.getUserById(userId);
    if (response.success) {
      return response;
    }
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const updateCreatorPreferences = createAsyncThunk(
  "users/updateCreatorPreferences",
  async (preferences, thunkAPI) => {
    try {
      const response = await usersService.updateCreatorPreferences(preferences);
      if (response.success) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateCampaignDefaults = createAsyncThunk(
  "users/updateCampaignDefaults",
  async (defaults, thunkAPI) => {
    try {
      const response = await usersService.updateCampaignDefaults(defaults);
      if (response.success) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

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

export const addUserToWaitlist = createAsyncThunk(
  "users/addUserToWaitlist",
  async (payload, thunkAPI) => {
    try {
      const response = await usersService.addUserToWaitlist(payload);
      if (response.success) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const connectSocialMedia = createAsyncThunk(
  "users/connectSocialMedia",
  async (platform, thunkAPI) => {
    try {
      const response = await usersService.connectSocialMedia(platform);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableErrorMessage(error, "Failed to connect social media")
      );
    }
  }
);

export const getSocialAccounts = createAsyncThunk(
  "users/getSocialAccounts",
  async (_, thunkAPI) => {
    try {
      const response = await usersService.getSocialAccounts();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableErrorMessage(error, "Failed to fetch social accounts")
      );
    }
  }
);

export const disconnectSocialAccount = createAsyncThunk(
  "users/disconnectSocialAccount",
  async (platform, thunkAPI) => {
    try {
      const response = await usersService.disconnectSocialAccount(platform);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const adminGetConnectedAccounts = createAsyncThunk(
  "users/adminGetConnectedAccounts",
  async (_, thunkAPI) => {
    try {
      const response = await usersService.adminGetConnectedAccounts();
      if (response.success) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const adminRemoveConnectedAccount = createAsyncThunk(
  "users/adminRemoveConnectedAccount",
  async (accountId, thunkAPI) => {
    try {
      const response = await usersService.adminRemoveConnectedAccount(accountId);
      if (response.success) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reset: (state) => {
      state.getAllUsers = { ...generalState };
      state.discoverCreators = { ...generalState };
      state.updateUser = { ...generalState };
      state.getUserById = { ...generalState };
      state.updateCreatorPreferences = { ...generalState };
      state.updateCampaignDefaults = { ...generalState };
      state.toggleBlockUser = { ...generalState };
      state.adminToggleBlockUser = { ...generalState };
      state.getBlockedUsers = { ...generalState };
      state.isUserBlocked = { ...generalState };
      state.addUserToWaitlist = { ...generalState };
      state.adminGetConnectedAccounts = { ...generalState };
      state.adminRemoveConnectedAccount = { ...generalState };
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
      // discoverCreators
      .addCase(discoverCreators.pending, (state) => {
        state.discoverCreators.isLoading = true;
      })
      .addCase(discoverCreators.fulfilled, (state, action) => {
        state.discoverCreators.isLoading = false;
        state.discoverCreators.isSuccess = true;
        state.discoverCreators.data = action.payload;
      })
      .addCase(discoverCreators.rejected, (state, action) => {
        state.discoverCreators.isLoading = false;
        state.discoverCreators.isError = true;
        state.discoverCreators.message = action.payload;
      })
      // updateUser
      .addCase(updateUser.pending, (state) => {
        if (state.updateUser) {
          state.updateUser.isLoading = true;
          state.updateUser.message = "";
          state.updateUser.isError = false;
          state.updateUser.isSuccess = false;
          state.updateUser.data = null;
        }
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        if (state.updateUser) {
          state.updateUser.isLoading = false;
          state.updateUser.isSuccess = true;
          state.updateUser.data = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        if (state.updateUser) {
          state.updateUser.isLoading = false;
          state.updateUser.isError = true;
          state.updateUser.message = action.payload;
        }
      })
      // getUserById
      .addCase(getUserById.pending, (state) => {
        state.getUserById.isLoading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.getUserById.isLoading = false;
        state.getUserById.isSuccess = true;
        state.getUserById.data = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.getUserById.isLoading = false;
        state.getUserById.isError = true;
        state.getUserById.message = action.payload;
      })
      // updateCreatorPreferences
      .addCase(updateCreatorPreferences.pending, (state) => {
        if (state.updateCreatorPreferences) {
          state.updateCreatorPreferences.isLoading = true;
        }
      })
      .addCase(updateCreatorPreferences.fulfilled, (state, action) => {
        if (state.updateCreatorPreferences) {
          state.updateCreatorPreferences.isLoading = false;
          state.updateCreatorPreferences.isSuccess = true;
          state.updateCreatorPreferences.data = action.payload;
        }
      })
      .addCase(updateCreatorPreferences.rejected, (state, action) => {
        if (state.updateCreatorPreferences) {
          state.updateCreatorPreferences.isLoading = false;
          state.updateCreatorPreferences.isError = true;
          state.updateCreatorPreferences.message = action.payload;
        }
      })
      // updateCampaignDefaults
      .addCase(updateCampaignDefaults.pending, (state) => {
        if (state.updateCampaignDefaults) {
          state.updateCampaignDefaults.isLoading = true;
        }
      })
      .addCase(updateCampaignDefaults.fulfilled, (state, action) => {
        if (state.updateCampaignDefaults) {
          state.updateCampaignDefaults.isLoading = false;
          state.updateCampaignDefaults.isSuccess = true;
          state.updateCampaignDefaults.data = action.payload;
        }
      })
      .addCase(updateCampaignDefaults.rejected, (state, action) => {
        if (state.updateCampaignDefaults) {
          state.updateCampaignDefaults.isLoading = false;
          state.updateCampaignDefaults.isError = true;
          state.updateCampaignDefaults.message = action.payload;
        }
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
      })
      // add user to waiting list
      .addCase(addUserToWaitlist.pending, (state) => {
        if (state.addUserToWaitlist) {
          state.addUserToWaitlist.isLoading = true;
        }
      })
      .addCase(addUserToWaitlist.fulfilled, (state, action) => {
        if (state.addUserToWaitlist) {
          state.addUserToWaitlist.isLoading = false;
          state.addUserToWaitlist.isSuccess = true;
          state.addUserToWaitlist.data = action.payload;
        }
      })
      .addCase(addUserToWaitlist.rejected, (state, action) => {
        if (state.addUserToWaitlist) {
          state.addUserToWaitlist.isLoading = false;
          state.addUserToWaitlist.isError = true;
          state.addUserToWaitlist.message = action.payload;
        }
      })
      // connectSocialMedia
      .addCase(connectSocialMedia.pending, (state) => {
        if (state.connectSocialMedia) {
          state.connectSocialMedia.isLoading = true;
          state.connectSocialMedia.isError = false;
          state.connectSocialMedia.message = "";
        }
      })
      .addCase(connectSocialMedia.fulfilled, (state, action) => {
        if (state.connectSocialMedia) {
          state.connectSocialMedia.isLoading = false;
          state.connectSocialMedia.isSuccess = true;
          state.connectSocialMedia.isError = false;
          state.connectSocialMedia.message = "";
          state.connectSocialMedia.data = action.payload;
        }
      })
      .addCase(connectSocialMedia.rejected, (state, action) => {
        if (state.connectSocialMedia) {
          state.connectSocialMedia.isLoading = false;
          state.connectSocialMedia.isError = true;
          state.connectSocialMedia.message = action.payload;
        }
      })
      // getSocialAccounts
      .addCase(getSocialAccounts.pending, (state) => {
        if (state.getSocialAccounts) {
          state.getSocialAccounts.isLoading = true;
          state.getSocialAccounts.isError = false;
          state.getSocialAccounts.message = "";
        }
      })
      .addCase(getSocialAccounts.fulfilled, (state, action) => {
        if (state.getSocialAccounts) {
          state.getSocialAccounts.isLoading = false;
          state.getSocialAccounts.isSuccess = true;
          state.getSocialAccounts.isError = false;
          state.getSocialAccounts.message = "";
          state.getSocialAccounts.data = action.payload;
        }
      })
      .addCase(getSocialAccounts.rejected, (state, action) => {
        if (state.getSocialAccounts) {
          state.getSocialAccounts.isLoading = false;
          state.getSocialAccounts.isError = true;
          state.getSocialAccounts.message =
            typeof action.payload === "string" ? action.payload : "Failed to fetch social accounts";
        }
      })
      // disconnectSocialAccount
      .addCase(disconnectSocialAccount.pending, (state) => {
        if (state.disconnectSocialAccount) {
          state.disconnectSocialAccount.isLoading = true;
        }
      })
      .addCase(disconnectSocialAccount.fulfilled, (state, action) => {
        if (state.disconnectSocialAccount) {
          state.disconnectSocialAccount.isLoading = false;
          state.disconnectSocialAccount.isSuccess = true;
          state.disconnectSocialAccount.data = action.payload;
        }
      })
      .addCase(disconnectSocialAccount.rejected, (state, action) => {
        if (state.disconnectSocialAccount) {
          state.disconnectSocialAccount.isLoading = false;
          state.disconnectSocialAccount.isError = true;
          state.disconnectSocialAccount.message = action.payload;
        }
      })
      // adminGetConnectedAccounts
      .addCase(adminGetConnectedAccounts.pending, (state) => {
        if (!state.adminGetConnectedAccounts) {
          state.adminGetConnectedAccounts = { ...generalState };
        }
        state.adminGetConnectedAccounts.isLoading = true;
      })
      .addCase(adminGetConnectedAccounts.fulfilled, (state, action) => {
        if (!state.adminGetConnectedAccounts) {
          state.adminGetConnectedAccounts = { ...generalState };
        }
        state.adminGetConnectedAccounts.isLoading = false;
        state.adminGetConnectedAccounts.isSuccess = true;
        state.adminGetConnectedAccounts.data = action.payload;
      })
      .addCase(adminGetConnectedAccounts.rejected, (state, action) => {
        if (!state.adminGetConnectedAccounts) {
          state.adminGetConnectedAccounts = { ...generalState };
        }
        state.adminGetConnectedAccounts.isLoading = false;
        state.adminGetConnectedAccounts.isError = true;
        state.adminGetConnectedAccounts.message = action.payload;
      })
      // adminRemoveConnectedAccount
      .addCase(adminRemoveConnectedAccount.pending, (state) => {
        if (!state.adminRemoveConnectedAccount) {
          state.adminRemoveConnectedAccount = { ...generalState };
        }
        state.adminRemoveConnectedAccount.isLoading = true;
      })
      .addCase(adminRemoveConnectedAccount.fulfilled, (state, action) => {
        if (!state.adminRemoveConnectedAccount) {
          state.adminRemoveConnectedAccount = { ...generalState };
        }
        state.adminRemoveConnectedAccount.isLoading = false;
        state.adminRemoveConnectedAccount.isSuccess = true;
        state.adminRemoveConnectedAccount.data = action.payload;
      })
      .addCase(adminRemoveConnectedAccount.rejected, (state, action) => {
        if (!state.adminRemoveConnectedAccount) {
          state.adminRemoveConnectedAccount = { ...generalState };
        }
        state.adminRemoveConnectedAccount.isLoading = false;
        state.adminRemoveConnectedAccount.isError = true;
        state.adminRemoveConnectedAccount.message = action.payload;
      });
  },
});

export const { reset } = usersSlice.actions;
export default usersSlice.reducer;
