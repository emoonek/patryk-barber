import { UserRole } from "@prisma/client";
import Link from "next/link";
import { logoutAction } from "../auth.actions";
import { getCurrentUser } from "../auth.guards";

const baseLinks = [
  { href: "/", label: "Strona główna" },
  { href: "/galeria", label: "Galeria" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/regulamin-rezerwacji", label: "Regulamin" },
];

const textLinkClass = "px-1 py-2 transition hover:text-barber-frost";
const subtleButtonClass =
  "border border-barber-chrome/20 px-3 py-2 text-barber-frost transition hover:border-barber-brass hover:text-barber-cream";

export async function PublicSessionNav() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === UserRole.admin;

  return (
    <div className="flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-barber-silver sm:justify-end md:gap-4 md:text-xs">
      {baseLinks.map((link) => (
        <Link className={textLinkClass} href={link.href} key={link.href}>
          {link.label}
        </Link>
      ))}

      {user ? (
        isAdmin ? (
          <Link className={subtleButtonClass} href="/admin">
            Admin panel
          </Link>
        ) : (
          <Link className={textLinkClass} href="/konto">
            Konto
          </Link>
        )
      ) : (
        <Link className={textLinkClass} href="/logowanie">
          Logowanie
        </Link>
      )}

      <Link className="chrome-button ml-1 min-h-11 px-3 py-2 font-black md:px-4" href="/rezerwacja">
        Rezerwacja
      </Link>

      {user ? (
        <form action={logoutAction}>
          <button className={textLinkClass} type="submit">
            Wyloguj
          </button>
        </form>
      ) : null}
    </div>
  );
}
