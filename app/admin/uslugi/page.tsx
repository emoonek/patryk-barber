import Link from "next/link";
import { AdminServiceForm } from "@/modules/admin-services/components/admin-service-form";
import { AdminServiceToggleForm } from "@/modules/admin-services/components/admin-service-toggle-form";
import { getAdminService, listAdminServices } from "@/modules/admin-services/admin-service.repository";
import { requireAdmin } from "@/modules/auth/auth.guards";
import { formatDate, formatMoney, formatTime } from "@/modules/booking/booking.service";

export const metadata = {
  title: "Uslugi admin",
};

type AdminServicesPageProps = {
  searchParams?: Promise<{
    edit?: string;
  }>;
};

export default async function AdminServicesPage({ searchParams }: AdminServicesPageProps) {
  await requireAdmin();
  const params = (await searchParams) ?? {};
  const [services, editedService] = await Promise.all([
    listAdminServices(),
    params.edit ? getAdminService(params.edit) : Promise.resolve(null),
  ]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Admin</p>
          <h1 className="text-4xl font-semibold text-barber-cream">Uslugi</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="border border-white/15 px-5 py-3 text-sm font-semibold text-barber-cream transition hover:border-barber-brass"
            href="/admin"
          >
            Dashboard
          </Link>
          <Link
            className="bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream"
            href="#dodaj-usluge"
          >
            Dodaj usluge
          </Link>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto border border-white/10 bg-black/20">
        <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
          <thead className="text-barber-muted">
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 font-medium">Nazwa</th>
              <th className="px-4 py-3 font-medium">Cena</th>
              <th className="px-4 py-3 font-medium">Czas</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Kolejnosc</th>
              <th className="px-4 py-3 font-medium">Rezerwacje</th>
              <th className="px-4 py-3 font-medium">Utworzono</th>
              <th className="px-4 py-3 font-medium">Aktualizacja</th>
              <th className="px-4 py-3 font-medium">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr className="border-b border-white/10 text-barber-muted last:border-0" key={service.id}>
                <td className="px-4 py-3 text-barber-cream">{service.name}</td>
                <td className="px-4 py-3">{formatMoney(service.priceCents)}</td>
                <td className="px-4 py-3">{service.durationMinutes} min</td>
                <td className="px-4 py-3">{service.isActive ? "Aktywna" : "Nieaktywna"} </td>
                <td className="px-4 py-3">{service.sortOrder}</td>
                <td className="px-4 py-3">{service._count.bookings}</td>
                <td className="px-4 py-3">{formatDate(service.createdAt)}</td>
                <td className="px-4 py-3">
                  {formatDate(service.updatedAt)}, {formatTime(service.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-3">
                    <Link className="font-semibold text-barber-brass" href={`/admin/uslugi?edit=${service.id}#edytuj-usluge`}>
                      Edytuj
                    </Link>
                    <AdminServiceToggleForm service={service} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {services.length === 0 ? (
          <p className="p-5 text-sm text-barber-muted">Nie dodano jeszcze zadnych uslug.</p>
        ) : null}
      </div>

      {params.edit && !editedService ? (
        <p className="mt-6 border border-red-300/30 bg-red-950/20 p-5 text-sm text-red-100">
          Nie znaleziono uslugi do edycji.
        </p>
      ) : null}

      {editedService ? (
        <div className="mt-8" id="edytuj-usluge">
          <AdminServiceForm mode="edit" service={editedService} />
        </div>
      ) : null}

      <div className="mt-8" id="dodaj-usluge">
        <AdminServiceForm mode="create" />
      </div>

      <div className="mt-8 border border-white/10 bg-black/20 p-5 text-sm leading-6 text-barber-muted">
        Rezerwacje przechowuja obecnie tylko serviceId. Zmiana nazwy, ceny lub czasu uslugi wplynie na sposob
        wyswietlania historycznych rezerwacji, bo dane sa pobierane z aktualnej uslugi.
      </div>
    </section>
  );
}
