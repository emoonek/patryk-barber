# Patryk Barber

Aplikacja MVP dla salonu Patryk Barber: publiczna strona, konta klientów, rezerwacje online, panel admina, galeria i maile transakcyjne. Płatności online nie są częścią MVP. Klient płaci na miejscu w salonie.

## Stack

- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma
- Tailwind CSS
- Zod
- bcryptjs

## Wymagane zmienne `.env`

Aktualny komplet zmiennych znajduje się w `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/patbarber?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/patbarber?schema=public"
APP_URL="http://localhost:3000"
APP_ENV="development"
SESSION_SECRET="replace-with-long-random-secret"
PASSWORD_PEPPER="replace-with-long-random-pepper"
ADMIN_EMAIL="spontan2wz@gmail.com"
ADMIN_INITIAL_PASSWORD="change-me-before-seed"
MAIL_FROM="Patryk Barber <spontan2wz@gmail.com>"
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASSWORD=""
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
CLOUDINARY_FOLDER="patbarber/gallery"
NEXT_PUBLIC_BUSINESS_NAME="Patryk Barber"
NEXT_PUBLIC_BUSINESS_ADDRESS="Ul. Zwycięstwa 28, 11-710 Piecki"
NEXT_PUBLIC_BUSINESS_PHONE="+48 575 088 360"
NEXT_PUBLIC_BUSINESS_EMAIL="spontan2wz@gmail.com"
NEXT_PUBLIC_INSTAGRAM_HANDLE="@patrykbarber"
NEXT_PUBLIC_FACEBOOK_NAME="Patryk Barber"
```

Nie commituj prawdziwych sekretów produkcyjnych.

## Uruchomienie lokalne

1. Zainstaluj zależności:

```bash
npm install
```

2. Skopiuj konfigurację:

```bash
cp .env.example .env
```

3. Uzupełnij `.env`, szczególnie `SESSION_SECRET`, `PASSWORD_PEPPER`, `ADMIN_EMAIL` i `ADMIN_INITIAL_PASSWORD`.

4. Uruchom aplikację:

```bash
npm run dev
```

Aplikacja będzie dostępna pod `http://localhost:3000`.

## Docker/Postgres

Jeśli nie masz lokalnej bazy PostgreSQL, uruchom ją przez Docker:

```bash
docker run --name patbarber-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=patbarber -p 5432:5432 -d postgres:16
```

Jeśli kontener już istnieje:

```bash
docker start patbarber-postgres
```

`DATABASE_URL` i `DIRECT_URL` powinny wskazywać na tę bazę.

## Migracje

Po uruchomieniu bazy:

```bash
npm run prisma:generate
npm run prisma:validate
npm run prisma:migrate
```

## Seed

Seed tworzy konto admina i podstawowe dane:

```bash
npm run db:seed
```

Hasło startowe admina pochodzi z `ADMIN_INITIAL_PASSWORD`. Przed produkcją trzeba je zmienić.

## Dev maile

Email service obsługuje:

- weryfikację adresu email,
- ponowne wysłanie linku weryfikacyjnego,
- reset hasła,
- potwierdzenie i anulowanie rezerwacji,
- powiadomienia admina,
- wiadomości admina do klienta.

W development puste `SMTP_HOST`, `SMTP_USER` albo `SMTP_PASSWORD` włączają fallback do konsoli procesu `npm run dev`. W production pełna konfiguracja SMTP albo Resend jest wymagana.

## Cloudinary

Panel `/admin/galeria` obsługuje upload JPG, PNG i WebP do Cloudinary oraz ręczny `imageUrl` jako fallback developerski.

Wymagane zmienne:

```env
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
CLOUDINARY_FOLDER="patbarber/gallery"
```

Maksymalny rozmiar uploadu to 5 MB. Jeśli Cloudinary nie jest skonfigurowane, panel admina zwraca czytelny błąd zamiast szczegółów technicznych.

## Bezpieczeństwo MVP

- Hasła są hashowane przez `bcryptjs` z dodatkowym `PASSWORD_PEPPER`.
- Sesja jest podpisywana i trzymana w ciasteczku `httpOnly`.
- Rezerwacje wymagają konta i zweryfikowanego adresu email.
- Klient zablokowany może się zalogować, ale nie może tworzyć nowych rezerwacji.
- Limit aktywnych przyszłych rezerwacji klienta wynosi 3.
- Logowanie, rejestracja, reset hasła, ponowna weryfikacja emaila i tworzenie rezerwacji mają prosty rate limiting po stronie serwera.
- Rate limiting jest in-memory dla MVP/development. Produkcyjnie warto użyć Redis albo Upstash, szczególnie przy wielu instancjach aplikacji.

## Dokumenty prawne MVP

Strony `/regulamin-rezerwacji` i `/polityka-prywatnosci` są roboczymi wersjami dla MVP. Finalna treść regulaminu i polityki prywatności powinna zostać zweryfikowana przed produkcją przez właściciela salonu i, jeśli to potrzebne, przez prawnika.

## Przydatne komendy

```bash
npm run typecheck
npm run lint
npm run build
npm run prisma:studio
```

## Deployment checklist

- Ustaw prawdziwą produkcyjną bazę danych.
- Ustaw silne `SESSION_SECRET` i `PASSWORD_PEPPER`.
- Skonfiguruj prawdziwy SMTP albo Resend.
- Uzupełnij zmienne Cloudinary.
- Zmień hasło admina po seedzie.
- Ustaw domenę i poprawne `APP_URL`.
- Wykonaj test rezerwacji klienta.
- Wykonaj test maili transakcyjnych.
- Wykonaj test uploadu galerii.
- Wykonaj test mobile dla rejestracji, logowania, rezerwacji i panelu admina.
- Zweryfikuj finalny regulamin i politykę prywatności przed publikacją.

## ETAP 13

Następny etap powinien skupić się na produkcyjnym QA i przygotowaniu wdrożenia: testach end-to-end kluczowych ścieżek, konfiguracji hostingu, domeny, SMTP/Resend, Cloudinary, monitoringu błędów oraz decyzji, czy MVP idzie live bez płatności online.
