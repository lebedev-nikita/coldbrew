import { Icons } from "@client/components/icons";
import { SlugEditor } from "@client/components/slug-editor";
import { Button } from "@client/components/ui/button";
import VideoCard from "@client/components/video-card";
import { createFileRoute } from "@tanstack/react-router";
import { Bookmark, CheckCircle2, Circle, Wallet } from "lucide-react";
import { useState } from "react";

import { useUpdateVideoStatusM, useVideosQ } from "../hooks/api";

export const Route = createFileRoute("/donations/videos")({
  component: VideoQueue,
});

function VideoQueue() {
  const videosQ = useVideosQ();
  const updateVideoStatusM = useUpdateVideoStatusM();
  const [activeTab, setActiveTab] = useState<"notwatched" | "watched" | "saved">("notwatched");
  const videos = videosQ.data ?? [];
  const visibleVideos = videos
    .filter((video) => {
      if (activeTab === "notwatched") return video.watchedAt === null;
      if (activeTab === "watched") return video.watchedAt !== null;
      return video.savedAt !== null;
    })
    .sort((left, right) => {
      const leftDate =
        activeTab === "watched"
          ? left.watchedAt
          : activeTab === "saved"
            ? left.savedAt
            : left.donation.createdAt;
      const rightDate =
        activeTab === "watched"
          ? right.watchedAt
          : activeTab === "saved"
            ? right.savedAt
            : right.donation.createdAt;

      return rightDate!.getTime() - leftDate!.getTime() || right.videoId - left.videoId;
    });

  const tabs = [
    {
      id: "notwatched" as const,
      label: "Not watched",
      count: videos.filter((video) => video.watchedAt === null).length,
      icon: Circle,
    },
    {
      id: "watched" as const,
      label: "Watched",
      count: videos.filter((video) => video.watchedAt !== null).length,
      icon: CheckCircle2,
    },
    {
      id: "saved" as const,
      label: "Saved",
      count: videos.filter((video) => video.savedAt !== null).length,
      icon: Icons.bookmark,
    },
  ];

  return (
    <div>
      <SlugEditor />
      <div className="flex flex-col lg:flex-row">
        <div className="order-2 min-w-0 grow lg:order-1">
          {videosQ.isLoading ? (
            <div className="space-y-px p-5" aria-label="Loading video queue">
              <div className="h-16 animate-pulse rounded-lg bg-[#f7f6f9]" />
              <div className="h-16 animate-pulse rounded-lg bg-[#f7f6f9]" />
              <div className="h-16 animate-pulse rounded-lg bg-[#f7f6f9]" />
            </div>
          ) : visibleVideos.length ? (
            <div className="divide-y divide-[#f0eff3]">
              {visibleVideos.map((video) => (
                <VideoCard
                  isUpdating={updateVideoStatusM.isPending}
                  key={video.videoId}
                  onStatusChange={(status) =>
                    updateVideoStatusM.mutate({ videoId: video.videoId, ...status })
                  }
                  video={video}
                />
              ))}
            </div>
          ) : (
            <div className="grid min-h-64 place-items-center px-5 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="grid size-11 place-items-center rounded-xl bg-violet-100 text-violet-600">
                  <Wallet aria-hidden="true" size={20} />
                </div>
                <h3 className="text-sm font-semibold text-[#4c485b]">
                  {videos.length
                    ? `No ${tabs.find((tab) => tab.id === activeTab)?.label.toLowerCase()} videos`
                    : "No videos in the queue"}
                </h3>
                <p className="max-w-xs text-xs leading-relaxed text-[#908d9d]">
                  {videos.length
                    ? "Videos matching this filter will appear here."
                    : "Video links from donations will appear here."}
                </p>
              </div>
            </div>
          )}
        </div>

        <aside className="order-1 border-b border-[#efedf3] bg-[#fcfbfd] p-3 lg:order-2 lg:w-52 lg:shrink-0 lg:border-b-0 lg:border-l dark:border-[#302c3b] dark:bg-[#1c1925]">
          <div className="flex flex-col gap-1" aria-label="Video status filters" role="tablist">
            {tabs.map(({ id, label, count, icon: Icon }) => {
              const isActive = id === activeTab;
              return (
                <Button
                  aria-selected={isActive}
                  className="h-auto px-3 py-2 text-left text-xs font-semibold"
                  key={id}
                  onClick={() => setActiveTab(id)}
                  role="tab"
                  type="button"
                  variant={isActive ? "secondary" : "ghost"}
                >
                  <Icon aria-hidden="true" size={15} />
                  <span className="grow">{label}</span>
                  <span className="text-[10px] font-bold">{count}</span>
                </Button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
