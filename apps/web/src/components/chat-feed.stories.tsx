import { ChatFeed } from "./chat-feed";
import { chatFeedMessages } from "./chat-feed.fixtures";

export default {
  title: "Мультичат",
};

export const EditorFeed = Object.assign(
  () => (
    <div className="flex h-full min-h-0 bg-background p-4 text-foreground">
      <section className="cosmic-panel flex h-full min-h-0 w-full max-w-3xl flex-col overflow-hidden">
        <ChatFeed
          capabilitiesForSource={() => ["delete_message", "timeout_user", "ban_user"]}
          emptyLabel="Сообщения появятся здесь, когда подключённый канал выйдет в эфир."
          messages={chatFeedMessages}
          onModerate={() => undefined}
        />
      </section>
    </div>
  ),
  { meta: { width: "large" as const }, storyName: "Лента в приложении" },
);

export const EmptyEditorFeed = Object.assign(
  () => (
    <div className="flex h-full min-h-0 bg-background p-4 text-foreground">
      <section className="cosmic-panel flex h-full min-h-0 w-full max-w-3xl flex-col overflow-hidden">
        <ChatFeed
          emptyLabel="Сообщения появятся здесь, когда подключённый канал выйдет в эфир."
          messages={[]}
        />
      </section>
    </div>
  ),
  { meta: { width: "large" as const }, storyName: "Пустая лента" },
);
