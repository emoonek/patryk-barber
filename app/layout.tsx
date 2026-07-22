import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Patryk Barber",
    template: "%s | Patryk Barber",
  },
  description: "Premium barber shop w Pieckach. Rezerwacje, konto klienta i panel admina.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className="font-sans antialiased">
        <div className="min-h-screen">
          <header className="sticky top-0 z-50 border-b border-barber-chrome/14 bg-[#030507]/72 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between md:px-10">
              <Link className="text-base font-black uppercase tracking-wide text-barber-frost md:text-lg" href="/">
                Pat Barber
              </Link>
              <div className="flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-barber-silver sm:justify-end md:gap-4 md:text-xs">
                <Link className="px-1 py-2 transition hover:text-barber-frost" href="/">
                  Strona główna
                </Link>
                <Link className="px-1 py-2 transition hover:text-barber-frost" href="/galeria">
                  Galeria
                </Link>
                <Link className="px-1 py-2 transition hover:text-barber-frost" href="/kontakt">
                  Kontakt
                </Link>
                <Link className="px-1 py-2 transition hover:text-barber-frost" href="/regulamin-rezerwacji">
                  Regulamin
                </Link>
                <Link
                  className="chrome-button ml-1 min-h-11 px-3 py-2 font-black md:px-4"
                  href="/rezerwacja"
                >
                  Rezerwacja
                </Link>
              </div>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
