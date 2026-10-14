"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Variant = "solid" | "ghost";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  external?: boolean;
  cursor?: string;
  ariaLabel?: string;
  strength?: number;
}

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden px-6 py-4 label text-[0.72rem] transition-colors duration-500 min-h-12";

const variants: Record<Variant, string> = {
  solid: "bg-bone text-ink",
  ghost: "border border-bone/25 text-bone hover-fine:border-bone",
};

const fills: Record<Variant, string> = {
  solid: "bg-ink/10",
  ghost: "bg-bone",
};

/** A button that leans toward the pointer and wipes its fill on hover. */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "solid",
  className,
  external,
  cursor = "hover",
  ariaLabel,
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = usePrefersReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[var(--ease-cine)] group-hover:scale-y-100",
          fills[variant],
        )}
      />
      <span
        className={cn(
          "relative z-10 flex items-center gap-3",
          variant === "ghost" && "transition-colors duration-500 group-hover:text-ink",
        )}
      >
        {children}
      </span>
    </>
  );

  const classes = cn(base, variants[variant], className);

  return (
    <motion.span
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block will-change-transform"
    >
      {href ? (
        external ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className={classes}
            data-cursor={cursor}
            aria-label={ariaLabel}
          >
            {inner}
          </a>
        ) : href.startsWith("#") || href.startsWith("mailto:") ? (
          <a href={href} className={classes} data-cursor={cursor} aria-label={ariaLabel}>
            {inner}
          </a>
        ) : (
          <Link href={href} className={classes} data-cursor={cursor} aria-label={ariaLabel}>
            {inner}
          </Link>
        )
      ) : (
        <button type="button" onClick={onClick} className={classes} data-cursor={cursor} aria-label={ariaLabel}>
          {inner}
        </button>
      )}
    </motion.span>
  );
}
