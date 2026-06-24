"use client";

import { useActionState } from "react";
import { adminCreateCustomerNoteAction, type AdminCustomerActionState } from "../admin-customer.actions";

type AdminCustomerNoteFormProps = {
  clientId: string;
};

const initialState: AdminCustomerActionState = {};

export function AdminCustomerNoteForm({ clientId }: AdminCustomerNoteFormProps) {
  const [state, formAction, pending] = useActionState(adminCreateCustomerNoteAction, initialState);

  return (
    <form action={formAction} className="grid gap-4 border border-white/10 bg-black/20 p-6">
      <input name="clientId" type="hidden" value={clientId} />
      <h2 className="text-2xl font-semibold text-barber-cream">Nowa notatka</h2>
      <label className="grid gap-2 text-sm text-barber-muted">
        Tresc
        <textarea
          className="min-h-32 border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
          name="content"
          placeholder="Wpisz notatke o kliencie"
        />
        {state.errors?.content ? <span className="text-red-300">{state.errors.content[0]}</span> : null}
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button
          className="w-fit bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream disabled:opacity-60"
          disabled={pending}
        >
          Dodaj notatke
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
