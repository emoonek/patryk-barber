import type { AdminServiceActionState } from "../admin-service.actions";

type AdminServiceActionMessageProps = {
  state: AdminServiceActionState;
};

export function AdminServiceActionMessage({ state }: AdminServiceActionMessageProps) {
  if (!state.message) {
    return null;
  }

  return <p className={state.ok ? "text-sm text-green-300" : "text-sm text-red-300"}>{state.message}</p>;
}
