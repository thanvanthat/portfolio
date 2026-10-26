"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { navItems, site, socials } from "@/data/site";
import { useActiveSection } from "@/lib/hooks";
import { cn, easeCine, easeOutExpo } from "@/lib/utils";
import { BrandIcon } from "@/components/ui/BrandIcon";

/** Floating minimal navigation with scroll state, active indicator and a full-screen mobile menu. */
export function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const ids = useMemo(() => navItems.map((n) => n.id), []);
  const active = useActiveSection(ids);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 600 && y > prev && !open);
  });

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    // Keep the page behind the menu out of reach for keyboard and screen readers
    const background = [document.getElementById("main"), document.querySelector("footer")].filter((el): el is HTMLElement =>
      Boolean(el),
    );
    document.body.style.overflow = "hidden";
    background.forEach((el) => (el.inert = true));
    const focusFirst = requestAnimationFrame(() => menuRef.current?.querySelector<HTMLElement>("a")?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !menuRef.current || !toggle) return;
      // Cycle focus between the Close button and the menu links
      const focusables = [toggle, ...menuRef.current.querySelectorAll<HTMLElement>("a[href]")];
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(focusFirst);
      document.body.style.overflow = "";
      background.forEach((el) => (el.inert = false));
      window.removeEventListener("keydown", onKey);
      toggle?.focus({ preventScroll: true });
    };
  }, [open]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 gutter pt-4"
        animate={{ y: hidden ? "-120%" : "0%" }}
        transition={{ duration: 0.6, ease: easeCine }}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "flex items-center justify-between gap-6 border px-4 py-3 transition-[background-color,border-color,backdrop-filter] duration-500",
            scrolled || !onHome ? "border-bone/10 bg-ink/70 backdrop-blur-md" : "border-transparent bg-transparent",
          )}
        >
          {/* The name stays in the accessible name on phones too, where it is visually hidden */}
          <Link href="/" className="label flex items-center gap-3 text-bone">
            <span aria-hidden="true" className="grid size-6 place-items-center border border-bone/40 text-[0.6rem]">
              TA
            </span>
            <span className="sr-only sm:not-sr-only">{site.name}</span>
            <span className="sr-only"> — home</span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = onHome && active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={href(item.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "label relative block px-3 py-2 transition-colors duration-300",
                      isActive ? "text-bone" : "text-ash hover-fine:text-bone",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-3 -bottom-px h-px bg-bone"
                        transition={{ duration: 0.5, ease: easeOutExpo }}
                      />
                    )}
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-4">
            <span className="label hidden items-center gap-2 text-ash md:flex">
              <span className="size-1.5 rounded-full bg-[#9fe0a0]" style={{ animation: "pulse-dot 2.4s infinite" }} />
              Building
            </span>
            <button
              ref={toggleRef}
              type="button"
              className="label flex h-10 items-center gap-3 text-bone lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span className="relative block h-2.5 w-6" aria-hidden="true">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-px w-full bg-bone transition-transform duration-500",
                    open && "translate-y-[5px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-px w-full bg-bone transition-transform duration-500",
                    open && "-translate-y-[4px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink gutter pb-8 pt-28 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: easeCine }}
          >
            <ul className="flex flex-col">
              {navItems.map((item, i) => (
                <li key={item.id} className="overflow-hidden border-b border-bone/10">
                  <motion.a
                    href={href(item.id)}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between py-2"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.15 + i * 0.05 }}
                  >
                    <span className="display text-[clamp(2.75rem,12vw,5rem)]">{item.label}</span>
                    <span className="label text-ash">0{i + 1}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              className="flex items-center justify-between pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
            >
              <span className="label text-ash">Game Developer + AI Engineer</span>
              <div className="flex gap-5">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.label}
                    className="text-bone"
                  >
                    <BrandIcon name={s.label} className="size-5" />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
