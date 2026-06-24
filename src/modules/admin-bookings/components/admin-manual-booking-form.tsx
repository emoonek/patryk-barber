"use client";

import { useActionState } from "react";
import { DEFAULT_SLOT_TIMES, formatMoney, todayInputValue } from "@/modules/booking/booking.service";
import { adminCreateBookingAction, type AdminActionState } from "../admin-booking.actions";
import { customerName } from "../admin-booking.format";
import { AdminActionMessage } from "./admin-action-message";

type CustomerOption = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
};

type ServiceOption = {
  id: string;
  name: string;
  priceCents: number;
  durationMinutes: number;
};

type AdminManualBookingFormProps = {
  customers: CustomerOption[];
  services: ServiceOption[];
};

const initialState: AdminActionState = {};

export function AdminManualBookingForm({ customers, services }: AdminManualBookingFormProps) {
  const [state, formAction, pending] = useActionState(adminCreateBookingAction, initialState);

  return (
    <form action={formAction} className="grid gap-5 border border-white/10 bg-black/20 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-barber-muted">
          Klient
          <select className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream" name="customerId">
            <option value="">Wybierz klienta</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customerName(customer)} - {customer.email}
              </option>
            ))}
          </select>
          {state.errors?.customerId ? <span className="text-red-300">{state.errors.customerId[0]}</span> : null}
        </label>

        <label className="grid gap-2 text-sm text-barber-muted">
          Usluga
          <select className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream" name="serviceId">
            <option value="">Wybierz usluge</option>
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
            defaultValue={todayInputValue()}
            min={todayInputValue()}
            name="date"
            type="date"
          />
          {state.errors?.date ? <span className="text-red-300">{state.errors.date[0]}</span> : null}
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
          {state.errors?.time ? <span className="text-red-300">{state.errors.time[0]}</span> : null}
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          className="bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream disabled:opacity-60"
          disabled={pending}
        >
          Utworz rezerwacje
        </button>
        <AdminActionMessage state={state} />
      </div>
    </form>
  );
}
