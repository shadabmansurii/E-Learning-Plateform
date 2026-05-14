import { combineReducers } from "@reduxjs/toolkit";

/* ---------------- SLICES ---------------- */
import authSlice from "@/features/authSlice";
import courseSlice from "@/features/courseSlice";

/* ---------------- APIs ---------------- */
import { authApi } from "@/api/authApi";
import { courseApi } from "@/api/courseApi";
import { purchaseApi } from "@/api/purchaseApi";
import { courseProgressApi } from "@/api/courseProgressApi";

/* ---------------- ROOT REDUCER ---------------- */
const appReducer = combineReducers({
  /* RTK Query APIs */
  [authApi.reducerPath]: authApi.reducer,
  [courseApi.reducerPath]: courseApi.reducer,
  [purchaseApi.reducerPath]: purchaseApi.reducer,
  [courseProgressApi.reducerPath]: courseProgressApi.reducer,

  /* Local slices */
  auth: authSlice,
  course: courseSlice,
});

/* ---------------- RESET STATE ON LOGOUT ---------------- */
const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    state = undefined; // 🔥 clears entire store
  }
  return appReducer(state, action);
};

export default rootReducer;
