"use client";

import { useActionState } from "react";
import { forgotPasswordAction, type AuthActionState } from "../auth.actions";
import { AuthFieldError } from "./auth-field-error";

const initialState: AuthActionState = {};

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, initialState);

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      <label className="grid gap-2 text-sm text-barber-muted">
        Email
        <input className="border border-white/10 bg-white/5 px-4 py-3 text-barber-cream" name="email" type="email" />
        <AuthFieldError errors={state.errors?.email} />
      </label>

      {state.message ? (
        <p className={state.ok ? "text-sm text-green-300" : "text-sm text-red-300"}>{state.message}</p>
      ) : null}

      <button
        className="bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Generuję link..." : "Wyślij link resetu"}
      </button>
    </form>
  );
}
