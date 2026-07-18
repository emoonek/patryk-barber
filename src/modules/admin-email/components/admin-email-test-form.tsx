"use client";

import { useActionState } from "react";
import { adminSendTestEmailAction, type AdminEmailTestState } from "../admin-email.actions";

type AdminEmailTestFormProps = {
  adminEmail: string | null;
  provider: string;
};

const initialState: AdminEmailTestState = {};

export function AdminEmailTestForm({ adminEmail, provider }: AdminEmailTestFormProps) {
  const [state, formAction, pending] = useActionState(adminSendTestEmailAction, initialState);

  return (
    <form action={formAction} className="grid gap-5 border border-white/10 bg-black/20 p-6">
      <div>
        <h2 className="text-2xl font-semibold text-barber-cream">Wyślij testowego maila</h2>
        <p className="mt-2 text-sm leading-6 text-barber-muted">
          Aktualny provider: <span className="font-semibold text-barber-cream">{provider}</span>
        </p>
      </div>

      <label className="grid gap-2 text-sm text-barber-muted">
        Odbiorca
        <input
          className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
          name="to"
          placeholder={adminEmail ?? "admin@example.com"}
          type="email"
        />
        <span className="text-xs text-barber-muted">
          Puste pole wyśle test na ADMIN_EMAIL{adminEmail ? `: ${adminEmail}` : "."}
        </span>
        {state.errors?.to ? <span className="text-red-300">{state.errors.to[0]}</span> : null}
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          className="bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream disabled:opacity-60"
          disabled={pending}
          type="submit"
        >
          {pending ? "Wysyłam..." : "Wyślij test"}
        </button>
        {state.message ? (
          <p className={state.ok ? "text-sm text-green-300" : "text-sm text-red-300"}>{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
