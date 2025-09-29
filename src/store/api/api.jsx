//api.jsx
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const Api = createApi({
    reducerPath: 'Api',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL,credentials:"include" }),
    endpoints: (builder) => ({
        // Leave Request Endpoints
        getPendingLeaveRequests: builder.query({
            query: () => '/leaves/requests/pending',
            providesTags: ['LeaveRequest'],
        }),
        submitLeaveRequest: builder.mutation({
            query: (leaveData) => ({
                url: '/leaves/requests',
                method: 'POST',
                body: leaveData,
            }),
            invalidatesTags: ['LeaveRequest'],
        }),
        getLeaveRequests: builder.query({
            query: () => '/leaves/requests',
            providesTags: ['LeaveRequest'],
        }),
        getLeaveRequestById: builder.query({
            query: (id) => `/leaves/requests/${id}`,
            providesTags: ['LeaveRequest'],
        }),
        updateRequestStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/leaves/requests/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['LeaveRequest'],
        }),
        deleteLeaveRequest: builder.mutation({
            query: (id) => ({
                url: `/leaves/requests/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['LeaveRequest'],
        }),
    }),
    tagTypes: ["Auth","Employee", "Project" , "User","Department", "LeaveRequest"],

})

// Export the generated hooks
export const {
    useGetPendingLeaveRequestsQuery,
    useSubmitLeaveRequestMutation,
    useGetLeaveRequestsQuery,
    useGetLeaveRequestByIdQuery,
    useUpdateRequestStatusMutation,
    useDeleteLeaveRequestMutation
} = Api


