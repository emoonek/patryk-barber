import { BookingStatus } from "@prisma/client";
import Link from "next/link";
import { AdminNav } from "@/modules/admin/components/admin-nav";
import { adminBookingFiltersSchema } from "@/modules/admin-bookings/admin-booking.schemas";
import { adminStatusLabel, customerName } from "@/modules/admin-bookings/admin-booking.format";
import { listAdminBookings } from "@/modules/admin-bookings/admin-booking.repository";
import { requireAdmin } from "@/modules/auth/auth.guards";
import { formatDate, formatMoney, formatTime } from "@/modules/booking/booking.format";

export const metadata = {
  title: "Rezerwacje admin",
};

type AdminBookingsPageProps = {
  searchParams?: Promise<{
    date?: string;
    status?: string;
  }>;
};

export default async function AdminBookingsPage({ searchParams }: AdminBookingsPageProps) {
  await requireAdmin();
  const params = (await searchParams) ?? {};
  const parsedFilters = adminBookingFiltersSchema.safeParse({
    date: params.date ?? "",
    status: params.status ?? "all",
  });
  const filters = parsedFilters.success ? parsedFilters.data : { date: "", status: "all" as const };
  const bookings = await listAdminBookings(filters);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Admin</p>
          <h1 className="text-4xl font-semibold text-barber-cream">Rezerwacje</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <AdminNav />
          <Link
            className="bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream"
            href="/admin/rezerwacje/nowa"
          >
            Nowa rezerwacja
          </Link>
        </div>
      </div>

      <form className="mt-10 grid gap-4 border border-white/10 bg-black/20 p-6 md:grid-cols-[220px_260px_auto]" method="get">
        <label className="grid gap-2 text-sm text-barber-muted">
          Data
          <input
            className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
            defaultValue={filters.date}
            name="date"
            type="date"
          />
        </label>
        <label className="grid gap-2 text-sm text-barber-muted">
          Status
          <select
            className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
            defaultValue={filters.status}
            name="status"
          >
            <option value="all">wszystkie</option>
            {Object.values(BookingStatus).map((status) => (
              <option key={status} value={status}>
                {adminStatusLabel(status)}
              </option>
            ))}
          </select>
        </label>
        <button className="self-end bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream">
          Filtruj
        </button>
      </form>

      <div className="mt-8 overflow-x-auto border border-white/10 bg-black/20">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead className="text-barber-muted">
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Godzina</th>
              <th className="px-4 py-3 font-medium">Klient</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Telefon</th>
              <th className="px-4 py-3 font-medium">Usługa</th>
              <th className="px-4 py-3 font-medium">Cena</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Akcja</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr className="border-b border-white/10 text-barber-muted last:border-0" key={booking.id}>
                <td className="px-4 py-3 text-barber-cream">{formatDate(booking.startAt)}</td>
                <td className="px-4 py-3">{formatTime(booking.startAt)}</td>
                <td className="px-4 py-3">{customerName(booking.customer)}</td>
                <td className="px-4 py-3">{booking.customer.email}</td>
                <td className="px-4 py-3">{booking.customer.phone ?? "-"}</td>
                <td className="px-4 py-3">
                  {booking.serviceNameSnapshot} / {booking.serviceDurationMinutesSnapshot} min
                </td>
                <td className="px-4 py-3">{formatMoney(booking.servicePriceCentsSnapshot)}</td>
                <td className="px-4 py-3">{adminStatusLabel(booking.status)}</td>
                <td className="px-4 py-3">
                  <Link className="font-semibold text-barber-brass" href={`/admin/rezerwacje/${booking.id}`}>
                    Szczegóły
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 ? (
          <p className="p-5 text-sm text-barber-muted">
            Brak rezerwacji dla wybranych filtrów. Zmień filtr albo dodaj rezerwację manualnie.
          </p>
        ) : null}
      </div>
    </section>
  );
}
