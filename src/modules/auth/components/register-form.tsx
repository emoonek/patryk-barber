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
        <label className="grid gap-2 text-sm text-barber-silver">
          Imię
          <input className="frost-input px-4 py-3" name="firstName" />
          <AuthFieldError errors={state.errors?.firstName} />
        </label>
        <label className="grid gap-2 text-sm text-barber-silver">
          Nazwisko
          <input className="frost-input px-4 py-3" name="lastName" />
          <AuthFieldError errors={state.errors?.lastName} />
        </label>
      </div>

      <label className="grid gap-2 text-sm text-barber-silver">
        Email
        <input className="frost-input px-4 py-3" name="email" type="email" />
        <AuthFieldError errors={state.errors?.email} />
      </label>

      <label className="grid gap-2 text-sm text-barber-silver">
        Telefon opcjonalnie
        <input className="frost-input px-4 py-3" name="phone" />
        <AuthFieldError errors={state.errors?.phone} />
      </label>

      <div className="grid gap-2 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-barber-silver">
          Hasło
          <input
            className="frost-input px-4 py-3"
            name="password"
            type="password"
          />
          <AuthFieldError errors={state.errors?.password} />
        </label>
        <label className="grid gap-2 text-sm text-barber-silver">
          Powtórz hasło
          <input
            className="frost-input px-4 py-3"
            name="confirmPassword"
            type="password"
          />
          <AuthFieldError errors={state.errors?.confirmPassword} />
        </label>
      </div>

      <label className="flex items-start gap-3 text-sm leading-6 text-barber-silver">
        <input className="mt-1" name="termsAccepted" type="checkbox" />
        <span>
          Akceptuję{" "}
          <Link className="frost-link" href="/regulamin-rezerwacji">
            regulamin rezerwacji
          </Link>{" "}
          oraz{" "}
          <Link className="frost-link" href="/polityka-prywatnosci">
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
        className="chrome-button px-5 py-3 text-sm font-black uppercase disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Tworzę konto..." : "Utwórz konto"}
      </button>
    </form>
  );
}
