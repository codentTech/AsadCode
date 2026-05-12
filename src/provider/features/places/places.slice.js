import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import placesService from "./places.service";

const normalizeMessage = (value) => {
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
    return {
      message:
        normalizeMessage(error.response.data.message) || "An unexpected error occurred",
    };
  }
  if (error?.message) {
    return { message: normalizeMessage(error.message) || "An unexpected error occurred" };
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
  placesAutocomplete: { ...generalState },
  placeDetails: { ...generalState },
};

export const autocompletePlacesThunk = createAsyncThunk(
  "places/autocomplete",
  async (payload, thunkAPI) => {
    try {
      return await placesService.autocompletePlaces(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const fetchPlaceDetailsThunk = createAsyncThunk(
  "places/details",
  async ({ placeId, languageCode = "en" }, thunkAPI) => {
    try {
      return await placesService.fetchPlaceDetails(placeId, languageCode);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const placesSlice = createSlice({
  name: "places",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(autocompletePlacesThunk.pending, (state) => {
        state.placesAutocomplete.isLoading = true;
        state.placesAutocomplete.isError = false;
        state.placesAutocomplete.isSuccess = false;
        state.placesAutocomplete.message = "";
        state.placesAutocomplete.data = null;
      })
      .addCase(autocompletePlacesThunk.fulfilled, (state, action) => {
        state.placesAutocomplete.isLoading = false;
        state.placesAutocomplete.isSuccess = true;
        state.placesAutocomplete.data = action.payload;
      })
      .addCase(autocompletePlacesThunk.rejected, (state, action) => {
        state.placesAutocomplete.isLoading = false;
        state.placesAutocomplete.isError = true;
        state.placesAutocomplete.message = action.payload?.message || "";
        state.placesAutocomplete.data = null;
      })
      .addCase(fetchPlaceDetailsThunk.pending, (state) => {
        state.placeDetails.isLoading = true;
        state.placeDetails.isError = false;
        state.placeDetails.isSuccess = false;
        state.placeDetails.message = "";
        state.placeDetails.data = null;
      })
      .addCase(fetchPlaceDetailsThunk.fulfilled, (state, action) => {
        state.placeDetails.isLoading = false;
        state.placeDetails.isSuccess = true;
        state.placeDetails.data = action.payload;
      })
      .addCase(fetchPlaceDetailsThunk.rejected, (state, action) => {
        state.placeDetails.isLoading = false;
        state.placeDetails.isError = true;
        state.placeDetails.message = action.payload?.message || "";
        state.placeDetails.data = null;
      });
  },
});

export const selectPlacesAutocomplete = (state) => state.places.placesAutocomplete;
export const selectPlaceDetails = (state) => state.places.placeDetails;

export default placesSlice.reducer;
