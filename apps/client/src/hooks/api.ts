import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { trpc } from "../lib/trpc";

export function useUserInfo() {
  return useSuspenseQuery(trpc.userInfo.queryOptions()).data;
}

export function useDonationsQ() {
  return useQuery(trpc.donations.queryOptions());
}

export function useAuthUrl() {
  return useSuspenseQuery(trpc.meta.queryOptions()).data.authUrl;
}

export function useHealthQ() {
  return useQuery(trpc.health.queryOptions(undefined, { refetchInterval: 60e3 }));
}
