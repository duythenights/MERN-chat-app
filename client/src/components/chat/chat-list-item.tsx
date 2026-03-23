import { getOtherUserAndGroup } from "@/lib/helper";
import { cn } from "@/lib/utils";
import type { ChatType } from "@/types/chat.type";
import { useLocation } from "react-router-dom";
import AvatarWithBadge from "../avatar-with-badge";
import { formatChatTime } from "../../lib/helper";

interface PropsType {
  chat: ChatType;
  currentUserId: string | null;
  onClick?: () => void;
}

/**
 * Conversation row: soft hover, active state with violet accent bar (no heavy border).
 * @param props - Chat payload, current user id, and click handler.
 * @returns Accessible row button for the sidebar list.
 */
const ChatListItem = ({ chat, currentUserId, onClick }: PropsType) => {
  const { pathname } = useLocation();
  const { lastMessage, createdAt } = chat;

  const { name, avatar, isOnline, isGroup } = getOtherUserAndGroup(
    chat,
    currentUserId
  );

  const isActive = pathname.includes(chat._id);

  const getLastMessageText = () => {
    if (!lastMessage) {
      return isGroup
        ? chat.createdBy === currentUserId
          ? "Group created"
          : "You were added"
        : "Send a message";
    }
    if (lastMessage.image) return "Photo";

    if (isGroup && lastMessage.sender) {
      return `${
        lastMessage.sender._id === currentUserId
          ? "You"
          : lastMessage.sender.name
      }: ${lastMessage.content}`;
    }

    return lastMessage.content;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "font-chat-ui group relative flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition-[background-color,box-shadow] duration-200",
        "hover:bg-neutral-100/90 dark:hover:bg-zinc-800/70",
        isActive
          ? "bg-violet-50/90 shadow-sm dark:bg-violet-950/35"
          : "bg-transparent",
      )}
    >
      <span
        className={cn(
          "absolute left-0 top-1/2 h-[70%] w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-[#A78BFA] to-[#7C3AED] transition-opacity duration-200",
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50",
        )}
        aria-hidden
      />

      <div className="relative z-[1] flex min-w-0 flex-1 gap-3 pl-0.5">
        <AvatarWithBadge
          name={name}
          src={avatar}
          isGroup={isGroup}
          isOnline={isOnline}
          size="h-11 w-11"
          variant="list"
        />

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="mb-0.5 flex items-start justify-between gap-2">
            <span
              className={cn(
                "block truncate text-[0.9375rem] font-semibold leading-tight tracking-tight text-[#111827] dark:text-zinc-100",
                isActive && "text-[#5B21B6] dark:text-violet-300",
              )}
            >
              {name}
            </span>
            <time
              className={cn(
                "shrink-0 text-[0.6875rem] font-medium tabular-nums text-neutral-400 dark:text-zinc-500",
                isActive && "text-violet-600/90 dark:text-violet-400/90",
              )}
              dateTime={
                lastMessage?.updatedAt
                  ? String(lastMessage.updatedAt)
                  : String(createdAt)
              }
            >
              {formatChatTime(lastMessage?.updatedAt || createdAt)}
            </time>
          </div>
          <p className="truncate text-[0.8125rem] leading-snug text-neutral-500 dark:text-zinc-400">
            {getLastMessageText()}
          </p>
        </div>
      </div>
    </button>
  );
};

export default ChatListItem;
