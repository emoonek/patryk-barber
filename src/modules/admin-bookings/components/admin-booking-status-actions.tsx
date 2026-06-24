"use client";

import { BookingStatus } from "@prisma/client";
import { useActionState } from "react";
import {
  adminCancelBookingAction,
  adminStatusChangeAction,
  type AdminActionState,
} from "../admin-booking.actions";
import { AdminActionMessage } from "./admin-action-message";

type AdminBookingStatusActionsProps = {
  bookingId: string;
  currentStatus: BookingStatus;
};

const initialState: AdminActionState = {};

export function AdminBookingStatusActions({ bookingId, currentStatus }: AdminBookingStatusActionsProps) {
  const [cancelState, cancelAction, cancelPending] = useActionState(adminCancelBookingAction, initialState);
  const [statusState, statusAction, statusPending] = useActionState(adminStatusChangeAction, initialState);
  const isClosed = currentStatus !== BookingStatus.confirmed;

  return (
    <section className="grid gap-4 border border-white/10 bg-black/20 p-6">
      <h2 className="text-2xl font-semibold text-barber-cream">Akcje admina</h2>

      <form action={cancelAction} className="grid gap-3">
        <input name="bookingId" type="hidden" value={bookingId} />
        <label className="grid gap-2 text-sm text-barber-muted">
          Powod anulowania
          <textarea
            className="min-h-24 border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
            disabled={isClosed || cancelPending}
            name="cancelReason"
            placeholder="Opcjonalnie"
          />
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <button
            className="border border-red-300/40 px-5 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-950/40 disabled:opacity-50"
            disabled={isClosed || cancelPending}
          >
            Anuluj rezerwacje
          </button>
          <AdminActionMessage state={cancelState} />
        </div>
      </form>

      <form action={statusAction} className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
        <input name="bookingId" type="hidden" value={bookingId} />
        <button
          className="border border-white/15 px-5 py-3 text-sm font-semibold text-barber-cream transition hover:border-green-300 disabled:opacity-50"
          disabled={isClosed || statusPending}
          name="status"
          value={BookingStatus.completed}
        >
          Oznacz jako completed
        </button>
        <button
          className="border border-white/15 px-5 py-3 text-sm font-semibold text-barber-cream transition hover:border-red-300 disabled:opacity-50"
          disabled={isClosed || statusPending}
          name="status"
          value={BookingStatus.no_show}
        >
          Oznacz jako no_show
        </button>
        <AdminActionMessage state={statusState} />
      </form>
    </section>
  );
}
