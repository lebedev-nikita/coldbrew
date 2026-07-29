import { Metric } from "@client/components/dashboard/metric";
import MockChart from "@client/components/mock-chart";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Copy, Share2, Sparkles, Wallet } from "lucide-react";
import { z } from "zod";

import { useAuthUrl, useDonationsQ as useDonations, useUserInfo } from "../hooks/api";

export const Route = createFileRoute("/")({
  component: Overview,
  validateSearch: z.object({ success: z.boolean().optional() }),
});

const rubles = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const panel = "rounded-xl border border-[#eae8ef] bg-white";

const fmtDate = (d: Date) => {
  const { round } = Math;
  const intl = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  return intl.format(round((d.getTime() - Date.now()) / 3_600_000), "hour");
};

function Overview() {
  const userInfo = useUserInfo();
  const authUrl = useAuthUrl();
  const donationsQ = useDonations();
  const success = Route.useSearch({ select: (search) => search.success });
  const donationAlertsConnected = userInfo !== null && userInfo.hasDonationalertsAccessToken;

  const donations =
    donationsQ.data?.map((donation) => ({
      author: donation.author ?? "Anonymous",
      amount: donation.amount,
      message: donation.message ?? "Sent a donation",
      time: fmtDate(donation.createdAt),
      get initials() {
        return (this.author ?? "A").slice(0, 2).toUpperCase();
      },
      tone: "bg-violet-100 text-violet-700",
    })) ?? [];
  const total = donations.reduce((sum, donation) => sum + donation.amount, 0);

  return (
    <section className="flex min-w-0 flex-1 flex-col" id="top">
      <div className="mx-auto w-full max-w-7xl px-[clamp(18px,4vw,62px)] py-7 sm:py-12">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2.5 text-xs font-bold tracking-wide text-[#9895a6] uppercase">
              Monday, 28 July
            </p>
            <h1 className="text-[clamp(27px,3vw,33px)] font-bold tracking-tight text-[#27243a]">
              Good evening, Nikita <span className="text-violet-500">✦</span>
            </h1>
            <p className="mt-2.5 text-sm text-[#888597]">
              Here’s what’s happening across your stream.
            </p>
          </div>
          <button className="flex w-full items-center justify-between gap-2 rounded-lg border border-[#e3e1e9] bg-white px-3 py-2.5 text-xs font-semibold text-[#646176] sm:w-auto">
            Last 30 days <ChevronRight aria-hidden="true" size={16} />
          </button>
        </div>
        {success !== undefined && (
          <div
            className={`mt-5 rounded-lg px-3.5 py-3 text-[13px] ${success ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
          >
            {success
              ? "Donation Alerts connected successfully."
              : "We couldn't finish connecting your account."}
          </div>
        )}
        <section className="mt-7 grid gap-4 sm:mt-9 md:grid-cols-3" aria-label="Stream statistics">
          <Metric
            title="Total received"
            value={rubles.format(total || 24850)}
            note="↗ 18.2%"
            subnote="vs. previous period"
            icon={Wallet}
            iconClass="bg-violet-100 text-violet-600"
          />
          <Metric
            title="Donations"
            value={String(donations.length || 42)}
            note="↗ 12.5%"
            subnote="vs. previous period"
            icon={Sparkles}
            iconClass="bg-orange-50 text-orange-500"
          />
          <Metric
            title="Average donation"
            value={rubles.format(Math.round((total || 24850) / (donations.length || 42)))}
            note="Across all connected platforms"
            icon={Share2}
            iconClass="bg-sky-50 text-sky-500"
          />
        </section>
        <section className="mt-4 grid gap-4 xl:grid-cols-[1.03fr_.97fr]">
          <article className={panel} id="donations">
            <div className="flex items-start justify-between p-5">
              <div>
                <h2 className="text-[15px] font-semibold text-[#353248]">Recent activity</h2>
                <p className="mt-1.5 text-xs text-[#9491a1]">Every donation, all in one place.</p>
              </div>
              <Link to="/donations" className="flex items-center text-xs font-bold text-violet-600">
                View all <ChevronRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <div>
              {donations.slice(0, 3).map((donation, index) => (
                <div
                  className="flex items-center gap-3 border-t border-[#f0eff3] px-5 py-3.5"
                  key={`${donation.author}-${index}`}
                >
                  <div
                    className={`grid size-8 shrink-0 place-items-center rounded-lg text-[10px] font-bold ${donation.tone}`}
                  >
                    {donation.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs text-[#48445b]">{donation.author}</strong>
                      <span className="rounded bg-[#f0edf7] px-1.5 py-0.5 text-[9px] font-semibold text-[#918ca2]">
                        DonationAlerts
                      </span>
                    </div>
                    <p className="mt-1 truncate text-[11px] text-[#8e8b9b]">{donation.message}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <strong className="block text-xs text-[#48445b]">
                      +{rubles.format(donation.amount)}
                    </strong>
                    <span className="text-[10px] text-[#aaa7b4]">{donation.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
          <article className={`${panel} min-h-[290px] overflow-hidden`}>
            <div className="flex items-start justify-between p-5 pb-1">
              <div>
                <h2 className="text-[15px] font-semibold text-[#353248]">Donation trends</h2>
                <p className="mt-1.5 text-xs text-[#9491a1]">Your earnings over time.</p>
              </div>
              <button className="flex items-center gap-1 rounded-md border border-[#e3e1e9] bg-white px-2 py-1.5 text-[11px] font-semibold text-[#646176]">
                Revenue <ChevronRight aria-hidden="true" size={15} />
              </button>
            </div>
            <div className="relative h-52 px-4 pt-3 pb-2 pl-10">
              <div className="absolute bottom-9 left-2 flex h-[164px] flex-col justify-between text-[10px] text-[#aaa6b5]">
                <span>₽6k</span>
                <span>₽4k</span>
                <span>₽2k</span>
                <span>₽0</span>
              </div>
              <MockChart className="h-[164px] w-full" />
              <div className="flex justify-between text-[10px] text-[#aaa6b5]">
                <span>Jun 29</span>
                <span>Jul 6</span>
                <span>Jul 13</span>
                <span>Jul 20</span>
                <span>Jul 27</span>
              </div>
            </div>
          </article>
        </section>
        <section className="mt-4 grid gap-4 xl:grid-cols-2">
          <article
            className={`${panel} flex min-h-[120px] flex-wrap items-center gap-3 p-5`}
            id="integrations"
          >
            <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-linear-to-br from-orange-400 to-rose-500 text-[11px] font-bold text-white">
              DA
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-[13px] font-semibold text-[#403c52]">DonationAlerts</h2>
                <span
                  className={`flex items-center gap-1 text-[10px] font-bold ${donationAlertsConnected ? "text-emerald-600" : "text-orange-500"}`}
                >
                  <i className="size-1.5 rounded-full bg-current" />
                  {donationAlertsConnected ? "Connected" : "Setup needed"}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-[#9491a1]">
                {donationAlertsConnected
                  ? "Donations are syncing automatically."
                  : "Connect to bring all your donations here."}
              </p>
            </div>
            <a
              className="ml-auto flex items-center gap-1 rounded-lg border border-[#e4e2e9] px-2.5 py-2 text-[11px] font-bold text-[#5f5b70]"
              href={authUrl.donationAlerts}
            >
              Manage <ChevronRight aria-hidden="true" size={16} />
            </a>
          </article>
          <article className="relative flex min-h-[120px] flex-wrap items-center gap-3 overflow-hidden rounded-xl bg-linear-to-r from-violet-700 to-violet-400 p-5 text-white">
            <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/15">
              <Copy aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-[13px] font-semibold">Ready for your overlay?</h2>
              <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-violet-100">
                Bring your donations to life on stream with a custom browser source.
              </p>
            </div>
            <button className="z-10 ml-auto flex items-center gap-1 rounded-lg bg-white px-2.5 py-2 text-[11px] font-bold text-violet-700">
              Create overlay <ChevronRight aria-hidden="true" size={17} />
            </button>
            <span className="absolute -top-16 -right-16 size-[148px] rounded-full border border-white/15" />
          </article>
        </section>
      </div>
    </section>
  );
}
