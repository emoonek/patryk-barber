"use client";

import { useActionState } from "react";
import {
  adminBlockCustomerAction,
  adminUnblockCustomerAction,
  type AdminCustomerActionState,
} from "../admin-customer.actions";

type AdminCustomerBlockFormProps = {
  customer: {
    id: string;
    isBlocked: boolean;
    blockedReason: string | null;
  };
};

const initialState: AdminCustomerActionState = {};

export function AdminCustomerBlockForm({ customer }: AdminCustomerBlockFormProps) {
  const [state, formAction, pending] = useActionState(adminBlockCustomerAction, initialState);

  if (customer.isBlocked) {
    return (
      <form action={adminUnblockCustomerAction} className="grid gap-4 border border-white/10 bg-black/20 p-6">
        <input name="clientId" type="hidden" value={customer.id} />
        <h2 className="text-2xl font-semibold text-barber-cream">Blokada klienta</h2>
        <p className="text-sm text-barber-muted">
          Klient jest zablokowany i nie moze tworzyc nowych rezerwacji.
        </p>
        {customer.blockedReason ? (
          <p className="text-sm text-barber-muted">
            <span className="text-barber-cream">Powod:</span> {customer.blockedReason}
          </p>
        ) : null}
        <button className="w-fit bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream">
          Odblokuj klienta
        </button>
      </form>
    );
  }

  return (
    <form action={formAction} className="grid gap-4 border border-white/10 bg-black/20 p-6">
      <input name="clientId" type="hidden" value={customer.id} />
      <h2 className="text-2xl font-semibold text-barber-cream">Blokada klienta</h2>
      <label className="grid gap-2 text-sm text-barber-muted">
        Powod blokady
        <textarea
          className="min-h-28 border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
          name="reason"
          placeholder="Opcjonalny powod widoczny w notatkach admina"
        />
        {state.errors?.reason ? <span className="text-red-300">{state.errors.reason[0]}</span> : null}
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button
          className="w-fit border border-red-400/50 px-5 py-3 text-sm font-semibold text-red-200 transition hover:border-red-200 disabled:opacity-60"
          disabled={pending}
        >
          Zablokuj klienta
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
