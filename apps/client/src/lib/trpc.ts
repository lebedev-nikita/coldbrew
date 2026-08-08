import type { AppRouter } from "@omnistream/server";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      fetch(url, options) {
        return fetch(url, { ...options, credentials: "include" });
      },
      url: "http://localhost:3000/api/trpc",
      transformer: superjson,
    }),
  ],
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

export const trpc = createTRPCOptionsProxy({
  client: trpcClient,
  queryClient,
});
