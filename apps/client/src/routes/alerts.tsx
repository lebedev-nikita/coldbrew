import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/alerts")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/alerts"!</div>;
}
