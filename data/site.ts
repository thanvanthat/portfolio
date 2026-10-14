import type { NavItem, SocialLink } from "@/lib/types";

/** Global identity + contact details. Update `url` if the site moves to a new domain. */
export const site = {
  name: "Thanvanth AT",
  shortName: "Thanvanth",
  roles: ["Game Developer", "AI Engineer", "Creative Technologist"],
  tagline: "I build interactive worlds, intelligent systems, and experiences where creativity meets technology.",
  positioning:
    "Computer Science and Engineering student focused on game development, AI, software engineering and interactive technology.",
  url: "https://thanvanth.vercel.app",
  title: "Thanvanth AT — Game Developer & AI Engineer",
  description: "Game Developer and AI Engineer building interactive experiences, AI systems and creative technology.",
  email: "thanvanthat24@gmail.com",
  year: 2026,
} as const;

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/thanvanthat", handle: "@thanvanthat" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/thanvanthat", handle: "in/thanvanthat" },
];

export const navItems: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "journey", label: "Journey" },
  { id: "works", label: "Works" },
  { id: "contact", label: "Contact" },
];

export const getSocial = (label: string) => socials.find((s) => s.label === label);
