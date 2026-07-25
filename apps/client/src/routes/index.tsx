import { match } from "@lebedevna/match";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "../lib/trpc";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const healthQ = useQuery(trpc.health.queryOptions(undefined, { refetchInterval: 60e3 }));

  const label = match(healthQ.status, {
    "pending": "Checking API…",
    "success": "API and Postgres are ready",
    "error": "API unavailable",
  });

  return (
    <main>
      <h1>Omnistream</h1>
      <p>{label}</p>
    </main>
  );
}
