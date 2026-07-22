type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <section className="chrome-page-shell grid min-h-[calc(100vh-73px)] content-center px-5 py-14 md:px-10 md:py-20">
      <div className="frosted-panel mx-auto w-full max-w-xl p-6 md:p-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-barber-silver">{eyebrow}</p>
        <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-black uppercase leading-[0.95] text-barber-frost">{title}</h1>
        <p className="mt-5 leading-7 text-barber-silver">{description}</p>
        {children}
      </div>
    </section>
  );
}
