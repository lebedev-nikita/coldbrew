import DonationCard from "@client/components/donation-card";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Search, Wallet } from "lucide-react";
import { useMemo, useState } from "react";

import { useDonationsQ } from "../hooks/api";

export const Route = createFileRoute("/donations/")({
  component: DonationsIndex,
});

function DonationsIndex() {
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

  return (
    <>
      <div className="flex flex-col gap-2 border-b border-[#efedf3] p-4 sm:flex-row sm:p-5">
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

      {donationsQ.isLoading ? (
        <div className="space-y-px p-5" aria-label="Loading donations">
          <div className="h-16 animate-pulse rounded-lg bg-[#f7f6f9]" />
          <div className="h-16 animate-pulse rounded-lg bg-[#f7f6f9]" />
          <div className="h-16 animate-pulse rounded-lg bg-[#f7f6f9]" />
        </div>
      ) : filteredDonations.length ? (
        <div className="divide-y divide-[#f0eff3]">
          {filteredDonations.map((donation) => (
            <DonationCard key={donation.donationId} donation={donation} />
          ))}
        </div>
      ) : (
        <EmptyDonations query={query} />
      )}
    </>
  );
}

function EmptyDonations({ query }: { query: string }) {
  return (
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
  );
}
