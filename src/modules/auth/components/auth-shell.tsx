type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function AuthShell({ eyebrow, title, description }: AuthShellProps) {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-4xl content-center px-6 py-16">
      <div className="max-w-xl border border-white/10 bg-black/20 p-8">
        <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">{eyebrow}</p>
        <h1 className="text-4xl font-semibold text-barber-cream">{title}</h1>
        <p className="mt-5 leading-7 text-barber-muted">{description}</p>
        <div className="mt-8 grid gap-4">
          <div className="h-11 border border-white/10 bg-white/5 px-4 py-3 text-sm text-barber-muted">
            email@example.com
          </div>
          <div className="h-11 border border-white/10 bg-white/5 px-4 py-3 text-sm text-barber-muted">
            Hasło
          </div>
          <div className="h-11 bg-barber-brass px-4 py-3 text-center text-sm font-semibold text-black">
            Formularz pojawi się w kolejnym etapie
          </div>
        </div>
      </div>
    </section>
  );
}
