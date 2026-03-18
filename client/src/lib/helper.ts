import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { useSocket } from "@/hooks/use-socket";
import type { ChatType } from "@/types/chat.type";

export const isUserOnline = (userId?: string) => {
  if (!userId) return false;
  const { onlineUsers } = useSocket.getState();
  return onlineUsers.includes(userId);
};

export const getOtherUserAndGroup = (
  chat: ChatType,
  currentUserId: string | null
) => {
  const isGroup = chat?.isGroup;

  if (isGroup) {
    return {
      name: chat.groupName || "Unnamed Group",
      subheading: `${chat.participants.length} members`,
      avatar: "",
      isGroup,
    };
  }

  const other = chat?.participants.find((p) => p._id !== currentUserId);
  const isOnline = isUserOnline(other?._id ?? "");

  return {
    name: other?.name || "Unknown",
    subheading: isOnline ? "Online" : "Offline",
    avatar: other?.avatar || "",
    isGroup: false,
    isOnline,
    isAI: other?.isAI || false,
  };
};

export const formatChatTime = (date: string | Date) => {
  if (!date) return "";
  const newDate = new Date(date);
  if (isNaN(newDate.getTime())) return "Invalid date";

  if (isToday(newDate)) return format(newDate, "h:mm a");
  if (isYesterday(newDate)) return "Yesterday";
  if (isThisWeek(newDate)) return format(newDate, "EEEE");
  return format(newDate, "M/d");
};

export function generateUUID(): string {
  return uuidv4();
}

/**
 * Resolves a stable string id from API or socket user references for comparisons.
 * @param ref - Populated user document, raw id string, or nullish.
 * @returns Comparable id string or null when missing.
 */
export function resolveEntityId(
  ref: string | { _id?: unknown } | null | undefined
): string | null {
  if (ref == null) return null;
  if (typeof ref === "string") return ref;
  const id = ref._id;
  if (id == null) return null;
  return typeof id === "string" ? id : String(id);
}
