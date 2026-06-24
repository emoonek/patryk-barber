import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminBookingEditForm } from "@/modules/admin-bookings/components/admin-booking-edit-form";
import { AdminBookingStatusActions } from "@/modules/admin-bookings/components/admin-booking-status-actions";
import { actorTypeLabel, adminStatusLabel, customerName } from "@/modules/admin-bookings/admin-booking.format";
import {
  getAdminBookingDetails,
  listAdminServices,
} from "@/modules/admin-bookings/admin-booking.repository";
import { requireAdmin } from "@/modules/auth/auth.guards";
import { formatDate, formatMoney, formatTime } from "@/modules/booking/booking.service";

export const metadata = {
  title: "Szczegoly rezerwacji",
};

type AdminBookingDetailsPageProps = {
  params: Promise<{
    bookingId: string;
  }>;
};

export default async function AdminBookingDetailsPage({ params }: AdminBookingDetailsPageProps) {
  await requireAdmin();
  const { bookingId } = await params;
  const [booking, services] = await Promise.all([getAdminBookingDetails(bookingId), listAdminServices()]);

  if (!booking) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Admin</p>
          <h1 className="text-4xl font-semibold text-barber-cream">Szczegoly rezerwacji</h1>
        </div>
        <Link
          className="w-fit border border-white/15 px-5 py-3 text-sm font-semibold text-barber-cream transition hover:border-barber-brass"
          href="/admin/rezerwacje"
        >
          Wroc do listy
        </Link>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="grid gap-4 border border-white/10 bg-black/20 p-6 text-sm text-barber-muted">
          <h2 className="text-2xl font-semibold text-barber-cream">Dane klienta</h2>
          <p>
            <span className="text-barber-cream">Klient:</span> {customerName(booking.customer)}
          </p>
          <p>
            <span className="text-barber-cream">Email:</span> {booking.customer.email}
          </p>
          <p>
            <span className="text-barber-cream">Telefon:</span> {booking.customer.phone ?? "-"}
          </p>
        </section>

        <section className="grid gap-4 border border-white/10 bg-black/20 p-6 text-sm text-barber-muted">
          <h2 className="text-2xl font-semibold text-barber-cream">Dane wizyty</h2>
          <p>
            <span className="text-barber-cream">Usluga:</span> {booking.service.name}
          </p>
          <p>
            <span className="text-barber-cream">Cena:</span> {formatMoney(booking.service.priceCents)}
          </p>
          <p>
            <span className="text-barber-cream">Termin:</span> {formatDate(booking.startAt)},{" "}
            {formatTime(booking.startAt)} - {formatTime(booking.endAt)}
          </p>
          <p>
            <span className="text-barber-cream">Status:</span> {adminStatusLabel(booking.status)}
          </p>
          <p>
            <span className="text-barber-cream">activeSlotKey:</span> {booking.activeSlotKey ?? "null"}
          </p>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {booking.customerMessage ? (
          <section className="border border-white/10 bg-black/20 p-6 text-sm text-barber-muted">
            <h2 className="mb-3 text-2xl font-semibold text-barber-cream">Notatka klienta</h2>
            <p>{booking.customerMessage}</p>
          </section>
        ) : null}
        {booking.adminNote ? (
          <section className="border border-white/10 bg-black/20 p-6 text-sm text-barber-muted">
            <h2 className="mb-3 text-2xl font-semibold text-barber-cream">Notatka admina</h2>
            <p>{booking.adminNote}</p>
          </section>
        ) : null}
      </div>

      <div className="mt-8 grid gap-6">
        <AdminBookingEditForm booking={booking} services={services} />
        <AdminBookingStatusActions bookingId={booking.id} currentStatus={booking.status} />
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold text-barber-cream">Historia statusow</h2>
        <div className="grid gap-3">
          {booking.statusHistory.length > 0 ? (
            booking.statusHistory.map((entry) => (
              <div className="border border-white/10 bg-black/20 p-5 text-sm text-barber-muted" key={entry.id}>
                <p className="font-medium text-barber-cream">
                  {entry.fromStatus ? adminStatusLabel(entry.fromStatus) : "start"} {"->"}{" "}
                  {adminStatusLabel(entry.toStatus)}
                </p>
                <p>
                  {formatDate(entry.createdAt)}, {formatTime(entry.createdAt)} · {actorTypeLabel(entry.actorType)}
                  {entry.actorUser ? ` (${customerName(entry.actorUser)})` : ""}
                </p>
                {entry.reason ? <p className="mt-2">{entry.reason}</p> : null}
              </div>
            ))
          ) : (
            <p className="border border-white/10 bg-black/20 p-5 text-sm text-barber-muted">
              Brak historii statusow.
            </p>
          )}
        </div>
      </section>
    </section>
  );
}
