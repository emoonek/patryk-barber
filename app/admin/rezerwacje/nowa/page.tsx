import Link from "next/link";
import { AdminManualBookingForm } from "@/modules/admin-bookings/components/admin-manual-booking-form";
import {
  listAdminCustomers,
  listAdminServices,
} from "@/modules/admin-bookings/admin-booking.repository";
import { requireAdmin } from "@/modules/auth/auth.guards";

export const metadata = {
  title: "Nowa rezerwacja",
};

export default async function AdminNewBookingPage() {
  await requireAdmin();
  const [customers, services] = await Promise.all([listAdminCustomers(), listAdminServices()]);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Admin</p>
          <h1 className="text-4xl font-semibold text-barber-cream">Manualna rezerwacja</h1>
          <p className="mt-5 max-w-2xl leading-7 text-barber-muted">
            Wybierz istniejacego klienta, usluge i termin. System sprawdzi konflikt slotu przed zapisem.
          </p>
        </div>
        <Link
          className="w-fit border border-white/15 px-5 py-3 text-sm font-semibold text-barber-cream transition hover:border-barber-brass"
          href="/admin/rezerwacje"
        >
          Wroc do listy
        </Link>
      </div>

      <div className="mt-10">
        <AdminManualBookingForm customers={customers} services={services} />
      </div>
    </section>
  );
}
