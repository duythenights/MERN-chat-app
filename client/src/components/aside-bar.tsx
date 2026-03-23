import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "./theme-provider";
import { isUserOnline } from "@/lib/helper";
import Logo from "./logo";
import { PROTECTED_ROUTES } from "@/routes/routes";
import { Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import AvatarWithBadge from "./avatar-with-badge";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const railBtnClass =
  "flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition-all hover:bg-black/[0.06] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 dark:text-white/88 dark:hover:bg-white/10 dark:focus-visible:ring-[#C4B5FD]/70";

/**
 * Fixed left navigation rail: chat home, theme, and account menu.
 * @returns The app aside element.
 */
const AsideBar = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { pathname } = useLocation();

  const isOnline = isUserOnline(user?._id);
  const isChatRoute =
    pathname === PROTECTED_ROUTES.CHAT ||
    pathname.startsWith(`${PROTECTED_ROUTES.CHAT}/`);

  return (
    <aside
      className={cn(
        "font-chat-ui fixed inset-y-0 left-0 z-[9999] flex w-12 flex-col overflow-visible",
        "border-r border-violet-200/70 bg-gradient-to-b from-[#F1EDFA] via-[#EBE6F4] to-[#E5DFEF]",
        "shadow-[2px_0_16px_rgba(91,33,182,0.07)]",
        "dark:border-white/[0.07] dark:from-[#34303f] dark:via-[#2e2a3a] dark:to-[#282530]",
        "dark:shadow-[4px_0_24px_rgba(0,0,0,0.28)]",
      )}
      aria-label="Main navigation"
    >
      <div className="flex h-full flex-col items-center justify-between px-2 pb-5 pt-3">
        <div className="relative z-[10000] flex w-full flex-col items-center">
          {isChatRoute ? (
            <span
              className="pointer-events-none absolute -left-2 top-1/2 z-[10001] h-9 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] shadow-[2px_0_12px_rgba(124,58,237,0.35)] dark:from-[#A78BFA] dark:via-[#8B5CF6] dark:to-[#7C3AED] dark:shadow-[2px_0_14px_rgba(139,92,246,0.45)]"
              aria-hidden
            />
          ) : null}
          <div className="flex w-full justify-center py-1">
            <Logo
              url={PROTECTED_ROUTES.CHAT}
              imgClass="size-6"
              textClass="text-white"
              showText={false}
              className={cn(
                "rounded-lg p-0.5 transition-all hover:bg-black/[0.06] active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60",
                "dark:hover:bg-white/10 dark:focus-visible:ring-[#C4B5FD]/70",
              )}
            />
          </div>
        </div>

        <div className="relative z-[10000] flex flex-col items-center gap-1.5">
          <button
            type="button"
            className={railBtnClass}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            <span className="relative flex size-[1.15rem] items-center justify-center text-current">
              <Sun className="absolute size-[1.15rem] scale-100 rotate-0 text-amber-600 transition-all dark:scale-0 dark:-rotate-90 dark:text-amber-400" />
              <Moon className="absolute size-[1.15rem] scale-0 rotate-90 text-violet-600 transition-all dark:scale-100 dark:rotate-0 dark:text-violet-300" />
            </span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(railBtnClass, "p-0")}
                aria-label="Account menu"
              >
                <AvatarWithBadge
                  name={user?.name || "User"}
                  src={user?.avatar || ""}
                  isOnline={isOnline}
                  size="h-8 w-8"
                  variant="list"
                  className="!bg-white !text-violet-800 shadow-sm ring-1 ring-violet-200/80 dark:!bg-white/20 dark:!text-white dark:ring-white/15"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="z-[99999] w-48 rounded-lg"
              align="end"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
};

export default AsideBar;
