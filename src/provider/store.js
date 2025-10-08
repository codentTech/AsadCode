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

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "dashboard", "onboarding", "users", "brandProfile", "shortlist", "contracts"],
};

const rootReducer = combineReducers({
  auth: authReducer,
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
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
