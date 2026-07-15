import { AdminNav } from "@/modules/admin/components/admin-nav";
import { AdminAvailabilityManager } from "@/modules/admin-bookings/components/admin-availability-manager";
import {
  listAdminServices,
  listAvailabilityExceptions,
} from "@/modules/admin-bookings/admin-booking.repository";
import { requireAdmin } from "@/modules/auth/auth.guards";

export const metadata = {
  title: "Dostępność admin",
};

export default async function AdminAvailabilityPage() {
  await requireAdmin();
  const [exceptions, services] = await Promise.all([listAvailabilityExceptions(), listAdminServices()]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Admin</p>
          <h1 className="text-4xl font-semibold text-barber-cream">Dostępność</h1>
          <p className="mt-5 max-w-2xl leading-7 text-barber-muted">
            Blokady są zapisywane jako AvailabilityException i od razu ukrywają sloty w rezerwacji klienta.
          </p>
        </div>
        <AdminNav />
      </div>

      <div className="mt-10">
        <AdminAvailabilityManager exceptions={exceptions} services={services} />
      </div>
    </section>
  );
}
