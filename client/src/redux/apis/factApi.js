import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const factApi = createApi({
  reducerPath: 'factApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://uselessfacts.jsph.pl/' }),
  endpoints: (builder) => ({
    getRandomFact: builder.query({
      query: () => `random.json?language=en`,
    }),
  }),
});

export const { useGetRandomFactQuery } = factApi;
