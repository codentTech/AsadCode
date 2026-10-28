import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import campaignReportService from "./campaign-report.service";

const getSerializableError = (error) => {
  if (!error) return { message: "Something went wrong" };
  if (typeof error === "string") return { message: error };
  return {
    message: error.message || error.error || "Something went wrong",
    statusCode: error.statusCode || error.status,
  };
};

const parseFilenameFromDisposition = (disposition) => {
  if (!disposition) return null;
  const utfMatch = /filename\*=UTF-8''([^;]+)/i.exec(disposition);
  if (utfMatch?.[1]) {
    try {
      return decodeURIComponent(utfMatch[1].trim());
    } catch {
      return utfMatch[1].trim();
    }
  }
  const plainMatch = /filename="?([^";]+)"?/i.exec(disposition);
  return plainMatch?.[1]?.trim() || null;
};

const triggerBlobDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "CleerCut-campaign-report.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const generalState = {
  data: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const initialState = {
  getCompletedReport: { ...generalState },
  downloadPdf: { ...generalState },
};

export const getCompletedCampaignReport = createAsyncThunk(
  "campaignReport/getCompletedReport",
  async (campaignId, thunkAPI) => {
    try {
      const response = await campaignReportService.getCompletedCampaignReport(campaignId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      if (thunkAPI.signal.aborted) {
        throw error;
      }
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

export const downloadCompletedCampaignReportPdf = createAsyncThunk(
  "campaignReport/downloadPdf",
  async (campaignId, thunkAPI) => {
    try {
      const response =
        await campaignReportService.downloadCompletedCampaignReportPdf(campaignId);
      const blob = response.data;
      const contentType = String(response.headers?.["content-type"] || blob?.type || "");

      if (contentType.includes("application/json")) {
        const text = await blob.text();
        let parsed = null;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = { message: "Failed to download PDF" };
        }
        return thunkAPI.rejectWithValue(parsed);
      }

      const filename =
        parseFilenameFromDisposition(response.headers?.["content-disposition"]) ||
        "CleerCut-campaign-report.pdf";

      triggerBlobDownload(blob, filename);
      return { filename };
    } catch (error) {
      if (thunkAPI.signal.aborted) {
        throw error;
      }
      return thunkAPI.rejectWithValue(getSerializableError(error));
    }
  }
);

const campaignReportSlice = createSlice({
  name: "campaignReport",
  initialState,
  reducers: {
    resetCompletedReport: (state) => {
      state.getCompletedReport = { ...generalState };
    },
    resetDownloadPdf: (state) => {
      state.downloadPdf = { ...generalState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompletedCampaignReport.pending, (state) => {
        state.getCompletedReport.isLoading = true;
        state.getCompletedReport.isError = false;
        state.getCompletedReport.isSuccess = false;
        state.getCompletedReport.message = "";
        state.getCompletedReport.data = null;
      })
      .addCase(getCompletedCampaignReport.fulfilled, (state, action) => {
        state.getCompletedReport = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload.data,
        };
      })
      .addCase(getCompletedCampaignReport.rejected, (state, action) => {
        if (action.meta?.aborted || action.meta?.condition) return;
        state.getCompletedReport = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: action.payload?.message || "Failed to load report",
          data: null,
        };
      })
      .addCase(downloadCompletedCampaignReportPdf.pending, (state) => {
        state.downloadPdf.isLoading = true;
        state.downloadPdf.isError = false;
        state.downloadPdf.isSuccess = false;
        state.downloadPdf.message = "";
        state.downloadPdf.data = null;
      })
      .addCase(downloadCompletedCampaignReportPdf.fulfilled, (state, action) => {
        state.downloadPdf = {
          isLoading: false,
          isSuccess: true,
          isError: false,
          message: "",
          data: action.payload,
        };
      })
      .addCase(downloadCompletedCampaignReportPdf.rejected, (state, action) => {
        if (action.meta?.aborted || action.meta?.condition) return;
        state.downloadPdf = {
          isLoading: false,
          isSuccess: false,
          isError: true,
          message: action.payload?.message || "Failed to download PDF",
          data: null,
        };
      });
  },
});

export const { resetCompletedReport, resetDownloadPdf } = campaignReportSlice.actions;
export const selectCompletedCampaignReport = (state) =>
  state.campaignReport?.getCompletedReport ?? generalState;
export const selectDownloadCampaignReportPdf = (state) =>
  state.campaignReport?.downloadPdf ?? generalState;

export default campaignReportSlice.reducer;
