import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { NewChatPopover } from "./newchat-popover";
import { cn } from "@/lib/utils";

/**
 * Chat list title, new-chat control, and rounded search field.
 * @param props - Search callback for filtering conversations.
 * @returns Header block for the chat sidebar.
 */
export default function ChatListHeader({
  onSearch,
}: {
  onSearch: (val: string) => void;
}) {
  return (
    <div className="border-b border-[#E8EAED] bg-white/90 px-5 pb-5 pt-6 shadow-[0_6px_20px_-12px_rgba(15,23,42,0.12)] backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/90 dark:shadow-none">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-[1.625rem] font-bold tracking-[-0.02em] text-[#111827] dark:text-zinc-50">
          Chat
        </h1>
        <NewChatPopover />
      </div>
      <InputGroup
        className={cn(
          "font-chat-ui h-11 min-h-11 rounded-full border-0 bg-[#F0F2F5] shadow-none",
          "ring-1 ring-black/[0.04] transition-shadow dark:ring-white/10",
          "has-[[data-slot=input-group-control]:focus-visible]:bg-[#ECEFF3]",
          "has-[[data-slot=input-group-control]:focus-visible]:ring-[#E5E7EB]",
          "dark:bg-zinc-800/90 dark:has-[[data-slot=input-group-control]:focus-visible]:bg-zinc-800",
          "dark:has-[[data-slot=input-group-control]:focus-visible]:ring-white/10",
        )}
      >
        <InputGroupAddon
          align="inline-start"
          className="pl-4 text-neutral-400 dark:text-zinc-500"
        >
          <Search className="size-4 opacity-70" aria-hidden />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search chats..."
          className="placeholder:text-neutral-400 dark:placeholder:text-zinc-500"
          onChange={(e) => onSearch(e.target.value)}
        />
      </InputGroup>
    </div>
  );
}
