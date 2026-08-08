import { fmtCurrency, fmtDate, fmtDuration, formatRelativeDate } from "@client/lib/fmt";
import { Video } from "@omnistream/server";
import { CheckCircle2, Play } from "lucide-react";

import { useTextWithLinks } from "../hooks/use-text-with-links";

type Props = {
  video: Video;
};

function getYoutubeEmbedUrl(url: string) {
  const parsedUrl = new URL(url);
  const host = parsedUrl.hostname.replace(/^www\./, "").toLowerCase();
  const videoId =
    host === "youtu.be"
      ? parsedUrl.pathname.split("/")[1]
      : (parsedUrl.searchParams.get("v") ??
        parsedUrl.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1]);

  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
}

function normalizeUrl(url: string) {
  const parsedUrl = new URL(url.startsWith("www.") ? `https://${url}` : url);
  const pathname = parsedUrl.pathname.replace(/\/$/, "");

  return `${parsedUrl.hostname.toLowerCase()}${pathname}${parsedUrl.search}`;
}

export default function VideoCard({ video }: Props) {
  const author = video.donation.author ?? "Anonymous";
  const messageChunks = useTextWithLinks(video.donation.message ?? "");
  const embedUrl = getYoutubeEmbedUrl(video.url);

  return (
    <article className="flex flex-col gap-3 px-4 py-4 sm:px-5">
      <div className="flex items-center gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-violet-100 text-violet-700">
          {video.isWatched ? (
            <CheckCircle2 aria-hidden="true" size={18} />
          ) : (
            <Play aria-hidden="true" size={18} />
          )}
        </div>
        <div className="min-w-0 grow">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <strong className="text-[13px] text-[#454157]">{author}</strong>
            <span className="rounded bg-[#f0edf7] px-1.5 py-0.5 text-[9px] font-semibold text-[#8d899b]">
              {video.isWatched ? "Watched" : "Queued"}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <strong className="block text-[13px] text-[#3f3b50]">
            +{fmtCurrency(video.donation.currency, video.donation.amount)}
          </strong>
          <time
            className="mt-1 block text-[10px] text-[#aaa7b4]"
            dateTime={video.donation.createdAt.toISOString()}
            title={fmtDate(video.donation.createdAt)}
          >
            {formatRelativeDate(video.donation.createdAt)}
          </time>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {embedUrl && (
          <div className="relative aspect-video overflow-hidden rounded-lg bg-[#f0eff3] sm:w-60 sm:shrink-0">
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="size-full"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              src={embedUrl}
              title={`YouTube video from ${author}`}
            />
            {video.durationSeconds !== null && (
              <span className="absolute right-2 bottom-2 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-medium text-white">
                {fmtDuration(video.durationSeconds)}
              </span>
            )}
          </div>
        )}

        <p className="min-w-0 grow text-xs leading-relaxed text-[#8e8b9b] sm:py-1">
          {messageChunks.map((chunk, index) => {
            if (chunk.type === "string") {
              return <span key={index}>{chunk.value}</span>;
            }

            const isVideoLink = normalizeUrl(chunk.href) === normalizeUrl(video.url);

            return (
              <a
                className={
                  isVideoLink
                    ? "rounded bg-violet-100 px-1 py-0.5 font-semibold text-violet-700 hover:bg-violet-200"
                    : "font-semibold text-violet-600 hover:underline"
                }
                href={chunk.href}
                key={index}
                rel="noreferrer"
                target="_blank"
              >
                {chunk.text}
              </a>
            );
          })}
        </p>
      </div>
    </article>
  );
}
