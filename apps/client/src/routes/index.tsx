import { match } from "@lebedevna/match";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { useAuthUrl, useDonationsQ as useDonations, useHealthQ, useUserInfo } from "../hooks/api";

export const Route = createFileRoute("/")({
  component: Home,
  validateSearch: z.object({
    success: z.boolean().optional(),
  }),
});

function Home() {
  const userInfo = useUserInfo();
  const authUrl = useAuthUrl();

  const healthQ = useHealthQ();
  const label = match(healthQ.status, {
    "pending": "Checking API…",
    "success": "API and Postgres are ready",
    "error": "API unavailable",
  });

  const success = Route.useSearch({ select: (s) => s.success });

  const donationsQ = useDonations();

  return (
    <main className="flex flex-col items-start p-4">
      <h1>Omnistream</h1>
      <pre>{JSON.stringify({ userInfo }, null, 2)}</pre>
      <p>{label}</p>
      <a href={authUrl} target="_self" className="text-blue-700 hover:underline">
        auth: donation alerts
      </a>
      {success === true && (
        <div className="inline-flex items-center rounded-sm border border-green-600 bg-green-100 px-2 text-green-600">
          success
        </div>
      )}
      {success === false && (
        <div className="inline-flex items-center rounded-sm border border-red-600 bg-red-100 px-2 text-red-600">
          error
        </div>
      )}
      <pre>{JSON.stringify(donationsQ.data, null, 2)}</pre>
    </main>
  );
}
