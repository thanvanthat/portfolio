import Image from "next/image";
import type { ProjectScreen } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FrameProps {
  screen: ProjectScreen;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/** Handset frame around a real phone capture. */
export function PhoneFrame({ screen, className, sizes = "(min-width: 1024px) 22vw, 60vw", priority }: FrameProps) {
  return (
    <div
      className={cn(
        "relative rounded-[2.2rem] border border-white/15 bg-[#0c0c0d] p-[7px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[1.75rem]" style={{ aspectRatio: `${screen.width} / ${screen.height}` }}>
        <Image src={screen.src} alt={screen.alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      </div>
      <span aria-hidden="true" className="absolute left-1/2 top-[13px] h-[14px] w-[28%] -translate-x-1/2 rounded-full bg-black" />
    </div>
  );
}

/** Minimal browser chrome around a real desktop capture. */
export function BrowserFrame({
  screen,
  className,
  sizes = "(min-width: 1024px) 50vw, 90vw",
  priority,
  url,
}: FrameProps & { url?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/12 bg-[#151619] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        {url && (
          <span className="ml-3 hidden truncate rounded-md bg-white/5 px-3 py-1 font-mono text-[0.65rem] text-white/75 sm:block">
            {url.replace(/^https?:\/\//, "")}
          </span>
        )}
      </div>
      <div className="relative" style={{ aspectRatio: `${screen.width} / ${screen.height}` }}>
        <Image src={screen.src} alt={screen.alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      </div>
    </div>
  );
}
