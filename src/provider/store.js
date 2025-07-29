import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./features/auth/auth.slice";
import userReducer from "./features/user/user.slice";
import onboardingReducer from "./features/onboarding/onboarding.slice";
import usersReducer from "./features/users/users.slice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "dashboard", "onboarding", "users"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  onboarding: onboardingReducer,
  users: usersReducer,
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
});

export const persistor = persistStore(store);
