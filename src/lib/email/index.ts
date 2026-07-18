import {
  adminBookingCancellationNotificationTemplate,
  adminMessageToCustomerTemplate,
  adminNewBookingNotificationTemplate,
  bookingCancellationEmailTemplate,
  bookingConfirmationEmailTemplate,
  passwordResetEmailTemplate,
  testEmailTemplate,
  verificationEmailTemplate,
  htmlFromText,
  type AdminMessageToCustomerInput,
  type BookingEmailContext,
  type EmailTemplate,
} from "./templates";

export type EmailProviderName = "console" | "resend" | "smtp";

type EmailMessage = EmailTemplate & {
  to: string;
};

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
};

type EmailRuntimeConfig =
  | {
      provider: "console";
    }
  | {
      provider: "resend";
      apiKey: string;
      from: string;
    }
  | {
      provider: "smtp";
      smtp: SmtpConfig;
    };

export class EmailConfigurationError extends Error {
  constructor(message = "Brakuje konfiguracji wysyłki email.") {
    super(message);
    this.name = "EmailConfigurationError";
  }
}

export class EmailDeliveryError extends Error {
  constructor() {
    super("Nie udało się wysłać wiadomości email. Spróbuj ponownie później.");
    this.name = "EmailDeliveryError";
  }
}

export function isEmailError(error: unknown) {
  return error instanceof EmailConfigurationError || error instanceof EmailDeliveryError;
}

function isProduction() {
  return process.env.NODE_ENV === "production" || process.env.APP_ENV === "production";
}

function configuredProvider(): EmailProviderName {
  const provider = process.env.EMAIL_PROVIDER?.trim().toLowerCase();

  if (!provider) {
    return isProduction() ? "resend" : "console";
  }

  if (provider === "console" || provider === "resend" || provider === "smtp") {
    return provider;
  }

  throw new EmailConfigurationError('EMAIL_PROVIDER musi mieć wartość "console", "resend" albo "smtp".');
}

function requiredEnv(key: string) {
  const value = process.env[key]?.trim();

  if (!value) {
    throw new EmailConfigurationError(`Brakuje zmiennej ${key} dla konfiguracji email.`);
  }

  return value;
}

function smtpConfig(): SmtpConfig {
  const host = requiredEnv("SMTP_HOST");
  const rawPort = process.env.SMTP_PORT?.trim() || "587";
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port <= 0) {
    throw new EmailConfigurationError("SMTP_PORT musi być poprawnym numerem portu.");
  }

  return {
    host,
    port,
    user: requiredEnv("SMTP_USER"),
    password: requiredEnv("SMTP_PASSWORD"),
    from: requiredEnv("MAIL_FROM"),
  };
}

function emailConfig(): EmailRuntimeConfig {
  const provider = configuredProvider();

  if (provider === "console") {
    if (isProduction()) {
      throw new EmailConfigurationError('W production EMAIL_PROVIDER nie może mieć wartości "console".');
    }

    return { provider };
  }

  if (provider === "resend") {
    return {
      provider,
      apiKey: requiredEnv("RESEND_API_KEY"),
      from: requiredEnv("MAIL_FROM"),
    };
  }

  return {
    provider,
    smtp: smtpConfig(),
  };
}

function adminEmail() {
  return requiredEnv("ADMIN_EMAIL");
}

export function getEmailProviderName() {
  return configuredProvider();
}

export function getEmailProviderStatus() {
  try {
    return {
      ok: true,
      provider: configuredProvider(),
      message: null,
    };
  } catch (error) {
    return {
      ok: false,
      provider: "błąd konfiguracji",
      message: error instanceof Error ? error.message : "Nieprawidłowa konfiguracja email.",
    };
  }
}

export async function sendEmail(message: EmailMessage) {
  const config = emailConfig();

  try {
    if (config.provider === "console") {
      console.info(
        [
          "[DEV EMAIL]",
          `Provider: console`,
          `Do: ${message.to}`,
          `Temat: ${message.subject}`,
          "",
          message.text,
        ].join("\n"),
      );
      return;
    }

    if (config.provider === "resend") {
      const { Resend } = await import("resend");
      const resend = new Resend(config.apiKey);
      const result = await resend.emails.send({
        from: config.from,
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html ?? htmlFromText(message.text),
      });

      if (result.error) {
        console.error("[EMAIL] Resend odrzucił wysyłkę.", {
          name: result.error.name,
          message: result.error.message,
        });
        throw new EmailDeliveryError();
      }

      return;
    }

    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.password,
      },
    });

    await transporter.sendMail({
      from: config.smtp.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html ?? htmlFromText(message.text),
    });
  } catch (error) {
    if (error instanceof EmailConfigurationError || error instanceof EmailDeliveryError) {
      throw error;
    }

    console.error("[EMAIL] Nie udało się wysłać wiadomości.", error);
    throw new EmailDeliveryError();
  }
}

export async function sendVerificationEmail(input: { to: string; verificationUrl: string }) {
  await sendEmail({
    to: input.to,
    ...verificationEmailTemplate({ verificationUrl: input.verificationUrl }),
  });
}

export async function sendPasswordResetEmail(input: { to: string; resetUrl: string }) {
  await sendEmail({
    to: input.to,
    ...passwordResetEmailTemplate({ resetUrl: input.resetUrl }),
  });
}

export async function sendBookingConfirmationEmail(context: BookingEmailContext) {
  await sendEmail({
    to: context.customerEmail,
    ...bookingConfirmationEmailTemplate(context),
  });
}

export async function sendBookingCancellationEmail(context: BookingEmailContext) {
  await sendEmail({
    to: context.customerEmail,
    ...bookingCancellationEmailTemplate(context),
  });
}

export async function sendAdminNewBookingNotification(context: BookingEmailContext) {
  await sendEmail({
    to: adminEmail(),
    ...adminNewBookingNotificationTemplate(context),
  });
}

export async function sendAdminBookingCancellationNotification(context: BookingEmailContext) {
  await sendEmail({
    to: adminEmail(),
    ...adminBookingCancellationNotificationTemplate(context),
  });
}

export async function sendAdminMessageToCustomer(input: AdminMessageToCustomerInput) {
  await sendEmail({
    to: input.customerEmail,
    ...adminMessageToCustomerTemplate(input),
  });
}

export async function sendTestEmail(input: { to: string }) {
  await sendEmail({
    to: input.to,
    ...testEmailTemplate({ provider: getEmailProviderName() }),
  });
}
