const links = [
  { label: "Phone: 9972941109", href: "tel:9972941109" },
  { label: "Instagram: @saakshisunil", href: "https://instagram.com/saakshisunil" },
  { label: "LinkedIn: https://www.linkedin.com/in/saakshi-sunil-a73114220/", href: "https://www.linkedin.com/in/saakshi-sunil-a73114220/" }
];

export function Contact() {
  return (
    <section id="contact" className="contact-foil grain relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 py-28 text-center">
      <div className="absolute inset-0 bg-[#f1f0ea]/48" />
      <p className="section-heading-label relative z-10 mb-8">04 - Get in Touch</p>
      <h2 className="relative z-10 mb-16 font-editorial text-[clamp(3.2rem,8vw,7.2rem)] italic leading-none text-ink">
        Let&apos;s create something.
      </h2>
      <ul className="relative z-10 flex flex-wrap justify-center gap-10">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="border-b border-transparent pb-1 font-display text-[0.58rem] font-bold uppercase tracking-[0.22em] text-ink/75 transition hover:border-ink/35 hover:text-ink">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
