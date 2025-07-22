import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./features/auth/auth.slice";
import userReducer from "./features/user/user.slice";
import onboardingReducer from "./features/onboarding/onboarding.slice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "dashboard", "onboarding"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  onboarding: onboardingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);
