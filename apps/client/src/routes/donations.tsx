import { Button } from "@client/components/ui/button";
import { Donation } from "@omnistream/server";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Download,
  Menu,
  Search,
  SlidersHorizontal,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useDonationsQ } from "../hooks/api";

export const Route = createFileRoute("/donations")({
  component: Donations,
});

const rubles = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const dateTime = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function getInitials(author: string) {
  return author
    .split(/\s+/)
    .map((part) => part.at(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatRelativeDate(date: Date) {
  const { round, abs } = Math;
  const minutes = round((date.getTime() - Date.now()) / 60_000);

  if (abs(minutes) < 60) return relativeTime.format(minutes, "minute");
  if (abs(minutes) < 24 * 60) return relativeTime.format(round(minutes / 60), "hour");
  return relativeTime.format(round(minutes / (24 * 60)), "day");
}

function exportDonations(donations: Donation[]) {
  const headers = ["Supporter", "Amount", "Currency", "Platform", "Message", "Date"];
  const rows = donations.map((donation) => [
    donation.author ?? "Anonymous",
    String(donation.amount),
    donation.currency,
    "DonationAlerts",
    donation.message ?? "",
    donation.createdAt.toISOString(),
  ]);
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const content = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "omnistream-donations.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function Donations() {
  const donationsQ = useDonationsQ();
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState<"all" | "week" | "month">("all");
  const donations = donationsQ.data ?? [];
  const now = Date.now();
  const periodStart =
    period === "week"
      ? now - 7 * 24 * 60 * 60 * 1000
      : period === "month"
        ? now - 30 * 24 * 60 * 60 * 1000
        : 0;
  const filteredDonations = useMemo(
    () =>
      donations
        .filter((donation) => donation.createdAt.getTime() >= periodStart)
        .filter((donation) => {
          const searchText = `${donation.author ?? "Anonymous"} ${donation.message ?? ""}`;
          return searchText.toLowerCase().includes(query.trim().toLowerCase());
        })
        .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime()),
    [donations, periodStart, query],
  );
  const total = filteredDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const average = filteredDonations.length ? total / filteredDonations.length : 0;

  return (
    <section className="flex min-w-0 flex-1 flex-col">
      <div className="mx-auto w-full max-w-7xl px-[clamp(18px,4vw,62px)]">
        <section
          className="mt-7 grid gap-4 sm:mt-9 md:grid-cols-3"
          aria-label="Donation statistics"
        >
          <StatCard icon={Wallet} label="Total received" value={rubles.format(total)} />
          <StatCard
            icon={CircleDollarSign}
            label="Donations"
            value={String(filteredDonations.length)}
            tone="orange"
          />
          <StatCard
            icon={CalendarDays}
            label="Average donation"
            value={rubles.format(average)}
            tone="sky"
          />
        </section>

        <article className="mt-4 overflow-hidden rounded-xl border border-[#eae8ef] bg-white">
          <div className="flex flex-col gap-4 border-b border-[#efedf3] p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-[#353248]">All donations</h2>
                <p className="mt-1 text-xs text-[#9491a1]">
                  Browse and search your supporter activity.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal aria-hidden="true" size={15} className="text-violet-600" />
                <span className="text-xs font-semibold text-[#676376]">DonationAlerts</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative min-w-0 grow">
                <Search
                  aria-hidden="true"
                  size={16}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-[#a19eae]"
                />
                <span className="sr-only">Search donations</span>
                <input
                  className="h-9 w-full rounded-lg border border-[#e5e3ea] bg-[#fcfcfd] pr-3 pl-9 text-xs text-[#4a465b] outline-none placeholder:text-[#aaa7b5] focus:border-violet-400 focus:ring-3 focus:ring-violet-100"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by supporter or message..."
                  value={query}
                />
              </label>
              <label className="relative">
                <span className="sr-only">Date range</span>
                <select
                  className="h-9 w-full appearance-none rounded-lg border border-[#e5e3ea] bg-white py-0 pr-8 pl-3 text-xs font-semibold text-[#605c70] outline-none focus:border-violet-400 sm:w-36"
                  onChange={(event) => setPeriod(event.target.value as typeof period)}
                  value={period}
                >
                  <option value="all">All time</option>
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                </select>
                <ChevronDown
                  aria-hidden="true"
                  size={15}
                  className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[#898596]"
                />
              </label>
            </div>
          </div>

          {donationsQ.isLoading ? (
            <div className="space-y-px p-5" aria-label="Loading donations">
              {[1, 2, 3].map((key) => (
                <div className="h-16 animate-pulse rounded-lg bg-[#f7f6f9]" key={key} />
              ))}
            </div>
          ) : filteredDonations.length ? (
            <div className="divide-y divide-[#f0eff3]">
              {filteredDonations.map((donation) => {
                const author = donation.author ?? "Anonymous";
                return (
                  <div
                    className="flex gap-3 px-4 py-4 sm:items-center sm:px-5"
                    key={`${donation.source}-${donation.donationId}`}
                  >
                    <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-violet-100 text-[10px] font-bold text-violet-700">
                      {getInitials(author)}
                    </div>
                    <div className="min-w-0 grow">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <strong className="text-[13px] text-[#454157]">{author}</strong>
                        <span className="rounded bg-[#f0edf7] px-1.5 py-0.5 text-[9px] font-semibold text-[#8d899b]">
                          DonationAlerts
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs text-[#8e8b9b]">
                        {donation.message ?? "Sent a donation"}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <strong className="block text-[13px] text-[#3f3b50]">
                        +{rubles.format(donation.amount)}
                      </strong>
                      <time
                        className="mt-1 block text-[10px] text-[#aaa7b4]"
                        dateTime={donation.createdAt.toISOString()}
                        title={dateTime.format(donation.createdAt)}
                      >
                        {formatRelativeDate(donation.createdAt)}
                      </time>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid min-h-64 place-items-center px-5 text-center">
              <div>
                <div className="mx-auto grid size-11 place-items-center rounded-xl bg-violet-100 text-violet-600">
                  <Wallet aria-hidden="true" size={20} />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-[#4c485b]">
                  {query ? "No matching donations" : "No donations yet"}
                </h3>
                <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-[#908d9d]">
                  {query
                    ? "Try another supporter name or clear your search."
                    : "When your viewers support your stream, their donations will appear here."}
                </p>
              </div>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}

function StatCard({
  icon: Icon,
  label,
  tone = "violet",
  value,
}: {
  icon: typeof Wallet;
  label: string;
  tone?: "violet" | "orange" | "sky";
  value: string;
}) {
  const tones = {
    violet: "bg-violet-100 text-violet-600",
    orange: "bg-orange-50 text-orange-500",
    sky: "bg-sky-50 text-sky-500",
  };
  return (
    <article className="rounded-xl border border-[#eae8ef] bg-white p-5">
      <div className={`grid size-9 place-items-center rounded-lg ${tones[tone]}`}>
        <Icon aria-hidden="true" size={18} />
      </div>
      <p className="mt-4 text-xs text-[#938fa0]">{label}</p>
      <strong className="mt-1 block text-2xl font-bold tracking-tight text-[#353147]">
        {value}
      </strong>
    </article>
  );
}
