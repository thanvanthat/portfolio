import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/layout/Loader";
import { Navbar } from "@/components/layout/Navbar";

/** Portfolio chrome: intro loader, floating navbar and footer. The blog has its own. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Loader />
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
