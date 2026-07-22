"use client";

import { useActionState } from "react";
import {
  adminCreateServiceAction,
  adminUpdateServiceAction,
  type AdminServiceActionState,
} from "../admin-service.actions";
import { AdminServiceActionMessage } from "./admin-service-action-message";

type AdminServiceFormProps = {
  mode: "create" | "edit";
  service?: {
    id: string;
    name: string;
    priceCents: number;
    isActive: boolean;
    sortOrder: number;
  };
};

const initialState: AdminServiceActionState = {};

export function AdminServiceForm({ mode, service }: AdminServiceFormProps) {
  const action = mode === "create" ? adminCreateServiceAction : adminUpdateServiceAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const title = mode === "create" ? "Dodaj usluge" : "Edytuj usluge";

  return (
    <form action={formAction} className="grid gap-4 border border-white/10 bg-black/20 p-6">
      {service ? <input name="serviceId" type="hidden" value={service.id} /> : null}
      <h2 className="text-2xl font-semibold text-barber-cream">{title}</h2>

      <div className="grid gap-4 md:grid-cols-4">
        <label className="grid gap-2 text-sm text-barber-muted md:col-span-2">
          Nazwa
          <input
            className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
            defaultValue={service?.name ?? ""}
            name="name"
            placeholder="Np. Strzyzenie meskie"
          />
          {state.errors?.name ? <span className="text-red-300">{state.errors.name[0]}</span> : null}
        </label>

        <label className="grid gap-2 text-sm text-barber-muted">
          Cena w PLN
          <input
            className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
            defaultValue={service ? (service.priceCents / 100).toFixed(2) : ""}
            inputMode="decimal"
            name="priceCents"
            placeholder="70.00"
          />
          {state.errors?.priceCents ? <span className="text-red-300">{state.errors.priceCents[0]}</span> : null}
        </label>

        <label className="grid gap-2 text-sm text-barber-muted">
          Kolejnosc
          <input
            className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
            defaultValue={service?.sortOrder ?? 0}
            name="sortOrder"
            type="number"
          />
          {state.errors?.sortOrder ? <span className="text-red-300">{state.errors.sortOrder[0]}</span> : null}
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm text-barber-muted">
        <input
          className="h-4 w-4 accent-barber-brass"
          defaultChecked={service?.isActive ?? true}
          name="isActive"
          type="checkbox"
        />
        Aktywna usluga
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          className="bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream disabled:opacity-60"
          disabled={pending}
        >
          {mode === "create" ? "Dodaj usluge" : "Zapisz usluge"}
        </button>
        <AdminServiceActionMessage state={state} />
      </div>
    </form>
  );
}
