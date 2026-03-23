import { useEffect, useState } from "react";
import { useChat } from "@/hooks/use-chat";
import { Spinner } from "../ui/spinner";
import ChatListItem from "./chat-list-item";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import ChatListHeader from "./chat-list-header";
import { useSocket } from "@/hooks/use-socket";
import type { ChatType } from "@/types/chat.type";
import type { MessageType } from "../../types/chat.type";
import { MessageCircle } from "lucide-react";

const ChatList = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const {
    fetchChats,
    chats,
    isChatsLoading,
    addNewChat,
    updateChatLastMessage,
  } = useChat();
  const { user } = useAuth();
  const currentUserId = user?._id || null;

  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats =
    chats?.filter(
      (chat) =>
        chat.groupName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.participants?.some(
          (p) =>
            p._id !== currentUserId &&
            p.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) || [];

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (!socket) return;

    const handleNewChat = (newChat: ChatType) => {
      console.log("Recieved new chat", newChat);
      addNewChat(newChat);
    };

    socket.on("chat:new", handleNewChat);

    return () => {
      socket.off("chat:new", handleNewChat);
    };
  }, [addNewChat, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleChatUpdate = (data: {
      chatId: string;
      lastMessage: MessageType;
    }) => {
      console.log("Recieved update on chat", data.lastMessage);
      updateChatLastMessage(data.chatId, data.lastMessage);
    };

    socket.on("chat:update", handleChatUpdate);

    return () => {
      socket.off("chat:update", handleChatUpdate);
    };
  }, [socket, updateChatLastMessage]);

  const onRoute = (id: string) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="font-chat-ui fixed inset-y-0 left-12 z-[98] flex w-full max-w-[calc(100%-3rem)] flex-col border-r border-[#E8EAED] bg-white pb-20 shadow-[1px_0_0_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-zinc-900 dark:shadow-none lg:max-w-[379px] lg:pb-0">
      <div className="flex min-h-0 flex-1 flex-col">
        <ChatListHeader onSearch={setSearchQuery} />

        <div className="relative min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,#FFFFFF_0%,#FAFBFC_55%,#F4F5F7_100%)] dark:bg-[linear-gradient(180deg,oklch(0.21_0.006_285.885)_0%,oklch(0.18_0.006_285.885)_100%)]">
          <div className="min-h-[min(320px,45vh)] space-y-0.5 px-3 pb-12 pt-2 md:space-y-1 md:px-3.5 md:pt-3">
            {isChatsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Spinner className="h-7 w-7 text-violet-600" />
              </div>
            ) : filteredChats?.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-violet-100/80 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                  <MessageCircle className="size-7 stroke-[1.25]" />
                </div>
                <p className="max-w-[220px] text-sm font-medium text-[#374151] dark:text-zinc-300">
                  {searchQuery
                    ? "No conversations match your search."
                    : "Start a conversation — your chats will show up here."}
                </p>
              </div>
            ) : (
              filteredChats?.map((chat) => (
                <ChatListItem
                  key={chat._id}
                  chat={chat}
                  currentUserId={currentUserId}
                  onClick={() => onRoute(chat._id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
