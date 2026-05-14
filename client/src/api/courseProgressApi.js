import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PROGRESS_API = "/api/v1/course-progress";

const baseQuery = fetchBaseQuery({
  baseUrl: COURSE_PROGRESS_API,
  credentials: "include",
});

export const courseProgressApi = createApi({
  reducerPath: "courseProgressApi",
  tagTypes: ["Progress"],
  baseQuery,
  endpoints: (builder) => ({
    
    getCourseProgress: builder.query({
      query: (courseId) => `/${courseId}`,
      providesTags: (result, error, courseId) => [
        { type: "Progress", id: courseId },
      ],
    }),

    updateLectureProgress: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lectures/${lectureId}/view`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Progress", id: courseId },
      ],
    }),

    completeCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/complete`,
        method: "POST",
      }),
    }),

    markCourseIncomplete: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/incomplete`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation,
  useCompleteCourseMutation,
  useMarkCourseIncompleteMutation, // ✅ FINAL
} = courseProgressApi;
