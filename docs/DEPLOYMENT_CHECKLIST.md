# Deployment checklist

Nie wykonuj deploya bez przejscia tej listy i QA checklisty.

## Przed deployem

- [ ] GitHub zawiera aktualny kod z galezi przeznaczonej do produkcji.
- [ ] `npm run verify` przechodzi lokalnie lub w CI.
- [ ] `.env` nie jest commitowany.
- [ ] Vercel project jest utworzony i podpiety do repozytorium.
- [ ] Neon database jest utworzona dla produkcji.
- [ ] `DATABASE_URL` wskazuje production pooled connection, jesli Neon/Vercel tego wymaga.
- [ ] `DIRECT_URL` wskazuje direct connection do migracji Prisma.
- [ ] `APP_ENV="production"`.
- [ ] `APP_URL` wskazuje finalny adres produkcyjny, np. `https://twojadomena.pl`.
- [ ] `SESSION_SECRET` ma co najmniej 32 losowe znaki.
- [ ] `PASSWORD_PEPPER` ma co najmniej 32 losowe znaki.
- [ ] `ADMIN_EMAIL` wskazuje prawdziwy adres admina.
- [ ] `ADMIN_INITIAL_PASSWORD` jest mocnym haslem tymczasowym.
- [ ] Cloudinary env jest kompletne: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER`.
- [ ] Resend env jest kompletne: `EMAIL_PROVIDER="resend"`, `RESEND_API_KEY`, `MAIL_FROM`.
- [ ] Publiczne dane produkcyjne sa finalne: telefon `513296426`, adres `ul. Zwyciestwa 28/4, 11-710 Piecki`, Instagram `@patrykbarber`.
- [ ] Social/map env jest finalne: `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_FACEBOOK_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_URL`.
- [ ] Domena wysylkowa jest zweryfikowana w Resend.
- [ ] Domena publiczna jest dodana w Vercel.
- [ ] DNS domeny wskazuje na Vercel.

## Migracje i seed

- [ ] Uruchom `npx prisma migrate deploy` na produkcyjnej bazie.
- [ ] Uruchom `npm run db:seed` tylko po ustawieniu produkcyjnych env.
- [ ] Zaloguj sie jako admin.
- [ ] Zmien haslo admina po pierwszym logowaniu.
- [ ] Sprawdz, czy aktywny cennik ma dokladnie 6 pozycji z plakatu i godziny salonu sa poprawne.
- [ ] Sprawdz, czy galeria seedowana uzywa zdjec z `public/ig`, a stare `/galeria-testowa/*` nie sa aktywne.

## Smoke test po deployu

- [ ] `/` laduje sie na domenie produkcyjnej.
- [ ] `/galeria` pokazuje galerie albo czytelny pusty stan.
- [ ] `/kontakt` ma poprawne dane.
- [ ] `/kontakt` pokazuje godziny: poniedzialek-piatek 9:00-17:00, sobota 9:00-14:00, niedziela nieczynne.
- [ ] Linki Instagram, Facebook i Google Maps otwieraja poprawne zewnetrzne adresy.
- [ ] Rejestracja tworzy konto.
- [ ] Email weryfikacyjny dochodzi do klienta.
- [ ] Logowanie dziala po weryfikacji.
- [ ] Reset hasla dziala.
- [ ] Rezerwacja klienta tworzy termin i blokuje slot.
- [ ] Anulowanie klienta zwalnia slot.
- [ ] Admin widzi rezerwacje na `/admin/rezerwacje`.
- [ ] Admin widzi rezerwacje na `/admin/kalendarz`.
- [ ] `/admin/email-test` wysyla mail przez Resend.
- [ ] Upload zdjecia w `/admin/galeria` dziala.

## Backup, restore i rollback

- [ ] TODO: opisac cykliczny backup bazy Neon.
- [ ] TODO: przetestowac restore bazy na osobnym srodowisku.
- [ ] TODO: opisac retencje backupow.
- [ ] Rollback aplikacji: wroc do poprzedniego deploya w Vercel.
- [ ] Rollback bazy: nie cofaj migracji bez osobnego planu; przy krytycznym bledzie przywroc backup albo przygotuj migracje naprawcza.

## Po deployu

- [ ] Sprawdz logi Vercel po smoke tescie.
- [ ] Sprawdz logi Resend dla maili transakcyjnych.
- [ ] Sprawdz Cloudinary, czy pliki trafiaja do wlasciwego folderu.
- [ ] Zapisz date deploya, commit i wynik smoke testu w notatkach projektu.
