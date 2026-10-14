"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** With "Reduce motion" on, Framer Motion skips movement and keeps fades. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
