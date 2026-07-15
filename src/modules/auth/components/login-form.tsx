"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type AuthActionState } from "../auth.actions";
import { AuthFieldError } from "./auth-field-error";

const initialState: AuthActionState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      <label className="grid gap-2 text-sm text-barber-muted">
        Email
        <input className="border border-white/10 bg-white/5 px-4 py-3 text-barber-cream" name="email" type="email" />
        <AuthFieldError errors={state.errors?.email} />
      </label>

      <label className="grid gap-2 text-sm text-barber-muted">
        Hasło
        <input
          className="border border-white/10 bg-white/5 px-4 py-3 text-barber-cream"
          name="password"
          type="password"
        />
        <AuthFieldError errors={state.errors?.password} />
      </label>

      {state.message ? <p className="text-sm text-red-300">{state.message}</p> : null}

      <button
        className="bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Loguję..." : "Zaloguj się"}
      </button>

      <Link className="text-sm text-barber-brass transition hover:text-barber-cream" href="/zapomnialem-hasla">
        Nie pamiętam hasła
      </Link>
      <Link className="text-sm text-barber-brass transition hover:text-barber-cream" href="/rejestracja">
        Nie mam jeszcze konta
      </Link>
    </form>
  );
}
