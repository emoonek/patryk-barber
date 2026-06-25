import { adminToggleServiceActiveAction } from "../admin-service.actions";

type AdminServiceToggleFormProps = {
  service: {
    id: string;
    isActive: boolean;
  };
};

export function AdminServiceToggleForm({ service }: AdminServiceToggleFormProps) {
  return (
    <form action={adminToggleServiceActiveAction}>
      <input name="serviceId" type="hidden" value={service.id} />
      <input name="isActive" type="hidden" value={service.isActive ? "false" : "true"} />
      <button className="font-semibold text-barber-brass">
        {service.isActive ? "Dezaktywuj" : "Aktywuj"}
      </button>
    </form>
  );
}
