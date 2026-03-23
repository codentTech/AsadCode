import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCampaignId: null,
  selectedCollaborationType: null, // "MULTI_CREATOR" or "INDIVIDUAL_CREATOR"
};

const campaignContextSlice = createSlice({
  name: "campaignContext",
  initialState,
  reducers: {
    setSelectedCampaign: (state, action) => {
      state.selectedCampaignId = action.payload.campaignId;
      state.selectedCollaborationType = action.payload.collaborationType || null;
    },
    clearSelectedCampaign: (state) => {
      state.selectedCampaignId = null;
      state.selectedCollaborationType = null;
    },
  },
});

export const { setSelectedCampaign, clearSelectedCampaign } = campaignContextSlice.actions;
export default campaignContextSlice.reducer;

