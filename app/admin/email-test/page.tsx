import { getEmailProviderStatus } from "@/lib/email";
import { AdminNav } from "@/modules/admin/components/admin-nav";
import { AdminEmailTestForm } from "@/modules/admin-email/components/admin-email-test-form";
import { requireAdmin } from "@/modules/auth/auth.guards";

export const metadata = {
  title: "Test email",
};

export default async function AdminEmailTestPage() {
  await requireAdmin();
  const adminEmail = process.env.ADMIN_EMAIL?.trim() || null;
  const providerStatus = getEmailProviderStatus();

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Admin</p>
          <h1 className="text-4xl font-semibold text-barber-cream">Test email</h1>
          <p className="mt-5 max-w-2xl leading-7 text-barber-muted">
            Wyślij prostą wiadomość testową po zmianie konfiguracji Resend albo SMTP.
          </p>
        </div>
        <AdminNav />
      </div>

      <div className="mt-10">
        {!providerStatus.ok && providerStatus.message ? (
          <p className="mb-5 border border-yellow-300/30 bg-yellow-950/20 p-5 text-sm text-yellow-100">
            {providerStatus.message}
          </p>
        ) : null}
        <AdminEmailTestForm adminEmail={adminEmail} provider={providerStatus.provider} />
      </div>
    </section>
  );
}
