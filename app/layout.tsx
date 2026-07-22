import type { Metadata } from "next";
import Link from "next/link";
import { PublicSessionNav } from "@/modules/auth/components/public-session-nav";
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
              <PublicSessionNav />
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
