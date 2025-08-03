import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { server } from "../../constants/config"


const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
    tagTypes: ['Gigs', 'Orders'],
    endpoints: (builder) => ({
        searchGigs: builder.query(
            {
                query: ({ category = '', minPrice, maxPrice }) => {
                    const params = new URLSearchParams();
                    if (category) params.append("category", category)
                    if (minPrice) params.append("minPrice", minPrice)
                    if (maxPrice) params.append("maxPrice", maxPrice)

                    return {
                        url: `client/browsegigs?${params.toString()}`,
                        credentials: 'include',
                    }
                },
                providedTags: ['Gigs']
            }
        ),
        WorkerProfile: builder.query(
            {
                query: ({ workerId }) => {
                    return {
                        url: `client/profile/${workerId}`,
                        credentials: 'include',
                    }
                },
            }
        ),

        getGigInfo: builder.query(
            {
                query: ({ id }) => {
                    return {
                        url: `client/gigs/${id}`,
                        credentials: 'include',
                    }
                },
                invalidatesTags: ['Gigs']
            }
        ),
        askQuestion: builder.mutation({
            query: ({ id, question }) => ({
                url: `client/gigs/${id}`,
                method: 'PUT',
                credentials: 'include',
                body: {
                    question,
                },
            }),
        }),
        getMyOrders: builder.query(
            {
                query: () => {
                    return {
                        url: `client/orders`,
                        credentials: 'include',
                    }
                },
                providesTags: ['Orders'],
            }
        ),
        fetchOrder: builder.query(
            {
                query: ({ orderId, route }) => {
                    return {
                        url: `${route}/order/${orderId}`,
                        credentials: 'include',
                    }
                },
            }
        ),
        createProfile: builder.mutation({
            query: (formData) => ({
                url: 'worker/createprofile',
                method: 'POST',
                body: formData,
                credentials: 'include',
            }),
        }),
        createGig: builder.mutation({
            query: (formData) => ({
                url: 'worker/mygigs',
                method: 'POST',
                body: formData,
                credentials: 'include',
            }),
            invalidatesTags: ['Gigs']
        }),
        getMyGigInfo: builder.query(
            {
                query: ({ id }) => {
                    return {
                        url: `worker/mygigs/${id}`,
                        credentials: 'include',
                    }
                },
            }
        ),
        getMessages: builder.query(
            {
                query: ({ orderId }) => {
                    return {
                        url: `chat/getmessages/${orderId}`,
                        credentials: 'include',
                    }
                },
            }
        ),
        updateProfile: builder.mutation({
            query: (formData) => ({
                url: 'worker/updateprofile',
                method: 'PUT',
                body: formData,
                credentials: 'include',
            }),
        }),
        getProfile: builder.query(
            {
                query: () => {
                    return {
                        url: `worker/getprofile`,
                        credentials: 'include',
                    }
                },
            }
        ),
        getMyGigs: builder.query(
            {
                query: () => {
                    return {
                        url: `worker/mygigs`,
                        credentials: 'include',
                    }
                },
                providesTags: ['Gigs']
            }
        ),
        getOrders: builder.query(
            {
                query: () => {
                    return {
                        url: `worker/getorders`,
                        credentials: 'include',
                    }
                },
                providesTags: ['Orders']
            }
        ),
        updateMyGig: builder.mutation({
            query: ({ _id, formData }) => ({
                url: `worker/mygigs/${_id}`,
                method: 'PUT',
                body: formData,
                credentials: 'include',
            }),
            invalidatesTags: ['Gigs']
        }),
        answerFaq: builder.mutation({
            query: ({ _id, answer, gigId }) => ({
                url: `worker/mygigs/${gigId}/answerfaq`,
                method: 'PUT',
                body: { answer, faqId: _id }, 
                credentials: 'include',
            }),
            invalidatesTags: ['Gigs']
        }),
        handleOrder: builder.mutation({
            query: ({ orderId, status }) => ({
                url: `worker/handleorder`,
                method: 'PUT',
                body: { orderId, status },
                credentials: 'include',
            }),
            invalidatesTags: ['Orders']
        }),
        newOrder: builder.mutation({
            query: ({ id }) => ({
                url: `client/createorder`,
                method: 'POST',
                credentials: 'include',
                body: {
                    gigId: id,
                },
            }),
            invalidatesTags: ['Orders']
        }),
        rateOrder: builder.mutation({
            query: ({ orderId, rating, gigId, freelancerId }) => ({
                url: `client/rateorder`,
                method: 'PUT',
                credentials: 'include',
                body: {
                    orderId,
                    rating,
                    gigId,
                    freelancerId,
                },
            }),
            invalidatesTags: ['Orders']
        }),

    })
})
export default api;
export const {
    useLazySearchGigsQuery,
    useLazyWorkerProfileQuery,
    useGetGigInfoQuery,
    useAskQuestionMutation,
    useGetMyOrdersQuery,
    useNewOrderMutation,
    useRateOrderMutation,
    useFetchOrderQuery,
    useGetProfileQuery,
    useCreateProfileMutation,
    useUpdateProfileMutation,
    useGetMyGigsQuery,
    useCreateGigMutation,
    useGetMyGigInfoQuery,
    useUpdateMyGigMutation,
    useGetOrdersQuery,
    useHandleOrderMutation,
    useAnswerFaqMutation,
    useGetMessagesQuery,
} = api