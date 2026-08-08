import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { trpc } from "../lib/trpc";

export function useUserInfo() {
  return useSuspenseQuery(trpc.userInfo.queryOptions()).data;
}

export function useDonationsQ() {
  return useQuery(trpc.donations.queryOptions());
}

export function useVideosQ() {
  return useQuery(trpc.videos.queryOptions());
}

export function useAuthUrl() {
  return useSuspenseQuery(trpc.authUrls.queryOptions()).data;
}
