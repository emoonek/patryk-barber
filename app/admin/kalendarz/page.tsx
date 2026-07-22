import Link from "next/link";
import type { ReactNode } from "react";
import { AdminNav } from "@/modules/admin/components/admin-nav";
import { adminStatusLabel, customerName } from "@/modules/admin-bookings/admin-booking.format";
import {
  listAdminCalendarBookings,
  listAvailabilityExceptionsInRange,
  toInputDate,
} from "@/modules/admin-bookings/admin-booking.repository";
import { requireAdmin } from "@/modules/auth/auth.guards";
import {
  addMinutes,
  dateTimeFromParts,
  formatDate,
  formatTime,
  rangesOverlap,
} from "@/modules/booking/booking.format";
import { BOOKING_SLOT_STARTS, isSlotWithinOpeningHours } from "@/modules/booking/opening-hours";

export const metadata = {
  title: "Kalendarz admin",
};

type AdminCalendarPageProps = {
  searchParams?: Promise<{
    week?: string;
  }>;
};

const dayLabels = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob"] as const;

export default async function AdminCalendarPage({ searchParams }: AdminCalendarPageProps) {
  await requireAdmin();
  const params = (await searchParams) ?? {};
  const today = new Date();
  const selectedDate = params.week && /^\d{4}-\d{2}-\d{2}$/.test(params.week)
    ? dateTimeFromParts(params.week, "00:00")
    : today;
  const weekStart = startOfWeek(selectedDate);
  const weekEnd = addMinutes(weekStart, 7 * 24 * 60);
  const days = Array.from({ length: 6 }, (_, index) => addMinutes(weekStart, index * 24 * 60));
  const [bookings, blocks] = await Promise.all([
    listAdminCalendarBookings(weekStart, weekEnd),
    listAvailabilityExceptionsInRange(weekStart, weekEnd),
  ]);
  const bookingsBySlot = new Map(bookings.map((booking) => [booking.startAt.getTime(), booking]));
  const previousWeek = addMinutes(weekStart, -7 * 24 * 60);
  const nextWeek = addMinutes(weekStart, 7 * 24 * 60);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Admin</p>
          <h1 className="text-4xl font-semibold text-barber-cream">Kalendarz tygodniowy</h1>
          <p className="mt-5 max-w-2xl leading-7 text-barber-muted">
            Widok od poniedziałku do soboty. Niedziela jest pominięta, bo salon jest zamknięty.
          </p>
        </div>
        <AdminNav />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <CalendarLink href={`/admin/kalendarz?week=${toInputDate(previousWeek)}`}>Poprzedni tydzień</CalendarLink>
        <CalendarLink href="/admin/kalendarz">Bieżący tydzień</CalendarLink>
        <CalendarLink href={`/admin/kalendarz?week=${toInputDate(nextWeek)}`}>Następny tydzień</CalendarLink>
        <p className="text-sm text-barber-muted">
          {formatDate(weekStart)} - {formatDate(addMinutes(days[5], 23 * 60 + 59))}
        </p>
      </div>

      {bookings.length === 0 && blocks.length === 0 ? (
        <div className="mt-6 border border-white/10 bg-black/20 p-5 text-sm leading-6 text-barber-muted">
          Ten tydzień nie ma jeszcze rezerwacji ani blokad. Wolne sloty poniżej prowadzą do manualnego dodania
          rezerwacji.
        </div>
      ) : null}

      <div className="mt-8 overflow-x-auto border border-white/10 bg-black/20">
        <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="w-24 px-4 py-3 font-medium text-barber-muted">Godzina</th>
              {days.map((day, index) => (
                <th className="px-4 py-3 font-medium text-barber-cream" key={day.toISOString()}>
                  {dayLabels[index]} {columnDate(day)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BOOKING_SLOT_STARTS.map((time) => (
              <tr className="border-b border-white/10 last:border-0" key={time}>
                <th className="px-4 py-3 align-top font-medium text-barber-cream">{time}</th>
                {days.map((day) => {
                  const date = toInputDate(day);
                  const slotStart = dateTimeFromParts(date, time);
                  const slotEnd = addMinutes(slotStart, 60);
                  const isOpenSlot = isSlotWithinOpeningHours(date, time);
                  const booking = bookingsBySlot.get(slotStart.getTime());
                  const block = blocks.find((item) => rangesOverlap(slotStart, slotEnd, item.startsAt, item.endsAt));

                  return (
                    <td className="h-36 min-w-[160px] p-2 align-top" key={`${date}-${time}`}>
                      {booking ? (
                        <Link
                          className="grid h-full content-start gap-2 border border-barber-brass/60 bg-barber-brass/15 p-3 text-barber-cream transition hover:bg-barber-brass/25"
                          href={`/admin/rezerwacje/${booking.id}`}
                        >
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-barber-brass">
                            {formatTime(booking.startAt)}
                          </span>
                          <span className="font-semibold">{customerName(booking.customer)}</span>
                          <span className="text-xs text-barber-muted">{booking.serviceNameSnapshot}</span>
                          <span className="text-xs text-barber-muted">{adminStatusLabel(booking.status)}</span>
                        </Link>
                      ) : block ? (
                        <div className="grid h-full content-start gap-2 border border-red-300/25 bg-red-950/20 p-3 text-red-100">
                          <span className="text-xs font-semibold uppercase tracking-[0.18em]">Zablokowane</span>
                          <span className="text-xs text-red-100/75">{block.reason ?? "Blokada dostępności"}</span>
                        </div>
                      ) : isOpenSlot ? (
                        <div className="grid h-full content-between border border-white/10 bg-white/[0.03] p-3 text-barber-muted">
                          <span>Wolny termin</span>
                          <Link
                            className="w-fit font-semibold text-barber-brass"
                            href={`/admin/rezerwacje/nowa?date=${date}&time=${time}`}
                          >
                            Dodaj
                          </Link>
                        </div>
                      ) : (
                        <div className="grid h-full content-center border border-white/5 bg-white/[0.02] p-3 text-center text-xs uppercase tracking-[0.16em] text-barber-muted/60">
                          Poza godzinami pracy
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CalendarLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      className="border border-white/15 px-4 py-2 text-sm font-semibold text-barber-cream transition hover:border-barber-brass"
      href={href}
    >
      {children}
    </Link>
  );
}

function startOfWeek(date: Date) {
  const start = new Date(date);
  const day = start.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + offset);
  start.setHours(0, 0, 0, 0);
  return start;
}

function columnDate(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}
