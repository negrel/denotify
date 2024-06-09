import PaperAirplainOutlineIcon from "@/components/PaperAirplainOutlineIcon.tsx";
import PaperAirplainIcon from "@/components/PaperAirplainIcon.tsx";
import HashtagIcon from "@/components/HashtagIcon.tsx";
import BellIcon from "@/components/BellIcon.tsx";
import BellOutlineIcon from "@/components/BellOutlineIcon.tsx";
import Cog6Icon from "@/components/Cog6Icon.tsx";
import Cog6OutlineIcon from "@/components/Cog6OutlineIcon.tsx";

export default function () {
  const pathname = globalThis.location?.pathname ?? "";

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 flex justify-around portrait:flex-row landscape:flex-col portait:w-full landscape:h-full landscape:px-2 py-2 portrait:shadow-2xl landscape:shadow">
      <a
        href="/feed"
        className="flex-1 flex flex-col justify-center items-center text-xs text-ellipsis"
      >
        {pathname === "/feed" ? <BellIcon /> : <BellOutlineIcon />}
        Feed
      </a>
      <a
        href="/push"
        className="flex-1 flex flex-col justify-center items-center text-xs text-ellipsis"
      >
        {pathname === "/push"
          ? <PaperAirplainIcon />
          : <PaperAirplainOutlineIcon />}
        Send
      </a>
      <a
        href="/channels"
        className="flex-1 flex flex-col justify-center items-center text-xs text-ellipsis"
      >
        <HashtagIcon strokeWidth={pathname === "/channels" ? 2 : 1} />
        Channels
      </a>
      <a
        href="/settings"
        className="flex-1 flex flex-col justify-center items-center text-xs text-ellipsis"
      >
        {pathname === "/settings" ? <Cog6Icon /> : <Cog6OutlineIcon />}
        Settings
      </a>
    </footer>
  );
}
