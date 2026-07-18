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
- Resend / SMTP / console email provider

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
EMAIL_PROVIDER="console"
RESEND_API_KEY=""
MAIL_FROM="Patryk Barber <noreply@example.com>"
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

Pliku `.env` nie wolno commitować. Prawdziwe sekrety powinny być tylko lokalnie i w konfiguracji środowiska produkcyjnego.

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

## Maile transakcyjne

Email service obsługuje:

- weryfikację adresu email,
- ponowne wysłanie linku weryfikacyjnego,
- reset hasła,
- potwierdzenie i anulowanie rezerwacji,
- powiadomienia admina,
- wiadomości admina do klienta,
- testowego maila z panelu admina.

Provider wybiera zmienna `EMAIL_PROVIDER`:

- `console` - developmentowy fallback, wypisuje treść maila i linki w konsoli procesu `npm run dev`,
- `resend` - główny provider produkcyjny,
- `smtp` - opcjonalny fallback techniczny przez SMTP/nodemailer.

W development można używać `EMAIL_PROVIDER="console"`. W production `EMAIL_PROVIDER="console"` jest blokowany. Dla `EMAIL_PROVIDER="resend"` wymagane są `RESEND_API_KEY` i `MAIL_FROM`. Dla `EMAIL_PROVIDER="smtp"` wymagane są `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` i `MAIL_FROM`.

### Konfiguracja Resend

1. Załóż konto na [resend.com](https://resend.com).
2. W panelu Resend przejdź do sekcji API Keys.
3. Utwórz API key dla aplikacji i wklej go do `RESEND_API_KEY`.
4. Ustaw `EMAIL_PROVIDER="resend"`.
5. Ustaw `MAIL_FROM`, np. `Patryk Barber <noreply@twojadomena.pl>`.
6. Ustaw poprawne `APP_URL`, bo linki weryfikacji i resetu hasła korzystają z tej zmiennej.
7. Do produkcyjnej wysyłki do klientów potrzebna będzie zweryfikowana domena w Resend. Bez tego wysyłka może działać tylko w ograniczonym trybie testowym.

Po zmianie `.env` uruchom aplikację ponownie, żeby Next.js wczytał nowe zmienne.

### Test maila

1. Zaloguj się jako admin.
2. Wejdź na `/admin/email-test`.
3. Zostaw odbiorcę pustego, żeby wysłać test na `ADMIN_EMAIL`, albo wpisz własny adres.
4. Kliknij `Wyślij test`.
5. Panel pokaże wynik: wysłano, błąd konfiguracji albo błąd providera.

Sekrety nie są pokazywane w UI. `RESEND_API_KEY` jest używany tylko po stronie serwera i nie jest logowany.

## Cloudinary

Panel `/admin/galeria` obsługuje upload JPG, PNG i WebP do Cloudinary oraz ręczny `imageUrl` jako fallback developerski.

Wymagane zmienne:

```env
CLOUDINARY_CLOUD_NAME="twoj-cloud-name"
CLOUDINARY_API_KEY="twoj-api-key"
CLOUDINARY_API_SECRET="twoj-api-secret"
CLOUDINARY_FOLDER="patbarber/gallery"
```

Gdzie znaleźć wartości w Cloudinary:

1. Zaloguj się do Cloudinary.
2. Wejdź w `Dashboard`.
3. Skopiuj `Cloud name` do `CLOUDINARY_CLOUD_NAME`.
4. Skopiuj `API Key` do `CLOUDINARY_API_KEY`.
5. Skopiuj `API Secret` do `CLOUDINARY_API_SECRET`.
6. W `CLOUDINARY_FOLDER` wpisz folder dla galerii, np. `patbarber/gallery`.

Test uploadu lokalnie:

1. Uzupełnij zmienne `CLOUDINARY_*` w `.env`.
2. Uruchom aplikację ponownie.
3. Wejdź na `http://localhost:3000/admin/galeria`.
4. Sprawdź, czy panel pokazuje status `Cloudinary skonfigurowane`.
5. Wybierz plik JPG, PNG albo WebP do 5 MB.
6. Uzupełnij opis w `Alt text` albo `Caption`.
7. Kliknij `Dodaj zdjęcie`.
8. Sprawdź, czy nowe zdjęcie ma źródło `Storage` i pojawia się na `/galeria`.

## Bezpieczeństwo MVP

- Hasła są hashowane przez `bcryptjs` z dodatkowym `PASSWORD_PEPPER`.
- Sesja jest podpisywana i trzymana w ciasteczku `httpOnly`.
- Rezerwacje wymagają konta i zweryfikowanego adresu email.
- Klient zablokowany może się zalogować, ale nie może tworzyć nowych rezerwacji.
- Limit aktywnych przyszłych rezerwacji klienta wynosi 3.
- Logowanie, rejestracja, reset hasła, ponowna weryfikacja emaila i tworzenie rezerwacji mają prosty rate limiting po stronie serwera.
- Rate limiting jest in-memory dla MVP/development. Produkcyjnie warto użyć Redis albo Upstash, szczególnie przy wielu instancjach aplikacji.
- Błędy wysyłki maili rezerwacyjnych są logowane, ale nie cofają zapisu rezerwacji.
- Błędy providerów email nie są pokazywane klientom z detalami technicznymi.

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
- Skonfiguruj `EMAIL_PROVIDER="resend"` i zweryfikowaną domenę w Resend.
- Uzupełnij zmienne Cloudinary.
- Zmień hasło admina po seedzie.
- Ustaw domenę i poprawne `APP_URL`.
- Wykonaj test rezerwacji klienta.
- Wykonaj test maili transakcyjnych przez `/admin/email-test`.
- Wykonaj test uploadu galerii.
- Wykonaj test mobile dla rejestracji, logowania, rezerwacji i panelu admina.
- Zweryfikuj finalny regulamin i politykę prywatności przed publikacją.

## ETAP 15

Następny etap powinien skupić się na produkcyjnym QA i przygotowaniu wdrożenia: testach end-to-end kluczowych ścieżek, konfiguracji hostingu, domeny, Resend, Cloudinary, monitoringu błędów oraz decyzji, czy MVP idzie live bez płatności online.
