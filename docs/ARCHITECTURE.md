# Patryk Barber - ETAP 1: fundament techniczny

## 1. Rekomendowana architektura aplikacji

Rekomendowana architektura: modularny monolit w Next.js App Router.

Stack:
- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma
- Tailwind CSS
- Zod
- auth oparty o konto klienta, haslo i weryfikacje email
- Server Components dla odczytow publicznych
- Server Actions albo Route Handlers dla mutacji
- Prisma jako jedyna warstwa dostepu do bazy

Podzial warstw:
- `app/` - routing, layouty, strony i route handlers
- `modules/` - logika funkcjonalna pogrupowana domenowo
- `server/` - infrastruktura serwerowa, Prisma, auth, mailer, konfiguracja
- `domain/` - enumy, typy i stale biznesowe
- `lib/` - male wspolne helpery bez wiedzy domenowej
- `prisma/` - schema, migracje i seed

Najwazniejsza zasada: UI nie powinien wykonywac bezposrednio zlozonej logiki biznesowej. Rezerwacje, limity, walidacja slotow, anulowanie i zmiana statusu powinny mieszkac w module `bookings`.

## 2. Struktura folderow

Docelowo utworzyc:

```txt
patbarber/
  app/
    (public)/
      page.tsx
      cennik/page.tsx
      galeria/page.tsx
      kontakt/page.tsx
    (auth)/
      logowanie/page.tsx
      rejestracja/page.tsx
      weryfikacja-email/page.tsx
      reset-hasla/page.tsx
    (customer)/
      konto/page.tsx
      konto/rezerwacje/page.tsx
      rezerwuj/page.tsx
    (admin)/
      admin/page.tsx
      admin/rezerwacje/page.tsx
      admin/klienci/page.tsx
      admin/uslugi/page.tsx
      admin/galeria/page.tsx
      admin/dostepnosc/page.tsx
      admin/wiadomosci/page.tsx
    api/
      auth/
      bookings/route.ts
      bookings/[id]/cancel/route.ts
      admin/bookings/route.ts
    layout.tsx
    globals.css
  docs/
    ARCHITECTURE.md
  prisma/
    schema.prisma
    seed.ts
  src/
    domain/
      enums.ts
      types.ts
    lib/
      date.ts
      money.ts
      validation.ts
    modules/
      auth/
        auth.service.ts
        auth.schemas.ts
      bookings/
        booking.service.ts
        booking.repository.ts
        booking.schemas.ts
        slot.service.ts
      services/
        service.repository.ts
        service.schemas.ts
      availability/
        availability.service.ts
        availability.schemas.ts
      gallery/
        gallery.repository.ts
        gallery.schemas.ts
      customers/
        customer.repository.ts
        customer-note.service.ts
      messaging/
        message.service.ts
      admin/
        admin.guard.ts
    server/
      config.ts
      db.ts
      mailer.ts
      password.ts
      session.ts
  .env.example
```

