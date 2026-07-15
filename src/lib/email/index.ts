type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

type BookingEmailContext = {
  customerEmail: string;
  customerName: string;
  serviceName: string;
  servicePrice: string;
  serviceDurationMinutes: number;
  date: string;
  time: string;
  cancelReason?: string;
};

type AdminMessageToCustomerInput = BookingEmailContext & {
  subject: string;
  message: string;
};

class EmailConfigurationError extends Error {
  constructor() {
    super("Brakuje konfiguracji wysylki email.");
  }
}

export class EmailDeliveryError extends Error {
  constructor() {
    super("Nie udalo sie wyslac wiadomosci email. Sprobuj ponownie pozniej.");
  }
}

function isProduction() {
  return process.env.NODE_ENV === "production" || process.env.APP_ENV === "production";
}

function smtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD?.trim();
  const from = process.env.MAIL_FROM?.trim();

  const configured = Boolean(host && port && user && password && from);

  if (!configured) {
    if (isProduction()) {
      throw new EmailConfigurationError();
    }

    return null;
  }

  return {
    host: host!,
    port,
    user: user!,
    password: password!,
    from: from!,
  };
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

function htmlFromText(text: string) {
  return text
    .split("\n")
    .map((line) => (line ? `<p>${escapeHtml(line)}</p>` : "<br />"))
    .join("");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function sendEmail(message: EmailMessage) {
  const config = smtpConfig();

  if (!config) {
    console.info(
      [
        "[DEV EMAIL]",
        `Do: ${message.to}`,
        `Temat: ${message.subject}`,
        "",
        message.text,
      ].join("\n"),
    );
    return;
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.password,
      },
    });

    await transporter.sendMail({
      from: config.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html ?? htmlFromText(message.text),
    });
  } catch (error) {
    console.error("[EMAIL] Nie udalo sie wyslac wiadomosci.", error);
    throw new EmailDeliveryError();
  }
}

function adminEmail() {
  const email = process.env.ADMIN_EMAIL?.trim();

  if (!email && isProduction()) {
    throw new EmailConfigurationError();
  }

  return email ?? "admin@example.com";
}

function bookingDetails(context: BookingEmailContext) {
  return [
    `Usluga: ${context.serviceName}`,
    `Data: ${context.date}`,
    `Godzina: ${context.time}`,
    `Cena: ${context.servicePrice}`,
    `Czas trwania: ${context.serviceDurationMinutes} min`,
    "",
    "Kontakt do salonu:",
    ...salonContactLines(),
  ].join("\n");
}

export async function sendVerificationEmail(input: { to: string; verificationUrl: string }) {
  await sendEmail({
    to: input.to,
    subject: "Potwierdz swoj adres email - Patryk Barber",
    text: [
      "Dziekujemy za rejestracje w Patryk Barber.",
      "Kliknij link, aby potwierdzic adres email:",
      input.verificationUrl,
      signature(),
    ].join("\n"),
  });
}

export async function sendPasswordResetEmail(input: { to: string; resetUrl: string }) {
  await sendEmail({
    to: input.to,
    subject: "Reset hasla - Patryk Barber",
    text: [
      "Otrzymalismy prosbe o reset hasla.",
      "Kliknij link, aby ustawic nowe haslo:",
      input.resetUrl,
      "Jesli to nie Ty wyslales prosbe, zignoruj te wiadomosc.",
      signature(),
    ].join("\n"),
  });
}

export async function sendBookingConfirmationEmail(context: BookingEmailContext) {
  await sendEmail({
    to: context.customerEmail,
    subject: "Potwierdzenie rezerwacji - Patryk Barber",
    text: [
      `Czesc ${context.customerName},`,
      "Twoja rezerwacja zostala potwierdzona.",
      "",
      bookingDetails(context),
      signature(),
    ].join("\n"),
  });
}

export async function sendBookingCancellationEmail(context: BookingEmailContext) {
  await sendEmail({
    to: context.customerEmail,
    subject: "Anulowanie rezerwacji - Patryk Barber",
    text: [
      `Czesc ${context.customerName},`,
      "Twoja rezerwacja zostala anulowana.",
      context.cancelReason ? `Powod: ${context.cancelReason}` : "",
      "",
      bookingDetails(context),
      signature(),
    ].filter(Boolean).join("\n"),
  });
}

export async function sendAdminNewBookingNotification(context: BookingEmailContext) {
  await sendEmail({
    to: adminEmail(),
    subject: "Nowa rezerwacja - Patryk Barber",
    text: [
      "Pojawila sie nowa rezerwacja.",
      "",
      `Klient: ${context.customerName}`,
      `Email klienta: ${context.customerEmail}`,
      bookingDetails(context),
      signature(),
    ].join("\n"),
  });
}

export async function sendAdminBookingCancellationNotification(context: BookingEmailContext) {
  await sendEmail({
    to: adminEmail(),
    subject: "Anulowana rezerwacja - Patryk Barber",
    text: [
      "Klient anulowal rezerwacje.",
      "",
      `Klient: ${context.customerName}`,
      `Email klienta: ${context.customerEmail}`,
      bookingDetails(context),
      signature(),
    ].join("\n"),
  });
}

export async function sendAdminMessageToCustomer(input: AdminMessageToCustomerInput) {
  await sendEmail({
    to: input.customerEmail,
    subject: input.subject,
    text: [
      `Czesc ${input.customerName},`,
      input.message,
      "",
      "Kontekst wizyty:",
      `Data: ${input.date}`,
      `Godzina: ${input.time}`,
      `Usluga: ${input.serviceName}`,
      "",
      "Kontakt do salonu:",
      ...salonContactLines(),
      signature(),
    ].join("\n"),
  });
}
