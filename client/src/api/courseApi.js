import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "/api/v1/course";

/* ---------------- BASE QUERY ---------------- */
const baseQuery = fetchBaseQuery({
  baseUrl: COURSE_API,
  credentials: "include",
});

/* ---------------- API ---------------- */
export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Course", "Lectures"],
  baseQuery,
  endpoints: (builder) => ({
    /* ---------------- COURSES ---------------- */

    getAllCourses: builder.query({
      query: () => "/",
      providesTags: (result) =>
        result?.courses
          ? [
              ...result.courses.map((c) => ({
                type: "Course",
                id: c._id,
              })),
              { type: "Course", id: "LIST" },
            ]
          : [{ type: "Course", id: "LIST" }],
    }),

    getCreatorCourses: builder.query({
      query: () => "/creator-course",
      providesTags: (result) =>
        result?.courses
          ? result.courses.map((c) => ({
              type: "Course",
              id: c._id,
            }))
          : [],
    }),

    getCourseById: builder.query({
      query: (courseId) => `/${courseId}`,
      providesTags: (result, error, id) => [{ type: "Course", id }],
    }),

    createCourse: builder.mutation({
      query: (body) => ({
        url: "/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Course", id: "LIST" }],
    }),

    editCourse: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/edit/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Course", id }],
    }),

    removeCourse: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Course", id: "LIST" }],
    }),

    publishCourse: builder.mutation({
  query: ({ courseId, isPublished }) => ({
    url: `/${courseId}`,
    method: "PUT",
    params: {
      publish: String(isPublished), // ✅ IMPORTANT (string me bhejna)
    },
  }),
  invalidatesTags: (r, e, { courseId }) => [
    { type: "Course", id: courseId },
  ],
}),


    /* ---------------- SEARCH ---------------- */

    getSearchedCourses: builder.query({
      query: ({ searchQuery = "", categories = [], sortByPrice }) => ({
        url: "/search",
        params: {
          query: searchQuery,
          categories: categories.join(","),
          sortByPrice,
        },
      }),
    }),

    /* ---------------- LECTURES ---------------- */

    getLecturesByCourseId: builder.query({
      query: (courseId) => `/${courseId}/lectures`,
      providesTags: (result, error, courseId) =>
        result?.lectures
          ? [
              ...result.lectures.map((l) => ({
                type: "Lectures",
                id: l._id,
              })),
              { type: "Lectures", id: `COURSE_${courseId}` },
            ]
          : [{ type: "Lectures", id: `COURSE_${courseId}` }],
    }),

    getLectureById: builder.query({
      query: (lectureId) => `/lecture/${lectureId}`,
      providesTags: (r, e, id) => [{ type: "Lectures", id }],
    }),

    createLecture: builder.mutation({
      query: ({ courseId, lectureTitle }) => ({
        url: `/${courseId}/lecture`,
        method: "POST",
        body: { lectureTitle },
      }),
      invalidatesTags: (r, e, { courseId }) => [
        { type: "Lectures", id: `COURSE_${courseId}` },
      ],
    }),

   editLecture: builder.mutation({
  query: ({ courseId, lectureId, data }) => ({
    url: `/${courseId}/lecture/${lectureId}`,
    method: "PUT",
    body: data,
  }),
  invalidatesTags: (r, e, { lectureId, courseId }) => [
    { type: "Lectures", id: lectureId },
    { type: "Lectures", id: `COURSE_${courseId}` }, // ✅ IMPORTANT
  ],
}),


    removeLecture: builder.mutation({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Lectures", id: "LIST" }],
    }),
  }),
});

/* ---------------- EXPORTS ---------------- */
export const {
  useGetAllCoursesQuery,
  useGetSearchedCoursesQuery,
  useGetCreatorCoursesQuery,
  useGetCourseByIdQuery,
  useEditCourseMutation,
  useCreateCourseMutation,
  useRemoveCourseMutation,
  useGetLectureByIdQuery,
  useCreateLectureMutation,
  useGetLecturesByCourseIdQuery,
  useEditLectureMutation,
  useRemoveLectureMutation,
  usePublishCourseMutation,
} = courseApi;
