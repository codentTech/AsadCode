import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import blogService from "./blog.service";

const getSerializableError = (error) => {
  if (error?.response?.data?.message) {
    return { message: error.response.data.message };
  }
  if (error?.message) {
    return { message: error.message };
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

const initialState = {
  fetchAdminPosts: { ...generalState },
  createPost: { ...generalState },
  updatePost: { ...generalState },
  deletePost: { ...generalState },
  bulkDeletePosts: { ...generalState },
};

export const fetchAdminBlogPosts = createAsyncThunk(
  "blog/fetchAdminPosts",
  async (params, thunkAPI) => {
    try {
      const response = await blogService.getAdminPosts(params);
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const createBlogPost = createAsyncThunk(
  "blog/createPost",
  async (payload, thunkAPI) => {
    try {
      const response = await blogService.createBlogPost(payload);
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const updateBlogPost = createAsyncThunk(
  "blog/updatePost",
  async ({ id, payload }, thunkAPI) => {
    try {
      const response = await blogService.updateBlogPost(id, payload);
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const deleteBlogPost = createAsyncThunk(
  "blog/deletePost",
  async (id, thunkAPI) => {
    try {
      const response = await blogService.deleteBlogPost(id);
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const bulkDeleteBlogPosts = createAsyncThunk(
  "blog/bulkDeletePosts",
  async (ids, thunkAPI) => {
    try {
      const response = await blogService.bulkDeleteBlogPosts(ids);
      if (response.success) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    resetCreateBlogPost: (state) => {
      state.createPost = { ...generalState };
    },
    resetUpdateBlogPost: (state) => {
      state.updatePost = { ...generalState };
    },
    resetDeleteBlogPost: (state) => {
      state.deletePost = { ...generalState };
    },
    resetBulkDeleteBlogPosts: (state) => {
      state.bulkDeletePosts = { ...generalState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminBlogPosts.pending, (state) => {
        state.fetchAdminPosts.isLoading = true;
        state.fetchAdminPosts.isError = false;
        state.fetchAdminPosts.isSuccess = false;
        state.fetchAdminPosts.message = "";
      })
      .addCase(fetchAdminBlogPosts.fulfilled, (state, action) => {
        state.fetchAdminPosts.isLoading = false;
        state.fetchAdminPosts.isSuccess = true;
        state.fetchAdminPosts.data = action.payload;
      })
      .addCase(fetchAdminBlogPosts.rejected, (state, action) => {
        state.fetchAdminPosts.isLoading = false;
        state.fetchAdminPosts.isError = true;
        state.fetchAdminPosts.message = action.payload?.message || "Request failed";
      })
      .addCase(createBlogPost.pending, (state) => {
        state.createPost.isLoading = true;
        state.createPost.isError = false;
        state.createPost.isSuccess = false;
        state.createPost.message = "";
      })
      .addCase(createBlogPost.fulfilled, (state) => {
        state.createPost.isLoading = false;
        state.createPost.isSuccess = true;
      })
      .addCase(createBlogPost.rejected, (state, action) => {
        state.createPost.isLoading = false;
        state.createPost.isError = true;
        state.createPost.message = action.payload?.message || "Request failed";
      })
      .addCase(updateBlogPost.pending, (state) => {
        state.updatePost.isLoading = true;
        state.updatePost.isError = false;
        state.updatePost.isSuccess = false;
        state.updatePost.message = "";
      })
      .addCase(updateBlogPost.fulfilled, (state) => {
        state.updatePost.isLoading = false;
        state.updatePost.isSuccess = true;
      })
      .addCase(updateBlogPost.rejected, (state, action) => {
        state.updatePost.isLoading = false;
        state.updatePost.isError = true;
        state.updatePost.message = action.payload?.message || "Request failed";
      })
      .addCase(deleteBlogPost.pending, (state) => {
        state.deletePost.isLoading = true;
        state.deletePost.isError = false;
        state.deletePost.isSuccess = false;
        state.deletePost.message = "";
      })
      .addCase(deleteBlogPost.fulfilled, (state) => {
        state.deletePost.isLoading = false;
        state.deletePost.isSuccess = true;
      })
      .addCase(deleteBlogPost.rejected, (state, action) => {
        state.deletePost.isLoading = false;
        state.deletePost.isError = true;
        state.deletePost.message = action.payload?.message || "Request failed";
      })
      .addCase(bulkDeleteBlogPosts.pending, (state) => {
        state.bulkDeletePosts.isLoading = true;
        state.bulkDeletePosts.isError = false;
        state.bulkDeletePosts.isSuccess = false;
        state.bulkDeletePosts.message = "";
      })
      .addCase(bulkDeleteBlogPosts.fulfilled, (state) => {
        state.bulkDeletePosts.isLoading = false;
        state.bulkDeletePosts.isSuccess = true;
      })
      .addCase(bulkDeleteBlogPosts.rejected, (state, action) => {
        state.bulkDeletePosts.isLoading = false;
        state.bulkDeletePosts.isError = true;
        state.bulkDeletePosts.message = action.payload?.message || "Request failed";
      });
  },
});

export const selectFetchAdminBlogPosts = (state) => state.blog.fetchAdminPosts;
export const selectCreateBlogPost = (state) => state.blog.createPost;
export const selectUpdateBlogPost = (state) => state.blog.updatePost;
export const selectDeleteBlogPost = (state) => state.blog.deletePost;
export const selectBulkDeleteBlogPosts = (state) => state.blog.bulkDeletePosts;

export const {
  resetCreateBlogPost,
  resetUpdateBlogPost,
  resetDeleteBlogPost,
  resetBulkDeleteBlogPosts,
} = blogSlice.actions;

export default blogSlice.reducer;
