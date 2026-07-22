import Link from "next/link";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/rezerwacje", label: "Rezerwacje" },
  { href: "/admin/kalendarz", label: "Kalendarz" },
  { href: "/admin/klienci", label: "Klienci" },
  { href: "/admin/uslugi", label: "Usługi" },
  { href: "/admin/galeria", label: "Galeria" },
  { href: "/admin/dostepnosc", label: "Dostępność" },
  { href: "/admin/email-test", label: "Test email" },
];

export function AdminNav() {
  return (
    <nav className="flex flex-wrap gap-3">
      {adminLinks.map((link) => (
        <Link
          className="border border-white/15 px-4 py-2 text-sm font-semibold text-barber-cream transition hover:border-barber-brass"
          href={link.href}
          key={link.href}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
