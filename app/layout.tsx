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
          <header className="border-b border-white/10 bg-black/20">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link className="text-lg font-semibold tracking-wide text-barber-cream" href="/">
                Patryk Barber
              </Link>
              <div className="flex items-center gap-4 text-sm text-barber-muted">
                <Link className="transition hover:text-barber-cream" href="/logowanie">
                  Logowanie
                </Link>
                <Link className="transition hover:text-barber-cream" href="/rejestracja">
                  Rejestracja
                </Link>
                <Link className="transition hover:text-barber-cream" href="/konto">
                  Konto
                </Link>
                <Link className="transition hover:text-barber-cream" href="/admin">
                  Admin
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
