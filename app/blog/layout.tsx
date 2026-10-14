import type { ReactNode } from "react";
import { BlogBackdrop } from "@/components/blog/BlogBackdrop";
import { BlogChrome } from "@/components/blog/BlogChrome";

/** The blog lives on its own framed 3D stage; it persists while moving between posts. */
export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BlogBackdrop />
      <BlogChrome />
      <main id="main" className="relative z-10 text-[#f4f1ea]">
        {children}
      </main>
    </>
  );
}
