import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./features/auth/auth.slice";
import onboardingReducer from "./features/onboarding/onboarding.slice";
import usersReducer from "./features/users/users.slice";
import brandProfileReducer from "./features/brand-profile/brand-profile.slice";
import uploadFileReducer from "./features/upload-file/upload-file.slice";
import analyticsReducer from "./features/analytics/analytics.slice";
import campaignsReducer from "./features/campaigns/campaigns.slice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "dashboard", "onboarding", "users", "brandProfile", "campaigns"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  onboarding: onboardingReducer,
  users: usersReducer,
  brandProfile: brandProfileReducer,
  uploadFile: uploadFileReducer,
  analytics: analyticsReducer,
  campaigns: campaignsReducer,
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
