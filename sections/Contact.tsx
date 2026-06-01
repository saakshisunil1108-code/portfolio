import { Instagram, Linkedin, Mail } from "lucide-react";

const links = [
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "Email", href: "mailto:hello@example.com", icon: Mail },
  { label: "LinkedIn", href: "#", icon: Linkedin }
];

export function Contact() {
  return (
    <section className="section-padding bg-ink text-bone">
      <div className="mx-auto max-w-7xl">
        <p className="font-sans text-[0.65rem] uppercase tracking-archive text-white/40">Contact</p>
        <h2 className="mt-8 max-w-5xl font-editorial text-[clamp(4rem,13vw,13rem)] uppercase leading-[0.82]">
          Let&apos;s create something.
        </h2>
        <div className="mt-14 flex flex-wrap gap-4">
          {links.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className="inline-flex items-center gap-3 border border-white/18 px-5 py-4 font-sans text-xs uppercase tracking-archive text-white/72 transition hover:bg-bone hover:text-ink"
            >
              <Icon size={16} />
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
