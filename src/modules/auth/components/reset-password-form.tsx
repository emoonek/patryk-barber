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

      <label className="grid gap-2 text-sm text-barber-silver">
        Nowe hasło
        <input
          className="frost-input px-4 py-3"
          name="password"
          type="password"
        />
        <AuthFieldError errors={state.errors?.password} />
      </label>

      <label className="grid gap-2 text-sm text-barber-silver">
        Powtórz nowe hasło
        <input
          className="frost-input px-4 py-3"
          name="confirmPassword"
          type="password"
        />
        <AuthFieldError errors={state.errors?.confirmPassword} />
      </label>

      {state.message ? (
        <p className={state.ok ? "text-sm text-green-300" : "text-sm text-red-300"}>{state.message}</p>
      ) : null}

      {state.ok ? (
        <Link className="frost-link text-sm" href="/logowanie">
          Przejdź do logowania
        </Link>
      ) : (
        <button
          className="chrome-button px-5 py-3 text-sm font-black uppercase disabled:opacity-60"
          disabled={pending}
          type="submit"
        >
          {pending ? "Zmieniam hasło..." : "Ustaw nowe hasło"}
        </button>
      )}
    </form>
  );
}
