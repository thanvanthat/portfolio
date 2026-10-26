import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="gutter flex min-h-[100svh] flex-col justify-center pt-24">
      <p className="label text-ash">Error 404 — Out of bounds</p>
      <h1 className="display mt-6 text-[clamp(5rem,20vw,18rem)] text-bone">Lost in the level.</h1>
      <Link href="/" className="label mt-10 inline-flex w-fit border-b border-bone pb-2 text-bone">
        Respawn at home →
      </Link>
    </section>
  );
}
