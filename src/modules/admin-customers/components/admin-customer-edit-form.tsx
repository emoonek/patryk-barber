"use client";

import { useActionState } from "react";
import { adminUpdateCustomerAction, type AdminCustomerActionState } from "../admin-customer.actions";

type AdminCustomerEditFormProps = {
  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
  };
};

const initialState: AdminCustomerActionState = {};

export function AdminCustomerEditForm({ customer }: AdminCustomerEditFormProps) {
  const [state, formAction, pending] = useActionState(adminUpdateCustomerAction, initialState);

  return (
    <form action={formAction} className="grid gap-4 border border-white/10 bg-black/20 p-6">
      <input name="clientId" type="hidden" value={customer.id} />
      <h2 className="text-2xl font-semibold text-barber-cream">Edycja danych</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm text-barber-muted">
          Imie
          <input
            className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
            defaultValue={customer.firstName ?? ""}
            name="firstName"
          />
          {state.errors?.firstName ? <span className="text-red-300">{state.errors.firstName[0]}</span> : null}
        </label>

        <label className="grid gap-2 text-sm text-barber-muted">
          Nazwisko
          <input
            className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
            defaultValue={customer.lastName ?? ""}
            name="lastName"
          />
          {state.errors?.lastName ? <span className="text-red-300">{state.errors.lastName[0]}</span> : null}
        </label>

        <label className="grid gap-2 text-sm text-barber-muted">
          Telefon
          <input
            className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
            defaultValue={customer.phone ?? ""}
            name="phone"
          />
          {state.errors?.phone ? <span className="text-red-300">{state.errors.phone[0]}</span> : null}
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          className="bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream disabled:opacity-60"
          disabled={pending}
        >
          Zapisz dane
        </button>
        <ActionMessage state={state} />
      </div>
    </form>
  );
}

function ActionMessage({ state }: { state: AdminCustomerActionState }) {
  if (!state.message) {
    return null;
  }

  return <p className={state.ok ? "text-sm text-green-300" : "text-sm text-red-300"}>{state.message}</p>;
}
