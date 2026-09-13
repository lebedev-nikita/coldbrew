import { ChatFeed } from "./chat-feed";
import { chatFeedMessages } from "./chat-feed.fixtures";
import { CosmicArt } from "./cosmic-art";

function OverlayPreview({
  className,
  messageSurface = "card",
}: {
  className: string;
  messageSurface?: "card" | "transparent";
}) {
  return (
    <div className={`flex h-full min-h-0 overflow-hidden ${className}`}>
      <ChatFeed
        emptyLabel="Ожидаем сообщения…"
        messages={chatFeedMessages}
        overlay
        overlayMessageSurface={messageSurface}
      />
    </div>
  );
}

export default {
  title: "Оверлей",
};

export const ObsOverlay = Object.assign(
  () => (
    <div className="cosmic-hero relative flex h-full min-h-0 overflow-hidden rounded-2xl">
      <CosmicArt
        className="absolute top-1/2 left-1/2 w-[min(42rem,80vw)] -translate-x-1/2 -translate-y-1/2 text-[#fff8ed]/35"
        variant="orbit"
      />
      <ChatFeed emptyLabel="Ожидаем сообщения…" messages={chatFeedMessages} overlay />
    </div>
  ),
  { meta: { width: "large" as const }, storyName: "OBS-оверлей" },
);

export const LightBackground = Object.assign(() => <OverlayPreview className="bg-white" />, {
  meta: { width: "large" as const },
  storyName: "Светлый фон",
});

export const DarkBackground = Object.assign(
  () => <OverlayPreview className="bg-black" messageSurface="transparent" />,
  {
    meta: { width: "large" as const },
    storyName: "Тёмный фон",
  },
);
