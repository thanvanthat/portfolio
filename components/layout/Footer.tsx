import { site, socials } from "@/data/site";
import { BrandIcon } from "@/components/ui/BrandIcon";

export function Footer() {
  return (
    <footer className="gutter border-t border-bone/10 pb-8 pt-16">
      <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="display text-[clamp(3rem,11vw,10rem)] text-bone">{site.name}</p>
          <p className="label mt-4 text-ash">
            Game Developer <span className="px-2 text-bone/40">/</span> AI Engineer
          </p>
        </div>
        <ul className="flex gap-6">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="label flex items-center gap-2 text-ash transition-colors hover-fine:text-bone"
              >
                <BrandIcon name={s.label} className="size-4" />
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="label mt-12 flex flex-wrap justify-between gap-4 border-t border-bone/10 pt-6 text-ash">
        <span>
          © {site.year} {site.name.toUpperCase()}
        </span>
        <a href="#top" className="transition-colors hover-fine:text-bone">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
