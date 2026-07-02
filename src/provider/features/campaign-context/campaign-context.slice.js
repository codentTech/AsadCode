import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCampaignId: null,
  selectedCollaborationType: null, // "MULTI_CREATOR" or "INDIVIDUAL_CREATOR"
  isBrandCampaignMultiCreatorMode: true,
  activeTab: 1,
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
    setBrandCampaignMultiCreatorMode: (state, action) => {
      state.isBrandCampaignMultiCreatorMode = action.payload;
    },
    setCampaignActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const {
  setSelectedCampaign,
  clearSelectedCampaign,
  setBrandCampaignMultiCreatorMode,
  setCampaignActiveTab,
} = campaignContextSlice.actions;

export const selectCampaignActiveTab = (state) => state.campaignContext.activeTab;

export default campaignContextSlice.reducer;

