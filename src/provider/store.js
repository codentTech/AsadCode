import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./features/auth/auth.slice";
import onboardingReducer from "./features/onboarding/onboarding.slice";
import usersReducer from "./features/users/users.slice";
import brandProfileReducer from "./features/brand-profile/brand-profile.slice";
import uploadFileReducer from "./features/upload-file/upload-file.slice";
import analyticsReducer from "./features/analytics/analytics.slice";
import campaignNotesReducer from "./features/campaign-notes/campaign-notes.slice";

import campaignReviewsReducer from "./features/campaign-reviews/campaign-reviews.slice";
import shortlistReducer from "./features/shortlist/shortlist.slice";
import campaignsReducer from "./features/campaigns/campaigns.slice";
import pitchesReducer from "./features/pitches/pitches.slice";
import campaignTasksReducer from "./features/campaign-tasks/campaign-tasks.slice";
import calendarTasksReducer from "./features/calendar-tasks/calendar-tasks.slice";
import calendarCategoriesReducer from "./features/calendar-categories/calendar-categories.slice";
import contentPlannerReducer from "./features/content-planner/content-planner.slice";
import monthlyGoalReducer from "./features/monthly-goals/monthly-goal.slice";
import campaignTimelineReducer from "./features/campaign-timeline/campaign-timeline.slice";
import contractsReducer from "./features/contracts/contracts.slice";
import chatReducer from "./features/chat/chat.slice";
import invitationReducer from "./features/invitation/invitation.slice";
import invitesReducer from "./features/invites/invites.slice";
import notificationReducer from "./features/notification/notification.slice";
import campaignContextReducer from "./features/campaign-context/campaign-context.slice";
import creatorApplicationsReducer from "./features/creator-applications/creator-applications.slice";
import collaborationPaymentReducer from "./features/collaboration-payment/collaboration-payment.slice";
import phylloReducer from "./features/phyllo/phyllo.slice";
import galleryReducer from "./features/gallery/gallery.slice";
import dashboardReducer from "./features/dashboard/dashboard.slice";
import adminAuditReducer from "./features/admin-audit/admin-audit.slice";
import blogReducer from "./features/blog/blog.slice";
import placesReducer from "./features/places/places.slice";
import emailPreferencesReducer from "./features/email-preferences/email-preferences.slice";
import messageTemplatesReducer from "./features/message-templates/message-templates.slice";

const defaultAdminDashboardSummary = {
  data: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const migratePersistedState = (state) => {
  if (!state || typeof state !== "object") {
    return Promise.resolve(state);
  }
  const dashboard = state.dashboard;
  if (!dashboard || typeof dashboard !== "object") {
    return Promise.resolve(state);
  }
  if (dashboard.adminDashboardSummary != null) {
    return Promise.resolve(state);
  }
  return Promise.resolve({
    ...state,
    dashboard: {
      ...dashboard,
      adminDashboardSummary: { ...defaultAdminDashboardSummary },
    },
  });
};

const persistConfig = {
  key: "root",
  version: 1,
  migrate: migratePersistedState,
  storage,
  whitelist: [
    "auth",
    "dashboard",
    "onboarding",
    "users",
    "brandProfile",
    "shortlist",
    "contracts",
    "phyllo",
    "campaignContext",
  ],
};

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  onboarding: onboardingReducer,
  users: usersReducer,
  brandProfile: brandProfileReducer,
  uploadFile: uploadFileReducer,
  analytics: analyticsReducer,
  campaignReviews: campaignReviewsReducer,
  shortlist: shortlistReducer,
  campaigns: campaignsReducer,
  pitches: pitchesReducer,
  campaignNotes: campaignNotesReducer,
  campaignTasks: campaignTasksReducer,
  calendarTasks: calendarTasksReducer,
  calendarCategories: calendarCategoriesReducer,
  contentPlanner: contentPlannerReducer,
  monthlyGoals: monthlyGoalReducer,
  campaignTimeline: campaignTimelineReducer,
  contracts: contractsReducer,
  chat: chatReducer,
  invitation: invitationReducer,
  invites: invitesReducer,
  notification: notificationReducer,
  campaignContext: campaignContextReducer,
  creatorApplications: creatorApplicationsReducer,
  collaborationPayment: collaborationPaymentReducer,
  phyllo: phylloReducer,
  gallery: galleryReducer,
  adminAudit: adminAuditReducer,
  blog: blogReducer,
  places: placesReducer,
  emailPreferences: emailPreferencesReducer,
  messageTemplates: messageTemplatesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
