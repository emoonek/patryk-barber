"use client";

import { useActionState } from "react";
import { DEFAULT_SLOT_TIMES, formatDate, formatTime, todayInputValue } from "@/modules/booking/booking.service";
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

  return (
    <div className="grid gap-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <form action={dayAction} className="grid gap-4 border border-white/10 bg-black/20 p-6">
          <h2 className="text-2xl font-semibold text-barber-cream">Zablokuj caly dzien</h2>
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
            Powod
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
              Zablokuj dzien
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
                defaultValue={todayInputValue()}
                min={todayInputValue()}
                name="date"
                type="date"
              />
            </label>
            <label className="grid gap-2 text-sm text-barber-muted">
              Godzina
              <select className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream" name="time">
                {DEFAULT_SLOT_TIMES.map((time) => (
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
            Powod
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
                  <p>{exception.reason ?? "Bez powodu"}</p>
                </div>
                <p>
                  Koniec: {formatDate(exception.endsAt)}, {formatTime(exception.endsAt)}
                </p>
                <form action={deleteAvailabilityExceptionAction}>
                  <input name="exceptionId" type="hidden" value={exception.id} />
                  <button className="border border-red-300/40 px-4 py-2 font-semibold text-red-100 transition hover:bg-red-950/40">
                    Usun blokade
                  </button>
                </form>
              </div>
            ))
          ) : (
            <p className="border border-white/10 bg-black/20 p-5 text-sm text-barber-muted">
              Nie ma jeszcze blokad dostepnosci.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