Pliki przygotowane w ETAPIE 1:
- `.env.example`
- `docs/ARCHITECTURE.md`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/domain/enums.ts`
- `src/domain/types.ts`

## 3. Model domenowy

Glowne zasady domenowe:
- aplikacja obsługuje jednego barbera i jedną lokalizację
- klient musi mieć konto
- klient musi mieć potwierdzony email przed rezerwacją
- telefon klienta jest opcjonalny, ale zalecany
- rezerwacje są automatycznie potwierdzane
- płatność odbywa się na miejscu
- domyslna wewnetrzna dlugosc slotu jest stala
- sloty startują o 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00 i 16:00
- ostatni slot zaczyna się o 16:00
- klient może anulować wizytę bez limitu czasowego
- klient może mieć maksymalnie 3 aktywne przyszłe rezerwacje
- admin może ręcznie dodać, edytować i anulować rezerwację
- admin może oznaczyć wizytę jako `completed` albo `no_show`
- admin może wysłać wiadomość do klienta

Encje:
- `User` - klient albo admin, dane logowania, dane kontaktowe i status emaila
- `Service` - usluga, cena w groszach, wewnetrzna konfiguracja slotow, widocznosc i kolejnosc
- `Booking` - rezerwacja konkretnego slotu i uslugi
- `BookingStatusHistory` - audyt zmian statusu rezerwacji
- `GalleryImage` - publiczna galeria zdjec
- `AvailabilityRule` - cykliczne reguly dostepnosci
- `AvailabilityException` - wyjatki: urlop, blokada, dodatkowy slot
- `CustomerNote` - prywatne notatki admina o kliencie
- `EmailVerificationToken` - token potwierdzenia emaila
- `PasswordResetToken` - token resetu hasla

## 4. Prisma schema dla MVP

Pelny schemat znajduje sie w `prisma/schema.prisma`.

Kluczowe decyzje:
- pieniadze przechowywane sa jako `priceCents`
- statusy rezerwacji sa enumem, nie luznym tekstem
- historia statusow przechowuje aktora zmiany i powod
- tokeny sa hashowane w bazie przez `tokenHash`
- soft delete dla klientow przez `deletedAt`
- publiczne sortowanie uslug i galerii przez `sortOrder`
- pojedynczy aktywny slot jest chroniony unikalnym `activeSlotKey`

## 5. Enumy i kluczowe typy domenowe

Typy przygotowane w:
- `src/domain/enums.ts`
- `src/domain/types.ts`

Najwazniejsze enumy:
- `UserRole`
- `BookingStatus`
- `BookingActorType`
- `AvailabilityExceptionType`
- `MessageChannel`

## 6. Seed admina i uslug startowych

Seed znajduje sie w `prisma/seed.ts`.

Tworzy albo aktualizuje:
- admina: `spontan2wz@gmail.com`
- uslugi startowe:
  - Strzyzenie meskie klasyczne - 60 PLN
  - Strzyzenie meskie - 70 PLN
  - Strzyzenie dlugich wlosow - 80 PLN
  - Trymowanie i kontur brody - 40 PLN
  - Combo - 110 PLN
  - Pakiet ojciec + syn - 110 PLN
- domyslna dostepnosc: poniedzialek-piatek sloty 09:00-16:00, sobota sloty 09:00-13:00

Seed wymaga zmiennej:
- `ADMIN_INITIAL_PASSWORD`

## 7. Wymagane zmienne `.env`

Zobacz `.env.example`.

Minimalnie wymagane:
- `DATABASE_URL`
- `DIRECT_URL`
- `APP_URL`
- `APP_ENV`
- `SESSION_SECRET`
- `PASSWORD_PEPPER`
- `ADMIN_EMAIL`
- `ADMIN_INITIAL_PASSWORD`
- `MAIL_FROM`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`

Dane publiczne firmy:
- `NEXT_PUBLIC_BUSINESS_NAME`
- `NEXT_PUBLIC_BUSINESS_ADDRESS`
- `NEXT_PUBLIC_BUSINESS_PHONE`
- `NEXT_PUBLIC_BUSINESS_EMAIL`
- `NEXT_PUBLIC_INSTAGRAM_HANDLE`
- `NEXT_PUBLIC_FACEBOOK_NAME`

## 8. Plan route groups / sciezek w Next.js App Router

Publiczne:
- `/` - strona glowna premium/dark/barber shop
- `/cennik` - uslugi i ceny
- `/galeria` - zdjecia realizacji
- `/kontakt` - dane kontaktowe, mapa, social media

Auth:
- `/logowanie`
- `/rejestracja`
- `/weryfikacja-email`
- `/reset-hasla`

Klient:
- `/konto`
- `/konto/rezerwacje`
- `/rezerwuj`

Admin:
- `/admin`
- `/admin/rezerwacje`
- `/admin/klienci`
- `/admin/uslugi`
- `/admin/galeria`
- `/admin/dostepnosc`
- `/admin/wiadomosci`

