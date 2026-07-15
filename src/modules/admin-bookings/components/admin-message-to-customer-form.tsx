"use client";

import { useActionState } from "react";
import { adminMessageToCustomerAction, type AdminActionState } from "../admin-booking.actions";
import { AdminActionMessage } from "./admin-action-message";

type AdminMessageToCustomerFormProps = {
  bookingId: string;
};

const initialState: AdminActionState = {};

export function AdminMessageToCustomerForm({ bookingId }: AdminMessageToCustomerFormProps) {
  const [state, formAction, pending] = useActionState(adminMessageToCustomerAction, initialState);

  return (
    <form action={formAction} className="grid gap-4 border border-white/10 bg-black/20 p-6">
      <input name="bookingId" type="hidden" value={bookingId} />
      <h2 className="text-2xl font-semibold text-barber-cream">Wiadomosc do klienta</h2>

      <label className="grid gap-2 text-sm text-barber-muted">
        Temat
        <input
          className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
          name="subject"
          placeholder="Np. Informacja o wizycie"
        />
        {state.errors?.subject ? <span className="text-red-300">{state.errors.subject[0]}</span> : null}
      </label>

      <label className="grid gap-2 text-sm text-barber-muted">
        Tresc wiadomosci
        <textarea
          className="min-h-36 border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
          name="message"
          placeholder="Wpisz wiadomosc dla klienta..."
        />
        {state.errors?.message ? <span className="text-red-300">{state.errors.message[0]}</span> : null}
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          className="bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream disabled:opacity-60"
          disabled={pending}
          type="submit"
        >
          {pending ? "Wysylam..." : "Wyslij wiadomosc"}
        </button>
        <AdminActionMessage state={state} />
      </div>
    </form>
  );
}
