import { configureStore } from "@reduxjs/toolkit"; 
import rootReducer from "./rootReducer";

/* ---------------- APIs ---------------- */
import { authApi } from "@/api/authApi";
import { courseApi } from "@/api/courseApi";
import { purchaseApi } from "@/api/purchaseApi";
import { courseProgressApi } from "@/api/courseProgressApi";

/* ---------------- ALL API MIDDLEWARE ---------------- */
const apiMiddlewares = [
  authApi.middleware,
  courseApi.middleware,
  purchaseApi.middleware,
  courseProgressApi.middleware,
];

/* ---------------- STORE ---------------- */
export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // for FormData, etc.
    }).concat(apiMiddlewares),
});
