import Link from "next/link";
import { getAdminDashboardStats } from "@/modules/admin-bookings/admin-booking.repository";
import { customerName } from "@/modules/admin-bookings/admin-booking.format";
import { requireAdmin } from "@/modules/auth/auth.guards";
import { formatDate, formatMoney, formatTime } from "@/modules/booking/booking.service";

export const metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  const user = await requireAdmin();
  const stats = await getAdminDashboardStats();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Panel</p>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-barber-cream">Panel admina</h1>
          <p className="mt-5 max-w-2xl leading-7 text-barber-muted">
            Zalogowano jako administrator: {user.email}.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="border border-white/15 px-5 py-3 text-sm font-semibold text-barber-cream transition hover:border-barber-brass"
            href="/admin/rezerwacje"
          >
            Rezerwacje
          </Link>
          <Link
            className="border border-white/15 px-5 py-3 text-sm font-semibold text-barber-cream transition hover:border-barber-brass"
            href="/admin/dostepnosc"
          >
            Dostepnosc
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-barber-muted">Dzisiejsze rezerwacje</p>
          <p className="mt-3 text-4xl font-semibold text-barber-cream">{stats.todayBookingsCount}</p>
        </div>
        <div className="border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-barber-muted">Przyszle potwierdzone rezerwacje</p>
          <p className="mt-3 text-4xl font-semibold text-barber-cream">{stats.futureBookingsCount}</p>
        </div>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-barber-cream">Najblizsze rezerwacje</h2>
          <Link className="text-sm font-semibold text-barber-brass" href="/admin/rezerwacje/nowa">
            Dodaj manualnie
          </Link>
        </div>
        <div className="grid gap-3">
          {stats.upcomingBookings.length > 0 ? (
            stats.upcomingBookings.map((booking) => (
              <Link
                className="grid gap-3 border border-white/10 bg-black/20 p-5 text-sm text-barber-muted transition hover:border-barber-brass md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center"
                href={`/admin/rezerwacje/${booking.id}`}
                key={booking.id}
              >
                <div>
                  <p className="font-medium text-barber-cream">{customerName(booking.customer)}</p>
                  <p>{booking.customer.email}</p>
                </div>
                <p>
                  {formatDate(booking.startAt)}, {formatTime(booking.startAt)}
                </p>
                <p>
                  {booking.service.name} - {formatMoney(booking.service.priceCents)}
                </p>
                <span className="text-barber-brass">Szczegoly</span>
              </Link>
            ))
          ) : (
            <p className="border border-white/10 bg-black/20 p-5 text-sm text-barber-muted">
              Brak przyszlych potwierdzonych rezerwacji.
            </p>
          )}
        </div>
      </section>
    </section>
  );
}
