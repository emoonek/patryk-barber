import { BookingStatus } from "@prisma/client";
import { cancelBookingAction } from "../booking.actions";
import { formatDate, formatMoney, formatTime } from "../booking.service";

type AccountBooking = {
  id: string;
  status: BookingStatus;
  startAt: Date;
  serviceNameSnapshot: string;
  servicePriceCentsSnapshot: number;
  serviceDurationMinutesSnapshot: number;
};

type AccountBookingsProps = {
  upcoming: AccountBooking[];
  history: AccountBooking[];
};

function statusLabel(status: BookingStatus) {
  const labels: Record<BookingStatus, string> = {
    confirmed: "potwierdzona",
    cancelled_by_client: "anulowana przez klienta",
    cancelled_by_admin: "anulowana przez admina",
    completed: "zakończona",
    no_show: "nieobecność",
  };

  return labels[status];
}

function BookingRow({ booking, canCancel }: { booking: AccountBooking; canCancel: boolean }) {
  return (
    <div className="grid gap-4 border border-white/10 bg-black/20 p-5 text-sm text-barber-muted md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center">
      <div>
        <p className="font-medium text-barber-cream">{booking.serviceNameSnapshot}</p>
        <p>
          {formatDate(booking.startAt)}, {formatTime(booking.startAt)}
        </p>
      </div>
      <p>
        {formatMoney(booking.servicePriceCentsSnapshot)} / {booking.serviceDurationMinutesSnapshot} min
      </p>
      <p>{statusLabel(booking.status)}</p>
      {canCancel ? (
        <form action={cancelBookingAction}>
          <input name="bookingId" type="hidden" value={booking.id} />
          <button className="border border-red-300/40 px-4 py-2 font-semibold text-red-100 transition hover:bg-red-950/40">
            Anuluj
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function AccountBookings({ upcoming, history }: AccountBookingsProps) {
  return (
    <div className="mt-10 grid gap-10">
      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-barber-cream">Nadchodzące wizyty</h2>
        </div>
        <div className="grid gap-3">
          {upcoming.length > 0 ? (
            upcoming.map((booking) => <BookingRow booking={booking} canCancel key={booking.id} />)
          ) : (
            <p className="border border-white/10 bg-black/20 p-5 text-sm text-barber-muted">
              Nie masz nadchodzących wizyt.
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-barber-cream">Historia wizyt</h2>
        <div className="grid gap-3">
          {history.length > 0 ? (
            history.map((booking) => <BookingRow booking={booking} canCancel={false} key={booking.id} />)
          ) : (
            <p className="border border-white/10 bg-black/20 p-5 text-sm text-barber-muted">
              Historia wizyt jest jeszcze pusta.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
