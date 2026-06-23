# Patryk Barber

Aplikacja webowa dla barbera: publiczna strona premium, system rezerwacji, konta klientów i panel admina.

## Stack

- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma
- Tailwind CSS
- Zod

## Uruchomienie lokalnie

1. Zainstaluj zależności:

```bash
npm install
```

2. Skopiuj konfigurację środowiska:

```bash
cp .env.example .env
```

3. Uzupełnij `.env`, szczególnie:

- `DATABASE_URL`
- `DIRECT_URL`
- `SESSION_SECRET`
- `PASSWORD_PEPPER`
- `ADMIN_INITIAL_PASSWORD`
- dane SMTP

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

7. Uruchom seed:

```bash
npm run db:seed
```

8. Uruchom aplikację:

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`.

## Obecny zakres

ETAP 2 zawiera fundament projektu: konfigurację Next.js, TypeScript, Tailwind, Prisma Client, podstawowe strony, placeholder modułu auth oraz walidacje Zod.

Pełne logowanie, rejestracja, booking engine i panel admina nie są jeszcze zaimplementowane.
