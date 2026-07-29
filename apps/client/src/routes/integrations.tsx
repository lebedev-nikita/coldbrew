import { Button } from "@client/components/ui/button";
import { trpc } from "@client/lib/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Check, ChevronRight, ShieldCheck } from "lucide-react";

import { useAuthUrl, useUserInfo } from "../hooks/api";

export const Route = createFileRoute("/integrations")({
  component: RouteComponent,
});

function useDisconnectM() {
  const client = useQueryClient();

  return useMutation(
    trpc.integration.disconnect.mutationOptions({
      onSuccess() {
        client.invalidateQueries({ queryKey: trpc.userInfo.queryKey() });
      },
    }),
  );
}

function RouteComponent() {
  const authUrl = useAuthUrl();
  const userInfo = useUserInfo();
  const connected = userInfo !== null && userInfo.hasDonationalertsAccessToken;

  const disconnectM = useDisconnectM();

  return (
    <section className="flex min-w-0 flex-1 flex-col">
      <div className="mx-auto w-full max-w-5xl px-[clamp(18px,4vw,62px)] py-7 sm:py-12">
        <p className="mb-2.5 text-xs font-bold tracking-wide text-[#9895a6] uppercase">Platforms</p>
        <h1 className="text-[clamp(27px,3vw,33px)] font-bold tracking-tight text-[#27243a]">
          Integrations
        </h1>
        <p className="mt-2.5 max-w-xl text-sm text-[#888597]">
          Connect the services you use to keep every donation in one place.
        </p>

        <article className="mt-8 overflow-hidden rounded-xl border border-[#eae8ef] bg-white sm:mt-10">
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-linear-to-br from-orange-400 to-rose-500 text-sm font-bold text-white shadow-sm">
              DA
            </div>
            <div className="min-w-0 grow">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-[#403c52]">
                  {/* TODO: add payment link */}
                  <a
                    href="https://donationalerts.com/dashboard"
                    className="cursor-pointer hover:underline"
                    target="_blank"
                  >
                    DonationAlerts
                  </a>
                </h2>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${connected ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-600"}`}
                >
                  <i className="size-1.5 rounded-full bg-current" />
                  {connected ? "Connected" : "Not connected"}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-[#888597]">
                {connected
                  ? "Your DonationAlerts donations are syncing automatically."
                  : "Import donations from DonationAlerts automatically."}
              </p>
            </div>
            {connected ? (
              <Button
                variant="destructive"
                size="lg"
                disabled={disconnectM.isPending}
                onClick={() => disconnectM.mutate({ source: "donationalerts" })}
              >
                {disconnectM.isPending ? "Disconnecting…" : "Disconnect"}
              </Button>
            ) : (
              <a
                className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                href={authUrl.donationAlerts}
              >
                {"Connect DonationAlerts"}
                <ChevronRight aria-hidden="true" size={16} />
              </a>
            )}
          </div>
          <div className="flex items-center gap-2 border-t border-[#f0eff3] bg-[#fcfcfd] px-5 py-3 text-xs text-[#888597] sm:px-6">
            <ShieldCheck aria-hidden="true" size={15} className="shrink-0 text-violet-600" />
            You’ll securely authorize Omnistream through DonationAlerts.
          </div>
        </article>

        <div className="mt-5 flex items-center gap-2 text-xs text-[#9895a6]">
          <Check aria-hidden="true" size={15} className="text-emerald-600" />
          More integrations are on the way.
        </div>
      </div>
    </section>
  );
}
