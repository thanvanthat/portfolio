"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Soft fade between posts; the 3D stage in the layout stays put and just re-frames. */
export default function BlogTemplate({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}
