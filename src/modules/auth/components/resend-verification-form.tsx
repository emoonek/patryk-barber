"use client";

import { useActionState } from "react";
import { resendVerificationEmailAction, type AuthActionState } from "../auth.actions";

const initialState: AuthActionState = {};

export function ResendVerificationForm() {
  const [state, formAction, pending] = useActionState(resendVerificationEmailAction, initialState);

  return (
    <form action={formAction} className="mt-4 grid gap-3 sm:flex sm:items-center">
      <button
        className="w-fit border border-red-200/40 px-4 py-2 text-sm font-semibold text-red-50 transition hover:bg-red-950/40 disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Wysyłam..." : "Wyślij link ponownie"}
      </button>
      {state.message ? (
        <p className={state.ok ? "text-sm text-green-200" : "text-sm text-red-100"}>{state.message}</p>
      ) : null}
    </form>
  );
}
