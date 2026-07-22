import Link from "next/link";
import { requireAuth } from "@/modules/auth/auth.guards";
import { ResendVerificationForm } from "@/modules/auth/components/resend-verification-form";
import { BookingForm } from "@/modules/booking/components/booking-form";
import { formatMoney, todayInputValue } from "@/modules/booking/booking.format";
import { listActiveServices } from "@/modules/booking/booking.repository";
import { getAvailableSlots } from "@/modules/booking/booking.service";

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
    <section className="chrome-page-shell px-5 py-14 md:px-10 md:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-barber-silver">
          Rezerwacja online
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[clamp(2.4rem,7vw,4.8rem)] font-black uppercase leading-[0.9] text-barber-frost">
              Wybierz usługę i termin
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-barber-silver">
              Rezerwacje są dostępne dla zalogowanych klientów ze zweryfikowanym adresem email.
            </p>
          </div>
          <Link className="ghost-button w-fit px-5 py-3 text-sm font-black uppercase" href="/konto">
            Moje wizyty
          </Link>
        </div>

        {!user.emailVerifiedAt ? (
          <div className="mt-8 border border-red-300/30 bg-red-950/20 p-6 text-sm leading-6 text-red-100">
            Aby zarezerwować wizytę, potwierdź adres email. Link weryfikacyjny wysłaliśmy po rejestracji.
            Jeśli wiadomość nie dotarła, możesz wysłać link ponownie.
            <ResendVerificationForm />
          </div>
        ) : null}

        {user.isBlocked ? (
          <div className="mt-8 border border-red-300/30 bg-red-950/20 p-6 text-sm leading-6 text-red-100">
            Twoje konto jest zablokowane, dlatego rezerwacja online jest niedostępna. Powód:{" "}
            {user.blockedReason ?? "skontaktuj się z salonem, aby poznać szczegóły"}.
          </div>
        ) : null}

        <form
          className="technical-border mt-10 grid gap-5 bg-black/36 p-5 md:grid-cols-[1fr_220px_auto] md:p-6"
          method="get"
        >
          <label className="grid gap-2 text-sm text-barber-silver">
            Usługa
            <select
              className="border border-barber-chrome/20 bg-[#080b0e] px-4 py-3 text-barber-frost"
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

          <label className="grid gap-2 text-sm text-barber-silver">
            Data
            <input
              className="border border-barber-chrome/20 bg-[#080b0e] px-4 py-3 text-barber-frost"
              defaultValue={selectedDate}
              min={todayInputValue()}
              name="date"
              type="date"
            />
          </label>

          <button className="chrome-button self-end px-5 py-3 text-sm font-black uppercase">
            Pokaż sloty
          </button>
        </form>

        <div className="mt-8 grid gap-4">
          {selectedService ? (
            <div className="border-l border-barber-chrome/40 pl-4 text-sm text-barber-silver">
              <p className="font-medium text-barber-frost">{selectedService.name}</p>
              <p>{formatMoney(selectedService.priceCents)}</p>
            </div>
          ) : null}

          {user.isBlocked ? (
            <div className="document-panel p-6 text-sm text-barber-silver">
              Rezerwacja online jest niedostępna dla zablokowanego konta.
            </div>
          ) : user.emailVerifiedAt ? (
            <BookingForm date={selectedDate} serviceId={selectedServiceId ?? ""} slots={slots} />
          ) : (
            <div className="document-panel p-6 text-sm text-barber-silver">
              Sloty pojawią się po weryfikacji emaila.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
