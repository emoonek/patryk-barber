import type { AdminActionState } from "../admin-booking.actions";

type AdminActionMessageProps = {
  state: AdminActionState;
};

export function AdminActionMessage({ state }: AdminActionMessageProps) {
  if (!state.message) {
    return null;
  }

  return <p className={state.ok ? "text-sm text-green-300" : "text-sm text-red-300"}>{state.message}</p>;
}
