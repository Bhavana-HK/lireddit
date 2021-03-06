import { cacheExchange } from '@urql/exchange-graphcache';
import { SSRExchange } from 'next-urql';
import { dedupExchange, fetchExchange } from 'urql';
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';

export const createUrqlClient = (ssrExchange: SSRExchange, _ctx: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
  },
  /**
   * after loging in, the 'me' query runs, but takes the response from cache.
   * this graph chache exchang is written to run the 'me' qurey again, after succesful 'login' mutation
   * the name of the mutation should be matching with backend's mutation ( login: (result, ar....)
   * use the args's cache to run the me query again : cache.updateQuery({query: MeDocument}, (data)=>data.user='bob')
   */
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result, args, cache, info) => {
            console.log(_result, args, cache, info);
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache, // pass the cache
              { query: MeDocument }, // which query to run, and its variables
              _result, // the result of the query
              (result, query) => {
                // the function returns null or the new query to be cached
                if (result.login.errors) {
                  //if login has any errors, no update to cache, so return the original query
                  return query;
                }
                // if the login is sucessful, update the me query
                return {
                  me: result.login.user,
                };
              }
            );
          },

          register: (_result, args, cache, info) => {
            console.log(_result, args, cache, info);
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                }
                return {
                  me: result.register.user,
                };
              }
            );
          },

          logout: (_result, args, cache, info) => {
            console.log(_result, args, cache, info);
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (!result.logout) {
                  return query;
                }
                return {
                  me: null,
                };
              }
            );
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
