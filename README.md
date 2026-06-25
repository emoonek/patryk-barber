# Patryk Barber

Aplikacja webowa dla barbera: publiczna strona premium, konta klientów, panel admina i w kolejnych etapach system rezerwacji.

## Stack

- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma
- Tailwind CSS
- Zod
- bcryptjs

## Auth w ETAPIE 3

Zaimplementowany jest podstawowy system auth bez rozbudowanego UI:

- rejestracja klienta przez `/rejestracja`,
- walidacja Zod: imię, nazwisko, email, hasło, opcjonalny telefon i akceptacja regulaminu,
- hashowanie hasła przez `bcryptjs`,
- zapis użytkownika z rolą `customer` w Prisma, czyli odpowiednikiem biznesowej roli `CUSTOMER`,
- `emailVerifiedAt` zostaje `null` do czasu wejścia w link weryfikacyjny,
- logowanie przez `/logowanie`,
- podpisywana sesja w ciasteczku `patbarber_session`,
- wylogowanie z poziomu `/konto`,
- ochrona `/konto` przez `requireAuth`,
- ochrona `/admin` przez `requireAdmin`,
- weryfikacja emaila przez `/weryfikacja-email/[token]`,
- reset hasła przez `/zapomnialem-hasla` i `/reset-hasla/[token]`.

Wysyłka emaili nie jest jeszcze podłączona. Link weryfikacji emaila i link resetu hasła są w trybie dev wypisywane w konsoli procesu `npm run dev`.

## Wymagane zmienne `.env`

Minimalnie potrzebne są:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/patbarber?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/patbarber?schema=public"
APP_URL="http://localhost:3000"
SESSION_SECRET="replace-with-at-least-32-random-characters"
PASSWORD_PEPPER="replace-with-random-password-pepper"
ADMIN_EMAIL="spontan2wz@gmail.com"
ADMIN_INITIAL_PASSWORD="change-me-before-seed"
```

Zmienne SMTP i `MAIL_FROM` mogą zostać w `.env.example`, ale w ETAPIE 3 nie są jeszcze używane przez aplikację.

## Cloudinary i galeria

Panel `/admin/galeria` obsługuje dwa sposoby dodawania zdjęć:

- upload pliku JPG, PNG albo WebP do Cloudinary,
- ręczne wpisanie `imageUrl` jako fallback developerski, np. `/galeria-testowa/nazwa-pliku.png`.

Upload wymaga tych zmiennych w `.env`:

```env
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
CLOUDINARY_FOLDER="patbarber/gallery"
```

Nie commituj prawdziwych sekretów Cloudinary. `CLOUDINARY_FOLDER` jest opcjonalny, ale pomaga trzymać zdjęcia galerii w jednym folderze. Po uploadzie aplikacja zapisuje publiczny URL w `imageUrl`, miniaturkę w `thumbnailUrl` i `public_id` Cloudinary w `storageKey`. Rekordy dodane ręcznie przez `imageUrl` nie muszą mieć `storageKey`; przy ich usuwaniu kasowany jest tylko rekord w bazie.

Walidacja uploadu odbywa się po stronie serwera: dozwolone są `image/jpeg`, `image/png` i `image/webp`, a maksymalny rozmiar pliku to 5 MB. Jeśli konfiguracja Cloudinary nie jest uzupełniona, upload albo usunięcie zdjęcia ze storage zwróci czytelny błąd w panelu admina zamiast wyłożyć całą aplikację.

## Lokalna baza danych

Projekt używa PostgreSQL. Jeśli nie masz lokalnej bazy, najprościej uruchomić ją przez Docker:

```bash
docker run --name patbarber-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=patbarber -p 5432:5432 -d postgres:16
```

Jeśli kontener już istnieje:

```bash
docker start patbarber-postgres
```

Potem upewnij się, że `DATABASE_URL` i `DIRECT_URL` w `.env` wskazują na tę bazę.

## Uruchomienie lokalnie

1. Zainstaluj zależności:

```bash
npm install
```

2. Skopiuj konfigurację środowiska:

```bash
cp .env.example .env
```

3. Uzupełnij `.env`.

4. Wygeneruj Prisma Client:

```bash
npm run prisma:generate
```

5. Sprawdź schemat Prisma:

```bash
npm run prisma:validate
```

6. Uruchom migrację lokalną:

```bash
npm run prisma:migrate
```

7. Uruchom seed, który tworzy konto admina i podstawowe dane:

```bash
npm run db:seed
```

8. Uruchom aplikację:

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`.

## Przydatne komendy

```bash
npm run typecheck
npm run lint
npm run build
npm run prisma:studio
```

## ETAP 4

Następny etap powinien objąć booking engine: usługi, dostępne terminy, tworzenie rezerwacji przez klienta, blokowanie zajętych slotów i podstawowe widoki rezerwacji w koncie klienta oraz panelu admina.
