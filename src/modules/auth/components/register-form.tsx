"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction, type AuthActionState } from "../auth.actions";
import { AuthFieldError } from "./auth-field-error";

const initialState: AuthActionState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      <div className="grid gap-2 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-barber-muted">
          Imię
          <input className="border border-white/10 bg-white/5 px-4 py-3 text-barber-cream" name="firstName" />
          <AuthFieldError errors={state.errors?.firstName} />
        </label>
        <label className="grid gap-2 text-sm text-barber-muted">
          Nazwisko
          <input className="border border-white/10 bg-white/5 px-4 py-3 text-barber-cream" name="lastName" />
          <AuthFieldError errors={state.errors?.lastName} />
        </label>
      </div>

      <label className="grid gap-2 text-sm text-barber-muted">
        Email
        <input className="border border-white/10 bg-white/5 px-4 py-3 text-barber-cream" name="email" type="email" />
        <AuthFieldError errors={state.errors?.email} />
      </label>

      <label className="grid gap-2 text-sm text-barber-muted">
        Telefon opcjonalnie
        <input className="border border-white/10 bg-white/5 px-4 py-3 text-barber-cream" name="phone" />
        <AuthFieldError errors={state.errors?.phone} />
      </label>

      <div className="grid gap-2 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-barber-muted">
          Hasło
          <input
            className="border border-white/10 bg-white/5 px-4 py-3 text-barber-cream"
            name="password"
            type="password"
          />
          <AuthFieldError errors={state.errors?.password} />
        </label>
        <label className="grid gap-2 text-sm text-barber-muted">
          Powtórz hasło
          <input
            className="border border-white/10 bg-white/5 px-4 py-3 text-barber-cream"
            name="confirmPassword"
            type="password"
          />
          <AuthFieldError errors={state.errors?.confirmPassword} />
        </label>
      </div>

      <label className="flex items-start gap-3 text-sm leading-6 text-barber-muted">
        <input className="mt-1" name="termsAccepted" type="checkbox" />
        <span>
          Akceptuję{" "}
          <Link className="text-barber-brass hover:text-barber-cream" href="/regulamin-rezerwacji">
            regulamin rezerwacji
          </Link>{" "}
          oraz{" "}
          <Link className="text-barber-brass hover:text-barber-cream" href="/polityka-prywatnosci">
            politykę prywatności
          </Link>
          .
        </span>
      </label>
      <AuthFieldError errors={state.errors?.termsAccepted} />

      {state.message ? (
        <p className={state.ok ? "text-sm text-green-300" : "text-sm text-red-300"}>{state.message}</p>
      ) : null}

      <button
        className="bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Tworzę konto..." : "Utwórz konto"}
      </button>
    </form>
  );
}
