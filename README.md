# Patryk Barber

Aplikacja MVP dla salonu Patryk Barber: publiczna strona, konta klientow, rezerwacje online, panel admina, galeria, Cloudinary i maile transakcyjne. Platnosci online oraz SMS nie sa czescia MVP.

## Stack

- Next.js App Router + TypeScript
- PostgreSQL + Prisma
- Tailwind CSS
- Zod
- bcryptjs
- Cloudinary
- Email provider: console, Resend albo SMTP

## Local setup

```bash
npm install
cp .env.example .env
```

Uzupelnij lokalny `.env`. Pliku `.env` nie wolno commitowac ani pokazywac w logach lub UI. Prawdziwe sekrety trzymaj tylko lokalnie i w konfiguracji srodowiska produkcyjnego.

## Docker PostgreSQL

Jesli nie masz lokalnego PostgreSQL:

```bash
docker run --name patbarber-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=patbarber -p 5432:5432 -d postgres:16
```

Jesli kontener juz istnieje:

```bash
docker start patbarber-postgres
```

Domyslne lokalne adresy z `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/patbarber?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/patbarber?schema=public"
```

## Prisma migrate/seed

```bash
npm run prisma:generate
npm run prisma:validate
npm run prisma:migrate
npm run db:seed
```

Seed tworzy konto admina, finalne uslugi z plakatu, godziny pracy i galerie z `public/ig`. Haslo startowe admina pochodzi z `ADMIN_INITIAL_PASSWORD`. W production musi byc mocne i trzeba je zmienic po pierwszym logowaniu.

## Dev server

```bash
npm run dev
```

Aplikacja lokalnie dziala pod `http://localhost:3000`.

## Env

Kompletny wzor znajduje sie w `.env.example`. Najwazniejsze grupy:

- App/database: `DATABASE_URL`, `DIRECT_URL`, `APP_URL`, `APP_ENV`.
- Security: `SESSION_SECRET`, `PASSWORD_PEPPER`.
- Admin seed: `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD`.
- Email: `EMAIL_PROVIDER`, `RESEND_API_KEY`, `MAIL_FROM`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`.
- Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER`.
- Public business data: `NEXT_PUBLIC_BUSINESS_NAME`, `NEXT_PUBLIC_BUSINESS_ADDRESS`, `NEXT_PUBLIC_BUSINESS_PHONE`, `NEXT_PUBLIC_BUSINESS_EMAIL`, `NEXT_PUBLIC_INSTAGRAM_HANDLE`, `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_FACEBOOK_NAME`, `NEXT_PUBLIC_FACEBOOK_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_URL`.

Finalne dane publiczne przed deployem:

- Telefon: `513296426`.
- Adres: `ul. Zwycięstwa 28/4, 11-710 Piecki`.
- Instagram: `@patrykbarber`.
- Godziny salonu: poniedzialek-piatek 9:00-17:00, sobota 9:00-14:00, niedziela nieczynne.
- Aktywny cennik po seedzie: Strzyzenie meskie klasyczne 60 PLN; Strzyzenie meskie 70 PLN; Strzyzenie dlugich wlosow 80 PLN; Trymowanie i kontur brody 40 PLN; Combo 110 PLN; Pakiet ojciec + syn 110 PLN.

Production safety:

- `EMAIL_PROVIDER="console"` jest dozwolony tylko poza production.
- `EMAIL_PROVIDER="resend"` wymaga `RESEND_API_KEY` i `MAIL_FROM`.
- `SESSION_SECRET` i `PASSWORD_PEPPER` powinny miec co najmniej 32 losowe znaki.
- Sekrety nie powinny byc logowane ani wyswietlane w UI.

## Cloudinary

Panel `/admin/galeria` obsluguje upload JPG, PNG i WebP do Cloudinary oraz reczny `imageUrl` jako fallback developerski.

Wymagane zmienne:

```env
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
CLOUDINARY_FOLDER="patbarber/gallery"
```

Test lokalny:

1. Uzupelnij `CLOUDINARY_*` w `.env`.
2. Uruchom ponownie dev server.
3. Wejdz na `/admin/galeria`.
4. Sprawdz status konfiguracji.
5. Dodaj zdjecie do 5 MB i potwierdz, ze pojawia sie na `/galeria`.

## Email provider

`EMAIL_PROVIDER` moze miec wartosc:

- `console` - tylko development; wypisuje tresc maila w konsoli procesu.
- `resend` - rekomendowany provider produkcyjny.
- `smtp` - techniczny fallback przez SMTP/nodemailer.

Dla Resend ustaw:

```env
EMAIL_PROVIDER="resend"
RESEND_API_KEY=""
MAIL_FROM="Patryk Barber <noreply@twojadomena.pl>"
APP_URL="https://twojadomena.pl"
```

Do produkcyjnej wysylki potrzebna jest zweryfikowana domena w Resend.

## Test maili

1. Zaloguj sie jako admin.
2. Wejdz na `/admin/email-test`.
3. Zostaw odbiorce pustego, aby uzyc `ADMIN_EMAIL`, albo wpisz adres testowy.
4. Kliknij wysylke testowa.
5. Sprawdz komunikat w panelu i log providera.

## Przydatne komendy

```bash
npm run typecheck
npm run lint
npm run build
npm run verify
npm run prisma:studio
```

`npm run verify` uruchamia typecheck, lint i build.

## Dokumentacja deploy/QA

- [QA checklist](docs/QA_CHECKLIST.md)
- [Deployment checklist](docs/DEPLOYMENT_CHECKLIST.md)

Przed produkcja przejdz checklisty, ustaw produkcyjne env, uruchom migracje przez `prisma migrate deploy`, wykonaj seed admina i zrob smoke test rezerwacji, maili oraz galerii.
