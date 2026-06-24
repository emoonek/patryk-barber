import Link from "next/link";
import { requireAuth } from "@/modules/auth/auth.guards";
import { BookingForm } from "@/modules/booking/components/booking-form";
import { listActiveServices } from "@/modules/booking/booking.repository";
import { formatMoney, getAvailableSlots, todayInputValue } from "@/modules/booking/booking.service";

export const metadata = {
  title: "Rezerwacja",
};

type BookingPageProps = {
  searchParams?: Promise<{
    serviceId?: string;
    date?: string;
  }>;
};

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const user = await requireAuth();
  const params = (await searchParams) ?? {};
  const services = await listActiveServices();
  const selectedServiceId = params.serviceId && services.some((service) => service.id === params.serviceId)
    ? params.serviceId
    : services[0]?.id;
  const selectedDate = params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date) ? params.date : todayInputValue();
  const selectedService = services.find((service) => service.id === selectedServiceId);
  const slots = selectedServiceId ? await getAvailableSlots(selectedServiceId, selectedDate) : [];

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Rezerwacja online</p>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-barber-cream">Wybierz usługę i termin</h1>
          <p className="mt-4 max-w-2xl leading-7 text-barber-muted">
            Rezerwacje są dostępne dla zalogowanych klientów ze zweryfikowanym adresem email.
          </p>
        </div>
        <Link
          className="w-fit border border-white/15 px-5 py-3 text-sm font-semibold text-barber-cream transition hover:border-barber-brass"
          href="/konto"
        >
          Moje wizyty
        </Link>
      </div>

      {!user.emailVerifiedAt ? (
        <div className="mt-8 border border-red-300/30 bg-red-950/20 p-6 text-sm leading-6 text-red-100">
          Najpierw zweryfikuj adres email. Link weryfikacyjny w trybie dev jest wypisywany w konsoli serwera.
        </div>
      ) : null}

      {user.isBlocked ? (
        <div className="mt-8 border border-red-300/30 bg-red-950/20 p-6 text-sm leading-6 text-red-100">
          Twoje konto zostało zablokowane. Powód: {user.blockedReason ?? "nie podano powodu"}.
        </div>
      ) : null}

      <form className="mt-10 grid gap-5 border border-white/10 bg-black/20 p-6 md:grid-cols-[1fr_220px_auto]" method="get">
        <label className="grid gap-2 text-sm text-barber-muted">
          Usługa
          <select
            className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
            defaultValue={selectedServiceId}
            name="serviceId"
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - {formatMoney(service.priceCents)}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm text-barber-muted">
          Data
          <input
            className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
            defaultValue={selectedDate}
            min={todayInputValue()}
            name="date"
            type="date"
          />
        </label>

        <button className="self-end bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream">
          Pokaż sloty
        </button>
      </form>

      <div className="mt-8 grid gap-4">
        {selectedService ? (
          <div className="border-l border-barber-brass/60 pl-4 text-sm text-barber-muted">
            <p className="font-medium text-barber-cream">{selectedService.name}</p>
            <p>
              {formatMoney(selectedService.priceCents)} · {selectedService.durationMinutes} min
            </p>
          </div>
        ) : null}

        {user.isBlocked ? (
          <div className="border border-white/10 bg-black/20 p-6 text-sm text-barber-muted">
            Rezerwacja online jest niedostepna dla zablokowanego konta.
          </div>
        ) : user.emailVerifiedAt ? (
          <BookingForm date={selectedDate} serviceId={selectedServiceId ?? ""} slots={slots} />
        ) : (
          <div className="border border-white/10 bg-black/20 p-6 text-sm text-barber-muted">
            Sloty pojawią się po weryfikacji emaila.
          </div>
        )}
      </div>
    </section>
  );
}
