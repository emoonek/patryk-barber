type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-4xl content-center px-6 py-16">
      <div className="max-w-xl border border-white/10 bg-black/20 p-8">
        <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">{eyebrow}</p>
        <h1 className="text-4xl font-semibold text-barber-cream">{title}</h1>
        <p className="mt-5 leading-7 text-barber-muted">{description}</p>
        {children}
      </div>
    </section>
  );
}
