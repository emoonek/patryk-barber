import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminCustomerBlockForm } from "@/modules/admin-customers/components/admin-customer-block-form";
import { AdminCustomerEditForm } from "@/modules/admin-customers/components/admin-customer-edit-form";
import { AdminCustomerNoteForm } from "@/modules/admin-customers/components/admin-customer-note-form";
import { adminDeleteCustomerNoteAction } from "@/modules/admin-customers/admin-customer.actions";
import {
  activityLabel,
  bookingStatusLabel,
  customerDisplayName,
  emailVerificationLabel,
  roleLabel,
} from "@/modules/admin-customers/admin-customer.format";
import { getAdminCustomerDetails } from "@/modules/admin-customers/admin-customer.repository";
import { requireAdmin } from "@/modules/auth/auth.guards";
import { formatDate, formatMoney, formatTime } from "@/modules/booking/booking.service";

export const metadata = {
  title: "Szczegoly klienta",
};

type AdminCustomerDetailsPageProps = {
  params: Promise<{
    clientId: string;
  }>;
};

export default async function AdminCustomerDetailsPage({ params }: AdminCustomerDetailsPageProps) {
  await requireAdmin();
  const { clientId } = await params;
  const customer = await getAdminCustomerDetails(clientId);

  if (!customer) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Admin</p>
          <h1 className="text-4xl font-semibold text-barber-cream">{customerDisplayName(customer)}</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="border border-white/15 px-5 py-3 text-sm font-semibold text-barber-cream transition hover:border-barber-brass"
            href="/admin/klienci"
          >
            Wroc do klientow
          </Link>
          <Link
            className="border border-white/15 px-5 py-3 text-sm font-semibold text-barber-cream transition hover:border-barber-brass"
            href="/admin/rezerwacje/nowa"
          >
            Nowa rezerwacja
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="grid gap-3 border border-white/10 bg-black/20 p-6 text-sm text-barber-muted">
          <h2 className="text-2xl font-semibold text-barber-cream">Dane klienta</h2>
          <p>
            <span className="text-barber-cream">Email:</span> {customer.email}
          </p>
          <p>
            <span className="text-barber-cream">Telefon:</span> {customer.phone ?? "-"}
          </p>
          <p>
            <span className="text-barber-cream">Rola:</span> {roleLabel(customer.role)}
          </p>
          <p>
            <span className="text-barber-cream">Email:</span> {emailVerificationLabel(customer.emailVerifiedAt)}
          </p>
          <p>
            <span className="text-barber-cream">Status:</span> {activityLabel(customer)}
          </p>
          {customer.isBlocked ? (
            <>
              <p>
                <span className="text-barber-cream">Powod blokady:</span> {customer.blockedReason ?? "-"}
              </p>
              <p>
                <span className="text-barber-cream">Data blokady:</span>{" "}
                {customer.blockedAt ? `${formatDate(customer.blockedAt)}, ${formatTime(customer.blockedAt)}` : "-"}
              </p>
            </>
          ) : null}
          <p>
            <span className="text-barber-cream">Utworzono:</span> {formatDate(customer.createdAt)}
          </p>
          <p>
            <span className="text-barber-cream">Ostatnie logowanie:</span>{" "}
            {customer.lastLoginAt ? `${formatDate(customer.lastLoginAt)}, ${formatTime(customer.lastLoginAt)}` : "-"}
          </p>
        </section>

        <section className="grid gap-3 border border-white/10 bg-black/20 p-6 text-sm text-barber-muted">
          <h2 className="text-2xl font-semibold text-barber-cream">Podsumowanie</h2>
          <p>
            <span className="text-barber-cream">Wszystkie rezerwacje:</span> {customer._count.bookings}
          </p>
          <p>
            <span className="text-barber-cream">Nadchodzace:</span> {customer.upcomingBookings.length}
          </p>
          <p>
            <span className="text-barber-cream">Historia:</span> {customer.bookingHistory.length}
          </p>
          <p>
            <span className="text-barber-cream">Notatki admina:</span> {customer.customerNotes.length}
          </p>
        </section>
      </div>

      <div className="mt-8 grid gap-6">
        <AdminCustomerEditForm customer={customer} />
        <AdminCustomerBlockForm customer={customer} />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold text-barber-cream">Nadchodzace rezerwacje</h2>
        <BookingList bookings={customer.upcomingBookings} emptyText="Brak nadchodzacych rezerwacji." />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold text-barber-cream">Historia wizyt</h2>
        <BookingList bookings={customer.bookingHistory} emptyText="Brak historii wizyt." />
      </section>

      <section className="mt-10 grid gap-6">
        <AdminCustomerNoteForm clientId={customer.id} />
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-barber-cream">Notatki admina</h2>
          <div className="grid gap-3">
            {customer.customerNotes.length > 0 ? (
              customer.customerNotes.map((note) => (
                <article className="border border-white/10 bg-black/20 p-5 text-sm text-barber-muted" key={note.id}>
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-barber-cream">{note.content}</p>
                      <p className="mt-3">
                        {note.author ? customerDisplayName(note.author) : "System"} - {formatDate(note.createdAt)},{" "}
                        {formatTime(note.createdAt)}
                      </p>
                    </div>
                    <form action={adminDeleteCustomerNoteAction}>
                      <input name="clientId" type="hidden" value={customer.id} />
                      <input name="noteId" type="hidden" value={note.id} />
                      <button className="text-sm font-semibold text-red-300">Usun</button>
                    </form>
                  </div>
                </article>
              ))
            ) : (
              <p className="border border-white/10 bg-black/20 p-5 text-sm text-barber-muted">
                Brak notatek o kliencie.
              </p>
            )}
          </div>
        </div>
      </section>
    </section>
  );
}

type CustomerBooking = {
  id: string;
  status: Parameters<typeof bookingStatusLabel>[0];
  startAt: Date;
  endAt: Date;
  serviceNameSnapshot: string;
  servicePriceCentsSnapshot: number;
  serviceDurationMinutesSnapshot: number;
};

function BookingList({ bookings, emptyText }: { bookings: CustomerBooking[]; emptyText: string }) {
  if (bookings.length === 0) {
    return <p className="border border-white/10 bg-black/20 p-5 text-sm text-barber-muted">{emptyText}</p>;
  }

  return (
    <div className="grid gap-3">
      {bookings.map((booking) => (
        <Link
          className="grid gap-3 border border-white/10 bg-black/20 p-5 text-sm text-barber-muted transition hover:border-barber-brass md:grid-cols-[1fr_1fr_1fr_auto] md:items-center"
          href={`/admin/rezerwacje/${booking.id}`}
          key={booking.id}
        >
          <p className="font-medium text-barber-cream">
            {formatDate(booking.startAt)}, {formatTime(booking.startAt)} - {formatTime(booking.endAt)}
          </p>
          <p>{booking.serviceNameSnapshot}</p>
          <p>
            {formatMoney(booking.servicePriceCentsSnapshot)} / {booking.serviceDurationMinutesSnapshot} min
          </p>
          <p>{bookingStatusLabel(booking.status)}</p>
        </Link>
      ))}
    </div>
  );
}
