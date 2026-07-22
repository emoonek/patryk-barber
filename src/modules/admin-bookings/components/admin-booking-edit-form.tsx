"use client";

import { useActionState, useEffect, useState } from "react";
import { formatMoney } from "@/modules/booking/booking.format";
import { getBookableSlotStartsForDate, type BookingSlotStart } from "@/modules/booking/opening-hours";
import { adminUpdateBookingAction, type AdminActionState } from "../admin-booking.actions";
import { inputDateValue, inputTimeValue } from "../admin-booking.format";
import { AdminActionMessage } from "./admin-action-message";

type ServiceOption = {
  id: string;
  name: string;
  priceCents: number;
  durationMinutes: number;
};

type AdminBookingEditFormProps = {
  booking: {
    id: string;
    startAt: Date;
    service: {
      id: string;
    };
  };
  services: ServiceOption[];
};

const initialState: AdminActionState = {};

export function AdminBookingEditForm({ booking, services }: AdminBookingEditFormProps) {
  const [state, formAction, pending] = useActionState(adminUpdateBookingAction, initialState);
  const initialDate = inputDateValue(booking.startAt);
  const initialTime = inputTimeValue(booking.startAt);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const slotTimes = getBookableSlotStartsForDate(selectedDate);
  const [selectedTime, setSelectedTime] = useState(() =>
    slotTimes.includes(initialTime as BookingSlotStart) ? initialTime : (slotTimes[0] ?? ""),
  );

  useEffect(() => {
    if (!slotTimes.includes(selectedTime as BookingSlotStart)) {
      setSelectedTime(slotTimes[0] ?? "");
    }
  }, [selectedTime, slotTimes]);

  return (
    <form action={formAction} className="grid gap-4 border border-white/10 bg-black/20 p-6">
      <input name="bookingId" type="hidden" value={booking.id} />
      <h2 className="text-2xl font-semibold text-barber-cream">Edycja rezerwacji</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm text-barber-muted">
          Usluga
          <select
            className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
            defaultValue={booking.service.id}
            name="serviceId"
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - {formatMoney(service.priceCents)} / {service.durationMinutes} min
              </option>
            ))}
          </select>
          {state.errors?.serviceId ? <span className="text-red-300">{state.errors.serviceId[0]}</span> : null}
        </label>

        <label className="grid gap-2 text-sm text-barber-muted">
          Data
          <input
            className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
            name="date"
            onChange={(event) => setSelectedDate(event.target.value)}
            type="date"
            value={selectedDate}
          />
          {state.errors?.date ? <span className="text-red-300">{state.errors.date[0]}</span> : null}
        </label>

        <label className="grid gap-2 text-sm text-barber-muted">
          Godzina
          <select
            className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
            name="time"
            onChange={(event) => setSelectedTime(event.target.value)}
            value={selectedTime}
          >
            {slotTimes.length === 0 ? <option value="">Salon nieczynny</option> : null}
            {slotTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {state.errors?.time ? <span className="text-red-300">{state.errors.time[0]}</span> : null}
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          className="bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream disabled:opacity-60"
          disabled={pending}
        >
          Zapisz zmiany
        </button>
        <AdminActionMessage state={state} />
      </div>
    </form>
  );
}
