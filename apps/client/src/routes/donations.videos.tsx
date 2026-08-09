import { SlugEditor } from "@client/components/slug-editor";
import VideoCard from "@client/components/video-card";
import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";

import { useSlug, useVideosQ } from "../hooks/api";

export const Route = createFileRoute("/donations/videos")({
  component: VideoQueue,
});

function VideoQueue() {
  const videosQ = useVideosQ();

  return (
    <div>
      <SlugEditor />
      {videosQ.isLoading ? (
        <div className="space-y-px p-5" aria-label="Loading video queue">
          <div className="h-16 animate-pulse rounded-lg bg-[#f7f6f9]" />
          <div className="h-16 animate-pulse rounded-lg bg-[#f7f6f9]" />
          <div className="h-16 animate-pulse rounded-lg bg-[#f7f6f9]" />
        </div>
      ) : videosQ.data?.length ? (
        <div className="divide-y divide-[#f0eff3]">
          {videosQ.data.map((video) => (
            <VideoCard key={video.videoId} video={video} />
          ))}
        </div>
      ) : (
        <div className="grid min-h-64 place-items-center px-5 text-center">
          <div>
            <div className="mx-auto grid size-11 place-items-center rounded-xl bg-violet-100 text-violet-600">
              <Wallet aria-hidden="true" size={20} />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[#4c485b]">No videos in the queue</h3>
            <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-[#908d9d]">
              Video links from donations will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
