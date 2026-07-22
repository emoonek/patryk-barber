import Link from "next/link";
import { AdminNav } from "@/modules/admin/components/admin-nav";
import { adminCustomerSearchSchema } from "@/modules/admin-customers/admin-customer.schemas";
import {
  activityLabel,
  customerDisplayName,
  roleLabel,
} from "@/modules/admin-customers/admin-customer.format";
import { listAdminCustomersWithStats } from "@/modules/admin-customers/admin-customer.repository";
import { requireAdmin } from "@/modules/auth/auth.guards";
import { formatDate } from "@/modules/booking/booking.format";

export const metadata = {
  title: "Klienci admin",
};

type AdminCustomersPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export default async function AdminCustomersPage({ searchParams }: AdminCustomersPageProps) {
  await requireAdmin();
  const params = (await searchParams) ?? {};
  const parsedFilters = adminCustomerSearchSchema.safeParse({
    q: params.q ?? "",
  });
  const filters = parsedFilters.success ? parsedFilters.data : { q: "" };
  const customers = await listAdminCustomersWithStats(filters);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Admin</p>
          <h1 className="text-4xl font-semibold text-barber-cream">Klienci</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <AdminNav />
          <Link
            className="border border-white/15 px-5 py-3 text-sm font-semibold text-barber-cream transition hover:border-barber-brass"
            href="/admin/rezerwacje/nowa"
          >
            Nowa rezerwacja
          </Link>
        </div>
      </div>

      <form className="mt-10 grid gap-4 border border-white/10 bg-black/20 p-6 md:grid-cols-[1fr_auto]" method="get">
        <label className="grid gap-2 text-sm text-barber-muted">
          Szukaj klienta
          <input
            className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
            defaultValue={filters.q}
            name="q"
            placeholder="Imię, nazwisko, email lub telefon"
          />
        </label>
        <button className="self-end bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream">
          Szukaj
        </button>
      </form>

      <div className="mt-8 overflow-x-auto border border-white/10 bg-black/20">
        <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
          <thead className="text-barber-muted">
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 font-medium">Klient</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Telefon</th>
              <th className="px-4 py-3 font-medium">Rola</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Rezerwacje</th>
              <th className="px-4 py-3 font-medium">Aktywne przyszłe</th>
              <th className="px-4 py-3 font-medium">Utworzono</th>
              <th className="px-4 py-3 font-medium">Akcja</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr className="border-b border-white/10 text-barber-muted last:border-0" key={customer.id}>
                <td className="px-4 py-3 text-barber-cream">{customerDisplayName(customer)}</td>
                <td className="px-4 py-3">{customer.email}</td>
                <td className="px-4 py-3">{customer.phone ?? "-"}</td>
                <td className="px-4 py-3">{roleLabel(customer.role)}</td>
                <td className="px-4 py-3">{activityLabel(customer)}</td>
                <td className="px-4 py-3">{customer._count.bookings}</td>
                <td className="px-4 py-3">{customer.bookings.length}</td>
                <td className="px-4 py-3">{formatDate(customer.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link className="font-semibold text-barber-brass" href={`/admin/klienci/${customer.id}`}>
                    Szczegóły
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 ? (
          <div className="grid gap-3 p-5 text-sm text-barber-muted">
            <p>Brak klientów dla podanego wyszukiwania.</p>
            <div className="flex flex-wrap gap-3">
              <Link className="font-semibold text-barber-brass" href="/admin/klienci">
                Wyczyść wyszukiwanie
              </Link>
              <Link className="font-semibold text-barber-brass" href="/admin/rezerwacje/nowa">
                Dodaj rezerwację manualnie
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
