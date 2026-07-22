"use client";

import { useActionState, useEffect, useState } from "react";
import { formatDate, formatTime, todayInputValue } from "@/modules/booking/booking.format";
import { getBookableSlotStartsForDate, type BookingSlotStart } from "@/modules/booking/opening-hours";
import {
  blockFullDayAction,
  blockSingleSlotAction,
  deleteAvailabilityExceptionAction,
  type AdminActionState,
} from "../admin-booking.actions";
import { AdminActionMessage } from "./admin-action-message";

type ServiceOption = {
  id: string;
  name: string;
  durationMinutes: number;
};

type AvailabilityExceptionItem = {
  id: string;
  startsAt: Date;
  endsAt: Date;
  reason: string | null;
};

type AdminAvailabilityManagerProps = {
  exceptions: AvailabilityExceptionItem[];
  services: ServiceOption[];
};

const initialState: AdminActionState = {};

export function AdminAvailabilityManager({ exceptions, services }: AdminAvailabilityManagerProps) {
  const [dayState, dayAction, dayPending] = useActionState(blockFullDayAction, initialState);
  const [slotState, slotAction, slotPending] = useActionState(blockSingleSlotAction, initialState);
  const [slotDate, setSlotDate] = useState(todayInputValue());
  const slotTimes = getBookableSlotStartsForDate(slotDate);
  const [slotTime, setSlotTime] = useState<string>(slotTimes[0] ?? "");

  useEffect(() => {
    if (!slotTimes.includes(slotTime as BookingSlotStart)) {
      setSlotTime(slotTimes[0] ?? "");
    }
  }, [slotTime, slotTimes]);

  return (
    <div className="grid gap-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <form action={dayAction} className="grid gap-4 border border-white/10 bg-black/20 p-6">
          <h2 className="text-2xl font-semibold text-barber-cream">Zablokuj cały dzień</h2>
          <label className="grid gap-2 text-sm text-barber-muted">
            Data
            <input
              className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
              defaultValue={todayInputValue()}
              min={todayInputValue()}
              name="date"
              type="date"
            />
            {dayState.errors?.date ? <span className="text-red-300">{dayState.errors.date[0]}</span> : null}
          </label>
          <label className="grid gap-2 text-sm text-barber-muted">
            Powód
            <input
              className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
              name="reason"
              placeholder="Opcjonalnie"
            />
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <button
              className="bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream disabled:opacity-60"
              disabled={dayPending}
            >
              Zablokuj dzień
            </button>
            <AdminActionMessage state={dayState} />
          </div>
        </form>

        <form action={slotAction} className="grid gap-4 border border-white/10 bg-black/20 p-6">
          <h2 className="text-2xl font-semibold text-barber-cream">Zablokuj pojedynczy slot</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-barber-muted">
              Data
              <input
                className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
                min={todayInputValue()}
                name="date"
                onChange={(event) => setSlotDate(event.target.value)}
                type="date"
                value={slotDate}
              />
            </label>
            <label className="grid gap-2 text-sm text-barber-muted">
              Godzina
              <select
                className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
                name="time"
                onChange={(event) => setSlotTime(event.target.value)}
                value={slotTime}
              >
                {slotTimes.length === 0 ? <option value="">Salon nieczynny</option> : null}
                {slotTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="grid gap-2 text-sm text-barber-muted">
            Usluga
            <select className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream" name="serviceId">
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} / {service.durationMinutes} min
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm text-barber-muted">
            Powód
            <input
              className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
              name="reason"
              placeholder="Opcjonalnie"
            />
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <button
              className="bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream disabled:opacity-60"
              disabled={slotPending}
            >
              Zablokuj slot
            </button>
            <AdminActionMessage state={slotState} />
          </div>
        </form>
      </div>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-barber-cream">Aktywne blokady</h2>
        <div className="grid gap-3">
          {exceptions.length > 0 ? (
            exceptions.map((exception) => (
              <div
                className="grid gap-4 border border-white/10 bg-black/20 p-5 text-sm text-barber-muted md:grid-cols-[1.4fr_1fr_auto] md:items-center"
                key={exception.id}
              >
                <div>
                  <p className="font-medium text-barber-cream">
                    {formatDate(exception.startsAt)}, {formatTime(exception.startsAt)} - {formatTime(exception.endsAt)}
                  </p>
                  <p>{exception.reason ?? "Bez podanego powodu"}</p>
                </div>
                <p>
                  Koniec: {formatDate(exception.endsAt)}, {formatTime(exception.endsAt)}
                </p>
                <form action={deleteAvailabilityExceptionAction}>
                  <input name="exceptionId" type="hidden" value={exception.id} />
                  <button className="border border-red-300/40 px-4 py-2 font-semibold text-red-100 transition hover:bg-red-950/40">
                    Usuń blokadę
                  </button>
                </form>
              </div>
            ))
          ) : (
            <p className="border border-white/10 bg-black/20 p-5 text-sm text-barber-muted">
              Brak blokad dostępności. Aktualnie wszystkie wolne sloty mogą być widoczne dla klientów.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
