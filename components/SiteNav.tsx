const links = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#gateway" },
  { label: "Archive", href: "#archive" },
  { label: "Contact", href: "#contact" }
];

export function SiteNav() {
  return (
    <nav className="site-nav">
      <a href="#hero" className="nav-logo">
        Saakshi Sunil
      </a>
      <ul className="nav-links">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
