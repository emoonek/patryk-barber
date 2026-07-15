"use client";

import { useActionState } from "react";
import { createBookingAction, type BookingActionState } from "../booking.actions";
import type { AvailableSlot } from "../booking.format";

type BookingFormProps = {
  serviceId: string;
  date: string;
  slots: AvailableSlot[];
};

const initialState: BookingActionState = {};

export function BookingForm({ serviceId, date, slots }: BookingFormProps) {
  const [state, formAction, pending] = useActionState(createBookingAction, initialState);

  if (slots.length === 0) {
    return (
      <div className="border border-white/10 bg-black/20 p-6 text-sm text-barber-muted">
        Brak dostępnych slotów dla wybranej daty.
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-4">
      <input name="serviceId" type="hidden" value={serviceId} />
      <input name="date" type="hidden" value={date} />

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {slots.map((slot) => (
          <button
            className="border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-barber-cream transition hover:border-barber-brass hover:bg-barber-brass hover:text-black disabled:opacity-60"
            disabled={pending}
            key={slot.time}
            name="time"
            type="submit"
            value={slot.time}
          >
            {slot.time}
          </button>
        ))}
      </div>

      {state.message ? (
        <p className={state.ok ? "text-sm text-green-300" : "text-sm text-red-300"}>{state.message}</p>
      ) : null}
    </form>
  );
}
