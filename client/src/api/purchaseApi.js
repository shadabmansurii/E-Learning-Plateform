import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = "/api/v1/purchase";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  tagTypes: ["PurchasedCourses", "CourseStatus"],

  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
  }),

  endpoints: (builder) => ({

    /* ---------------- BUY COURSE ---------------- */
    purchaseCourse: builder.mutation({
      // ✅ FIX: destructure properly
      query: ({ courseId }) => ({
        url: "/course",
        method: "POST",
        body: { courseId },
      }),

      // ✅ OPTIMISTIC UPDATE
      async onQueryStarted({ courseId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          purchaseApi.util.updateQueryData(
            "getCourseDetailsWithStatus",
            courseId,
            (draft) => {
              if (draft) {
                draft.purchased = true;
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },

      // ✅ INVALIDATE PROPERLY
      invalidatesTags: (result, error, { courseId }) => [
        { type: "CourseStatus", id: courseId },
      ],
    }),

    /* ---------------- COURSE DETAILS ---------------- */
    getCourseDetailsWithStatus: builder.query({
      query: (courseId) =>
        `/courses/${courseId}/details-with-status`,

      providesTags: (result, error, courseId) => [
        { type: "CourseStatus", id: courseId },
      ],
    }),

    /* ---------------- PURCHASED COURSES ---------------- */
    getPurchasedCourses: builder.query({
      query: () => "/",

      providesTags: (result) =>
        result?.purchasedCourse
          ? [
              ...result.purchasedCourse.map((item) => ({
                type: "PurchasedCourses",
                id: item._id,
              })),
              { type: "PurchasedCourses", id: "LIST" },
            ]
          : [{ type: "PurchasedCourses", id: "LIST" }],
    }),
  }),
});

export const {
  usePurchaseCourseMutation,
  useGetCourseDetailsWithStatusQuery,
  useGetPurchasedCoursesQuery,
} = purchaseApi;
