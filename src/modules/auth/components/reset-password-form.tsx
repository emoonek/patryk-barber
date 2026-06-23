"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPasswordAction, type AuthActionState } from "../auth.actions";
import { AuthFieldError } from "./auth-field-error";

const initialState: AuthActionState = {};

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialState);

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      <input name="token" type="hidden" value={token} />

      <label className="grid gap-2 text-sm text-barber-muted">
        Nowe hasło
        <input
          className="border border-white/10 bg-white/5 px-4 py-3 text-barber-cream"
          name="password"
          type="password"
        />
        <AuthFieldError errors={state.errors?.password} />
      </label>

      <label className="grid gap-2 text-sm text-barber-muted">
        Powtórz nowe hasło
        <input
          className="border border-white/10 bg-white/5 px-4 py-3 text-barber-cream"
          name="confirmPassword"
          type="password"
        />
        <AuthFieldError errors={state.errors?.confirmPassword} />
      </label>

      {state.message ? (
        <p className={state.ok ? "text-sm text-green-300" : "text-sm text-red-300"}>{state.message}</p>
      ) : null}

      {state.ok ? (
        <Link className="text-sm text-barber-brass transition hover:text-barber-cream" href="/logowanie">
          Przejdź do logowania
        </Link>
      ) : (
        <button
          className="bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream disabled:opacity-60"
          disabled={pending}
          type="submit"
        >
          {pending ? "Zmieniam hasło..." : "Ustaw nowe hasło"}
        </button>
      )}
    </form>
  );
}
