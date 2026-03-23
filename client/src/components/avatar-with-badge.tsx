import groupImg from "@/assets/group-img.png";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  src?: string;
  size?: string;
  isOnline?: boolean;
  isGroup?: boolean;
  className?: string;
  variant?: "list" | "default";
}

/**
 * Avatar with optional online dot; list variant uses outer frame so ring/shadow are not clipped by overflow.
 * @param props - Name, image, size, online state, and optional list framing.
 * @returns Wrapped avatar element.
 */
const AvatarWithBadge = ({
  name,
  src,
  isOnline,
  isGroup = false,
  size = "w-9 h-9",
  className,
  variant = "default",
}: Props) => {
  const avatar = isGroup ? groupImg : src || "";
  const isList = variant === "list";

  const inner = (
    <Avatar className={cn(size, isList && "ring-0")}>
      <AvatarImage src={avatar} className="object-cover" />
      <AvatarFallback
        className={cn(
          "bg-gradient-to-br from-violet-100 to-violet-200 text-sm font-semibold text-violet-700",
          "dark:from-violet-900/50 dark:to-violet-800/50 dark:text-violet-200",
          className && className,
        )}
      >
        {name?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );

  const framed = isList ? (
    <div
      className={cn(
        "rounded-full bg-white p-[2px] shadow-[0_2px_12px_rgba(15,23,42,0.1)] ring-1 ring-neutral-200/90",
        "dark:bg-zinc-800 dark:ring-white/10 dark:shadow-[0_2px_12px_rgba(0,0,0,0.35)]",
      )}
    >
      {inner}
    </div>
  ) : (
    inner
  );

  return (
    <div className="relative shrink-0">
      {framed}
      {isOnline && !isGroup ? (
        <span
          className="absolute bottom-0 right-0 z-[2] box-border size-3 rounded-full border-[2.5px] border-white bg-emerald-500 shadow-sm dark:border-zinc-900"
          aria-hidden
        />
      ) : null}
    </div>
  );
};

export default AvatarWithBadge;
