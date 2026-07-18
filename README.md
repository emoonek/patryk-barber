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
5. Skopiuj `API Secret` do `CLOUDINARY_API_SECRET`. Jeśli Cloudinary ukrywa sekret, kliknij opcję pokazania albo skopiowania sekretu.
6. W `CLOUDINARY_FOLDER` wpisz folder dla galerii, np. `patbarber/gallery`. Folder zostanie użyty jako miejsce uploadu i będzie częścią `public_id`.

Pliku `.env` nie wolno commitować. Prawdziwe wartości sekretów powinny zostać tylko lokalnie i w konfiguracji środowiska produkcyjnego.

Test uploadu lokalnie:

1. Uzupełnij zmienne `CLOUDINARY_*` w `.env`.
2. Uruchom aplikację ponownie, żeby Next.js wczytał nowe env:

```bash
npm run dev
```

3. Wejdź na `http://localhost:3000/admin/galeria`.
4. Sprawdź, czy panel pokazuje status `Cloudinary skonfigurowane`.
5. Wybierz plik JPG, PNG albo WebP do 5 MB.
6. Uzupełnij opis w `Alt text` albo `Caption`.
7. Kliknij `Dodaj zdjęcie`.
8. Sprawdź, czy nowe zdjęcie ma źródło `Storage` i czy pojawia się na `/galeria`.
9. W Cloudinary sprawdź, czy plik trafił do folderu z `CLOUDINARY_FOLDER`.

Maksymalny rozmiar uploadu to 5 MB. Jeśli Cloudinary nie jest skonfigurowane, panel admina pokazuje status konfiguracji i zwraca czytelny błąd bez ujawniania sekretów.

### Checklist testu uploadu z telefonu

- Telefon i komputer są w tej samej sieci Wi-Fi.
- Uruchom lokalnie dev server na hoście dostępnym z telefonu, np. `npm run dev -- --hostname 0.0.0.0`.
- Na telefonie otwórz adres komputera w sieci lokalnej, np. `http://192.168.1.10:3000/admin/galeria`.
- Zaloguj się jako admin.
- Potwierdź status `Cloudinary skonfigurowane`.
- Wybierz zdjęcie z galerii telefonu w formacie JPG, PNG albo WebP.
- Potwierdź, że formularz nie wymusza aparatu.
- Dodaj opis i kliknij `Dodaj zdjęcie`.
- Sprawdź miniaturę w panelu admina.
- Otwórz `/galeria` na telefonie i sprawdź, czy zdjęcie ładuje się poprawnie.
- Usuń testowe zdjęcie z panelu admina i sprawdź, czy znika z galerii.

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

## ETAP 14

Następny etap powinien skupić się na produkcyjnym QA i przygotowaniu wdrożenia: testach end-to-end kluczowych ścieżek, konfiguracji hostingu, domeny, SMTP/Resend, Cloudinary, monitoringu błędów oraz decyzji, czy MVP idzie live bez płatności online.
