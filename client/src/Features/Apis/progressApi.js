import { createApi } from "@reduxjs/toolkit/query/react";
import { createAuthenticatedBaseQuery } from "./baseQuery.js";

export const progressApi = createApi({
    reducerPath: "progressApi",
    baseQuery: createAuthenticatedBaseQuery("progress"),
    endpoints: (builder) => ({
        getCourseProgress: builder.query({
            query: (courseId) => ({
                url: `${courseId}`,
                method: "GET"
            })
        }),
        updateLectProgress: builder.mutation({
            query: ({ courseId, lectureId }) => ({
                url: `${courseId}/lecture/${lectureId}/view`,
                method: "POST"
            })
        }),
        completeCourse: builder.mutation({
            query: (courseId) => ({
                url: `${courseId}/complete`,
                method: "POST"
            })
        }),
        inCompleteCourse: builder.mutation({
            query: (courseId) => ({
                url: `${courseId}/InComplete`,
                method: "POST"
            })
        })
    })
});

export const {
    useGetCourseProgressQuery,
    useUpdateLectProgressMutation,
    useCompleteCourseMutation,
    useInCompleteCourseMutation
} = progressApi;
