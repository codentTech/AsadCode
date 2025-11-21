import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import contentPlannerService from "./content-planner.service";

const createGeneralState = () => ({
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
});

const initialState = {
  contentPlanners: [],
  createContentPlanner: createGeneralState(),
  updateContentPlanner: createGeneralState(),
  deleteContentPlanner: createGeneralState(),
  getContentPlannerByCampaign: createGeneralState(),
  getAllContentPlanners: createGeneralState(),
  createContentPlannerSection: createGeneralState(),
  updateContentPlannerSection: createGeneralState(),
  deleteContentPlannerSection: createGeneralState(),
};

export const createContentPlanner = createAsyncThunk(
  "contentPlanner/createContentPlanner",
  async ({ campaignId, contentPlannerData }, thunkAPI) => {
    try {
      const response = await contentPlannerService.createContentPlanner(
        campaignId,
        contentPlannerData
      );
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getAllContentPlanners = createAsyncThunk(
  "contentPlanner/getAllContentPlanners",
  async (_, thunkAPI) => {
    try {
      const response = await contentPlannerService.getAllContentPlanners();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const getContentPlannerByCampaign = createAsyncThunk(
  "contentPlanner/getContentPlannerByCampaign",
  async (campaignId, thunkAPI) => {
    try {
      const response = await contentPlannerService.getContentPlannerByCampaign(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateContentPlanner = createAsyncThunk(
  "contentPlanner/updateContentPlanner",
  async ({ id, updateData }, thunkAPI) => {
    try {
      const response = await contentPlannerService.updateContentPlanner(id, updateData);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteContentPlanner = createAsyncThunk(
  "contentPlanner/deleteContentPlanner",
  async (id, thunkAPI) => {
    try {
      const response = await contentPlannerService.deleteContentPlanner(id);
      if (response.success) return { ...response, plannerId: id };
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createContentPlannerSection = createAsyncThunk(
  "contentPlanner/createContentPlannerSection",
  async ({ plannerId, payload }, thunkAPI) => {
    try {
      const response = await contentPlannerService.createContentPlannerSection(plannerId, payload);
      if (response.success) {
        return { ...response, plannerId };
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateContentPlannerSection = createAsyncThunk(
  "contentPlanner/updateContentPlannerSection",
  async ({ sectionId, payload }, thunkAPI) => {
    try {
      const response = await contentPlannerService.updateContentPlannerSection(sectionId, payload);
      if (response.success) {
        return { ...response, sectionId };
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteContentPlannerSection = createAsyncThunk(
  "contentPlanner/deleteContentPlannerSection",
  async (sectionId, thunkAPI) => {
    try {
      const response = await contentPlannerService.deleteContentPlannerSection(sectionId);
      if (response.success) {
        return { ...response, sectionId };
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

const updatePlannerInCollection = (collection, plannerId, updater) => {
  if (!Array.isArray(collection)) return collection;
  return collection.map((planner) => {
    if (planner.id !== plannerId) return planner;
    return updater(planner);
  });
};

export const contentPlannerSlice = createSlice({
  name: "contentPlanner",
  initialState,
  reducers: {
    reset: (state) => {
      state.createContentPlanner = createGeneralState();
      state.updateContentPlanner = createGeneralState();
      state.deleteContentPlanner = createGeneralState();
      state.getContentPlannerByCampaign = createGeneralState();
      state.getAllContentPlanners = createGeneralState();
      state.createContentPlannerSection = createGeneralState();
      state.updateContentPlannerSection = createGeneralState();
      state.deleteContentPlannerSection = createGeneralState();
    },
    clearContentPlanners: (state) => {
      state.contentPlanners = [];
    },
    removeContentPlannerFromList: (state, action) => {
      const contentPlannerId = action.payload;
      state.contentPlanners = state.contentPlanners.filter(
        (planner) => planner.id !== contentPlannerId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createContentPlanner.pending, (state) => {
        state.createContentPlanner = {
          ...createGeneralState(),
          isLoading: true,
        };
      })
      .addCase(createContentPlanner.fulfilled, (state, action) => {
        state.createContentPlanner = {
          ...state.createContentPlanner,
          isLoading: false,
          isSuccess: true,
          data: action.payload.data,
        };

        const planner = action.payload.data;
        if (planner) {
          state.contentPlanners = [planner, ...state.contentPlanners];
          state.getAllContentPlanners.data = [planner, ...(state.getAllContentPlanners.data || [])];
        }
      })
      .addCase(createContentPlanner.rejected, (state, action) => {
        state.createContentPlanner = {
          ...state.createContentPlanner,
          isLoading: false,
          isError: true,
          message: action.payload.message,
          data: null,
        };
      })

      .addCase(getAllContentPlanners.pending, (state) => {
        state.getAllContentPlanners = {
          ...createGeneralState(),
          isLoading: true,
        };
      })
      .addCase(getAllContentPlanners.fulfilled, (state, action) => {
        const planners = action.payload.data || [];
        state.getAllContentPlanners = {
          ...state.getAllContentPlanners,
          isLoading: false,
          isSuccess: true,
          data: planners,
        };
        state.contentPlanners = planners;
      })
      .addCase(getAllContentPlanners.rejected, (state, action) => {
        state.getAllContentPlanners = {
          ...state.getAllContentPlanners,
          isLoading: false,
          isError: true,
          message: action.payload.message,
          data: null,
        };
      })

      .addCase(getContentPlannerByCampaign.pending, (state) => {
        state.getContentPlannerByCampaign = {
          ...createGeneralState(),
          isLoading: true,
        };
      })
      .addCase(getContentPlannerByCampaign.fulfilled, (state, action) => {
        state.getContentPlannerByCampaign = {
          ...state.getContentPlannerByCampaign,
          isLoading: false,
          isSuccess: true,
          data: action.payload.data,
        };
      })
      .addCase(getContentPlannerByCampaign.rejected, (state, action) => {
        state.getContentPlannerByCampaign = {
          ...state.getContentPlannerByCampaign,
          isLoading: false,
          isError: true,
          message: action.payload.message,
          data: null,
        };
      })

      .addCase(updateContentPlanner.pending, (state) => {
        state.updateContentPlanner = {
          ...createGeneralState(),
          isLoading: true,
        };
      })
      .addCase(updateContentPlanner.fulfilled, (state, action) => {
        state.updateContentPlanner = {
          ...state.updateContentPlanner,
          isLoading: false,
          isSuccess: true,
          data: action.payload.data,
        };

        const planner = action.payload.data;
        if (!planner?.id) return;

        state.contentPlanners = updatePlannerInCollection(
          state.contentPlanners,
          planner.id,
          () => planner
        );

        if (Array.isArray(state.getAllContentPlanners.data)) {
          state.getAllContentPlanners.data = updatePlannerInCollection(
            state.getAllContentPlanners.data,
            planner.id,
            () => planner
          );
        }
      })
      .addCase(updateContentPlanner.rejected, (state, action) => {
        state.updateContentPlanner = {
          ...state.updateContentPlanner,
          isLoading: false,
          isError: true,
          message: action.payload.message,
          data: null,
        };
      })

      .addCase(deleteContentPlanner.pending, (state) => {
        state.deleteContentPlanner = {
          ...createGeneralState(),
          isLoading: true,
        };
      })
      .addCase(deleteContentPlanner.fulfilled, (state, action) => {
        state.deleteContentPlanner = {
          ...state.deleteContentPlanner,
          isLoading: false,
          isSuccess: true,
          data: action.payload.data,
        };

        const plannerId = action.payload.plannerId;
        if (!plannerId) return;

        state.contentPlanners = state.contentPlanners.filter((planner) => planner.id !== plannerId);
        if (Array.isArray(state.getAllContentPlanners.data)) {
          state.getAllContentPlanners.data = state.getAllContentPlanners.data.filter(
            (planner) => planner.id !== plannerId
          );
        }
      })
      .addCase(deleteContentPlanner.rejected, (state, action) => {
        state.deleteContentPlanner = {
          ...state.deleteContentPlanner,
          isLoading: false,
          isError: true,
          message: action.payload.message,
          data: null,
        };
      })

      .addCase(createContentPlannerSection.pending, (state) => {
        state.createContentPlannerSection = {
          ...createGeneralState(),
          isLoading: true,
        };
      })
      .addCase(createContentPlannerSection.fulfilled, (state, action) => {
        state.createContentPlannerSection = {
          ...state.createContentPlannerSection,
          isLoading: false,
          isSuccess: true,
          data: action.payload.data,
        };

        const plannerId = action.payload.plannerId;
        const newSection = action.payload.data;
        if (!plannerId || !newSection) return;

        const addSection = (planner) => {
          const sections = planner.sections || [];
          return {
            ...planner,
            sections: [...sections, newSection].sort(
              (a, b) => (a.position ?? 0) - (b.position ?? 0)
            ),
          };
        };

        state.contentPlanners = updatePlannerInCollection(
          state.contentPlanners,
          plannerId,
          addSection
        );
        if (Array.isArray(state.getAllContentPlanners.data)) {
          state.getAllContentPlanners.data = updatePlannerInCollection(
            state.getAllContentPlanners.data,
            plannerId,
            addSection
          );
        }
      })
      .addCase(createContentPlannerSection.rejected, (state, action) => {
        state.createContentPlannerSection = {
          ...state.createContentPlannerSection,
          isLoading: false,
          isError: true,
          message: action.payload.message,
        };
      })

      .addCase(updateContentPlannerSection.pending, (state) => {
        state.updateContentPlannerSection = {
          ...createGeneralState(),
          isLoading: true,
        };
      })
      .addCase(updateContentPlannerSection.fulfilled, (state, action) => {
        state.updateContentPlannerSection = {
          ...state.updateContentPlannerSection,
          isLoading: false,
          isSuccess: true,
          data: action.payload.data,
        };

        const updatedSection = action.payload.data;
        if (!updatedSection?.id) return;

        const updateSection = (planner) => {
          if (!planner.sections) return planner;
          const hasSection = planner.sections.some((section) => section.id === updatedSection.id);
          if (!hasSection) return planner;
          return {
            ...planner,
            sections: planner.sections
              .map((section) => (section.id === updatedSection.id ? updatedSection : section))
              .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
          };
        };

        state.contentPlanners = state.contentPlanners.map(updateSection);
        if (Array.isArray(state.getAllContentPlanners.data)) {
          state.getAllContentPlanners.data = state.getAllContentPlanners.data.map(updateSection);
        }
      })
      .addCase(updateContentPlannerSection.rejected, (state, action) => {
        state.updateContentPlannerSection = {
          ...state.updateContentPlannerSection,
          isLoading: false,
          isError: true,
          message: action.payload.message,
        };
      })

      .addCase(deleteContentPlannerSection.pending, (state) => {
        state.deleteContentPlannerSection = {
          ...createGeneralState(),
          isLoading: true,
        };
      })
      .addCase(deleteContentPlannerSection.fulfilled, (state, action) => {
        state.deleteContentPlannerSection = {
          ...state.deleteContentPlannerSection,
          isLoading: false,
          isSuccess: true,
          data: action.payload.data,
        };

        const sectionId = action.payload.sectionId || action.meta?.arg || null;
        if (!sectionId) return;

        const removeSection = (planner) => {
          if (!planner.sections) return planner;
          const hasSection = planner.sections.some((section) => section.id === sectionId);
          if (!hasSection) return planner;
          return {
            ...planner,
            sections: planner.sections.filter((section) => section.id !== sectionId),
          };
        };

        state.contentPlanners = state.contentPlanners.map(removeSection);
        if (Array.isArray(state.getAllContentPlanners.data)) {
          state.getAllContentPlanners.data = state.getAllContentPlanners.data.map(removeSection);
        }
      })
      .addCase(deleteContentPlannerSection.rejected, (state, action) => {
        state.deleteContentPlannerSection = {
          ...state.deleteContentPlannerSection,
          isLoading: false,
          isError: true,
          message: action.payload.message,
        };
      });
  },
});

export const { reset, clearContentPlanners, removeContentPlannerFromList } =
  contentPlannerSlice.actions;

export default contentPlannerSlice.reducer;