API / Route Handlers:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/verify-email`
- `POST /api/auth/password-reset/request`
- `POST /api/auth/password-reset/confirm`
- `GET /api/services`
- `GET /api/availability/slots`
- `POST /api/bookings`
- `POST /api/bookings/:id/cancel`
- `GET /api/customer/bookings`
- `GET /api/admin/bookings`
- `POST /api/admin/bookings`
- `PATCH /api/admin/bookings/:id`
- `POST /api/admin/bookings/:id/cancel`
- `POST /api/admin/bookings/:id/complete`
- `POST /api/admin/bookings/:id/no-show`
- `POST /api/admin/customers/:id/notes`
- `POST /api/admin/messages`

## 9. Moduly aplikacji i odpowiedzialnosci

`auth`
- rejestracja, logowanie, sesja, hashowanie hasel
- weryfikacja emaila
- reset hasla
- guardy klient/admin

`users/customers`
- profil klienta
- aktualizacja telefonu i danych kontaktowych
- limit aktywnych rezerwacji klienta
- notatki admina

`services`
- lista uslug
- ceny, aktywnosc, sortowanie i wewnetrzna konfiguracja slotow
- walidacja, czy usluga moze byc rezerwowana

`availability`
- reguly godzin pracy
- wyjatki dostepnosci
- generowanie slotow dla kalendarza
- blokady administracyjne

`bookings`
- tworzenie rezerwacji
- anulowanie przez klienta i admina
- edycja przez admina
- zmiany statusu
- historia statusow
- ochrona przed podwojna rezerwacja

`gallery`
- publiczne zdjecia
- panel zarzadzania zdjeciami
- sortowanie i widocznosc

`messaging`
- wysylka emaili systemowych
- wiadomosc admina do klienta
- szablony: weryfikacja emaila, reset hasla, potwierdzenie rezerwacji, anulowanie

`admin`
- guard admina
- dashboard
- operacje reczne na rezerwacjach, klientach, uslugach i dostepnosci

`shared/lib`
- daty, waluty, walidacje, formatowanie, stale

## 10. Strategia ochrony przed podwojna rezerwacja slotu

Ochrona powinna miec kilka warstw.

Warstwa 1: walidacja aplikacyjna
- slot musi byc jednym z dozwolonych startow: 09:00-16:00
- slot musi wynikac z `AvailabilityRule`
- slot nie moze byc zablokowany przez `AvailabilityException`
- klient musi miec potwierdzony email
- klient nie moze przekroczyc 3 aktywnych przyszlych rezerwacji
- usluga musi byc aktywna

Warstwa 2: transakcja bazy danych
- tworzenie rezerwacji zawsze przez `prisma.$transaction`
- wewnatrz transakcji ponownie sprawdzic limit klienta i zajetosc slotu
- zalecany poziom izolacji: `Serializable`
- na konflikt zwrocic polski komunikat: "Ten termin zostal juz zajety. Wybierz inna godzine."

Warstwa 3: constraint w bazie
- dla MVP, przy stalej siatce slotow, uzywamy unikalnego pola `activeSlotKey`
- status aktywny to `confirmed`
- dla rezerwacji `confirmed` pole `activeSlotKey` ma wartość deterministyczną, np. `2026-07-01T09:00:00.000Z`
- przy anulowaniu, `completed` albo `no_show` pole `activeSlotKey` jest ustawiane na `null`
- PostgreSQL pozwala na wiele wartości `null` w unikalnym indeksie, więc historia anulowanych wizyt nie blokuje ponownej rezerwacji slotu

W Prisma:

```prisma
activeSlotKey String? @unique
```

Warstwa 4: docelowe zabezpieczenie PostgreSQL dla zmiennej dlugosci slotow
- jesli pozniej uslugi beda mialy rozne dlugosci, dodac migracje SQL z exclusion constraint na zakres:

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "bookings"
ADD CONSTRAINT "bookings_no_confirmed_overlap"
EXCLUDE USING gist (
  tstzrange("startAt", "endAt", '[)') WITH &&
)
WHERE ("status" = 'confirmed');
```

To zabezpiecza nie tylko identyczne starty, ale tez nachodzace na siebie zakresy.

## ETAP 2

ETAP 2 powinien obejmować:
- scaffold projektu Next.js z TypeScript, Tailwind, Prisma i Zod
- konfiguracje `prisma generate`, migracji i seeda
- konfiguracje `server/db.ts`, `server/config.ts`, hashowania hasel i sesji
- podstawowy auth: rejestracja, logowanie, logout, weryfikacja emaila
- implementacje serwisow domenowych bez UI: `services`, `availability`, `bookings`
- testy jednostkowe logiki rezerwacji, limitu 3 przyszlych wizyt i ochrony przed konfliktem slotu
- minimalne route handlers dla uslug, slotow i tworzenia/anulowania rezerwacji
