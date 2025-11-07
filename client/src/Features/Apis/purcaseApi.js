// client/src/Features/Apis/purcaseApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_USER_COURSE_PURCHASE_API = "https://koursify-backend.onrender.com/api/purchase/";

export const purchaseApi = createApi({
    reducerPath: "purchaseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_USER_COURSE_PURCHASE_API,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        // Razorpay Order Creation
        createRazorpayOrder: builder.mutation({
            query: (courseId) => ({
                url: "create-razorpay-order",
                method: "POST",
                body: { courseId }
            })
        }),
        
        // Razorpay Payment Verification
        verifyRazorpayPayment: builder.mutation({
            query: (paymentData) => ({
                url: "verify-razorpay-payment",
                method: "POST",
                body: paymentData
            })
        }),
        
        // Other endpoints (unchanged)
        getCourseDetailStatus: builder.query({
            query: (courseId) => ({
                url: `course/${courseId}/course-status`,
                method: "GET"
            })
        }),
        getAllPurchaseCourse: builder.query({
            query: () => ({
                url: "get-all-purchase-course",
                method: "GET"
            })
        }),
        getAllPurchaseAdminCourse: builder.query({
            query: () => ({
                url: "get-purchase-course-admin",
                method: "GET"
            })
        }),
    })
})

export const {
    useCreateRazorpayOrderMutation,
    useVerifyRazorpayPaymentMutation,
    useGetAllPurchaseAdminCourseQuery,
    useGetAllPurchaseCourseQuery,
    useGetCourseDetailStatusQuery
} = purchaseApi;