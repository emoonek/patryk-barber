export type EmailTemplate = {
  subject: string;
  text: string;
  html?: string;
};

export type BookingEmailContext = {
  customerEmail: string;
  customerName: string;
  serviceName: string;
  servicePrice: string;
  serviceDurationMinutes: number;
  date: string;
  time: string;
  cancelReason?: string;
};

export type AdminMessageToCustomerInput = BookingEmailContext & {
  subject: string;
  message: string;
};

function appUrl() {
  return process.env.APP_URL ?? "http://localhost:3000";
}

function salonContactLines() {
  return [
    process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Patryk Barber",
    process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ?? "",
    process.env.NEXT_PUBLIC_BUSINESS_PHONE ? `Telefon: ${process.env.NEXT_PUBLIC_BUSINESS_PHONE}` : "",
    process.env.NEXT_PUBLIC_BUSINESS_EMAIL ? `Email: ${process.env.NEXT_PUBLIC_BUSINESS_EMAIL}` : "",
  ].filter(Boolean);
}

function signature() {
  return ["", "Pozdrawiamy,", "Patryk Barber"].join("\n");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function htmlFromText(text: string) {
  return text
    .split("\n")
    .map((line) => (line ? `<p>${escapeHtml(line)}</p>` : "<br />"))
    .join("");
}

function template(subject: string, lines: string[]): EmailTemplate {
  const text = lines.join("\n");

  return {
    subject,
    text,
    html: htmlFromText(text),
  };
}

function bookingDetails(context: BookingEmailContext) {
  return [
    `Usługa: ${context.serviceName}`,
    `Data: ${context.date}`,
    `Godzina: ${context.time}`,
    `Cena: ${context.servicePrice}`,
    "",
    "Kontakt do salonu:",
    ...salonContactLines(),
  ].join("\n");
}

export function verificationEmailTemplate(input: { verificationUrl: string }) {
  return template("Potwierdź swój adres email - Patryk Barber", [
    "Dziękujemy za rejestrację w Patryk Barber.",
    "Kliknij link, aby potwierdzić adres email:",
    input.verificationUrl,
    "",
    `Jeśli link nie działa, skopiuj go do przeglądarki. Adres aplikacji: ${appUrl()}`,
    signature(),
  ]);
}

export function passwordResetEmailTemplate(input: { resetUrl: string }) {
  return template("Reset hasła - Patryk Barber", [
    "Otrzymaliśmy prośbę o reset hasła.",
    "Kliknij link, aby ustawić nowe hasło:",
    input.resetUrl,
    "",
    "Jeśli to nie Ty wysłałeś prośbę, zignoruj tę wiadomość.",
    signature(),
  ]);
}

export function bookingConfirmationEmailTemplate(context: BookingEmailContext) {
  return template("Potwierdzenie rezerwacji - Patryk Barber", [
    `Cześć ${context.customerName},`,
    "Twoja rezerwacja została potwierdzona.",
    "",
    bookingDetails(context),
    signature(),
  ]);
}

export function bookingCancellationEmailTemplate(context: BookingEmailContext) {
  return template(
    "Anulowanie rezerwacji - Patryk Barber",
    [
      `Cześć ${context.customerName},`,
      "Twoja rezerwacja została anulowana.",
      context.cancelReason ? `Powód: ${context.cancelReason}` : "",
      "",
      bookingDetails(context),
      signature(),
    ].filter(Boolean),
  );
}

export function adminNewBookingNotificationTemplate(context: BookingEmailContext) {
  return template("Nowa rezerwacja - Patryk Barber", [
    "Pojawiła się nowa rezerwacja.",
    "",
    `Klient: ${context.customerName}`,
    `Email klienta: ${context.customerEmail}`,
    "",
    bookingDetails(context),
    signature(),
  ]);
}

export function adminBookingCancellationNotificationTemplate(context: BookingEmailContext) {
  return template("Anulowana rezerwacja - Patryk Barber", [
    "Klient anulował rezerwację.",
    "",
    `Klient: ${context.customerName}`,
    `Email klienta: ${context.customerEmail}`,
    "",
    bookingDetails(context),
    signature(),
  ]);
}

export function adminMessageToCustomerTemplate(input: AdminMessageToCustomerInput) {
  return template(input.subject, [
    `Cześć ${input.customerName},`,
    "",
    input.message,
    "",
    "Kontekst wizyty:",
    `Data: ${input.date}`,
    `Godzina: ${input.time}`,
    `Usługa: ${input.serviceName}`,
    "",
    "Kontakt do salonu:",
    ...salonContactLines(),
    signature(),
  ]);
}
