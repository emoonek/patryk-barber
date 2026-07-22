# QA checklist przed produkcja

Checklist wykonaj na aktualnej galezi przed deployem oraz powtorz smoke test po deployu.

## A. Gosc

- [ ] Strona glowna `/` laduje sie bez bledow i ma poprawny header.
- [ ] `/galeria` pokazuje opublikowane zdjecia albo czytelny pusty stan.
- [ ] `/kontakt` zawiera aktualne dane salonu.
- [ ] `/regulamin-rezerwacji` i `/polityka-prywatnosci` sa dostepne publicznie.
- [ ] `/logowanie` pozwala zalogowac istniejacego uzytkownika.
- [ ] `/rejestracja` tworzy konto i wysyla email weryfikacyjny.
- [ ] `/zapomnialem-hasla` wysyla link resetu bez ujawniania, czy konto istnieje.
- [ ] Link resetu hasla pozwala ustawic nowe haslo.

## B. Klient

- [ ] Po rejestracji klient widzi informacje o wymaganej weryfikacji email.
- [ ] Link weryfikacyjny aktywuje konto.
- [ ] Zweryfikowany klient moze utworzyc rezerwacje.
- [ ] Klient niezweryfikowany nie moze utworzyc rezerwacji server-side.
- [ ] Limit 3 aktywnych przyszlych rezerwacji blokuje czwarta rezerwacje.
- [ ] Klient moze anulowac tylko wlasna przyszla rezerwacje.
- [ ] Klient nie moze zmodyfikowac ani anulowac cudzej rezerwacji.
- [ ] `/konto` pokazuje nadchodzace wizyty i historie.
- [ ] Wylogowanie usuwa sesje.

## C. Admin

- [ ] `/admin` pokazuje dashboard i statystyki.
- [ ] `/admin/rezerwacje` pokazuje liste, filtry i pusty stan.
- [ ] Szczegoly rezerwacji pokazuja dane klienta, usluge, historie statusow i formularze akcji.
- [ ] Manualna rezerwacja w `/admin/rezerwacje/nowa` dziala dla aktywnego klienta.
- [ ] Edycja terminu/uslugi rezerwacji waliduje kolizje i godziny pracy.
- [ ] Anulowanie przez admina zwalnia slot.
- [ ] Statusy `completed` i `no_show` zamykaja rezerwacje i zwalniaja aktywny slot.
- [ ] `/admin/klienci` pokazuje liste, wyszukiwanie i pusty stan.
- [ ] Blokowanie klienta blokuje nowe rezerwacje klienta.
- [ ] Odblokowanie klienta przywraca mozliwosc rezerwacji.
- [ ] `/admin/uslugi` pozwala dodac, edytowac i ukryc usluge.
- [ ] `/admin/galeria` pozwala dodac, edytowac, ukryc i usunac zdjecie.
- [ ] `/admin/dostepnosc` pozwala blokowac dzien i pojedynczy slot.
- [ ] `/admin/kalendarz` pokazuje tydzien, wolne sloty, blokady i rezerwacje.
- [ ] `/admin/email-test` wysyla testowy email albo pokazuje czytelny blad konfiguracji.

## D. Godziny pracy

- [ ] Poniedzialek-piatek: dostepne sloty 9:00-16:00.
- [ ] Sobota: dostepne sloty 9:00-13:00.
- [ ] Niedziela: brak slotow.
- [ ] Server-side odrzuca rezerwacje poza godzinami pracy.
- [ ] Server-side odrzuca rezerwacje w przeszlosci.
- [ ] Blokady dostepnosci usuwaja slot z formularza klienta.

## E. Maile

- [ ] `EMAIL_PROVIDER="console"` dziala lokalnie i wypisuje tresc maila tylko w konsoli dev.
- [ ] `EMAIL_PROVIDER="console"` jest blokowany w production.
- [ ] `EMAIL_PROVIDER="resend"` wymaga `RESEND_API_KEY` i `MAIL_FROM`.
- [ ] `EMAIL_PROVIDER="smtp"` wymaga konfiguracji SMTP i `MAIL_FROM`.
- [ ] Email weryfikacji konta dociera do klienta.
- [ ] Email resetu hasla dociera do klienta.
- [ ] Email potwierdzenia rezerwacji dociera do klienta.
- [ ] Email anulowania rezerwacji dociera do klienta.
- [ ] Powiadomienie admina o nowej/anulowanej rezerwacji dociera na `ADMIN_EMAIL`.
- [ ] Wiadomosc admina do klienta dziala z poziomu szczegolow rezerwacji.

## F. Cloudinary

- [ ] Panel galerii pokazuje status konfiguracji Cloudinary.
- [ ] Upload JPG dziala.
- [ ] Upload PNG dziala.
- [ ] Upload WebP dziala.
- [ ] Plik powyzej 5 MB jest odrzucany czytelnym komunikatem.
- [ ] Publikacja zdjecia pokazuje je na `/galeria`.
- [ ] Ukrycie zdjecia usuwa je z publicznej galerii.
- [ ] Usuniecie zdjecia usuwa rekord i plik ze storage, jesli ma `storageKey`.

## G. Mobile

- [ ] Homepage jest czytelny na waskim ekranie.
- [ ] Galeria nie ma poziomego scrolla poza zamierzonymi tabelami admina.
- [ ] Rezerwacja jest wygodna na telefonie.
- [ ] Logowanie i rejestracja sa czytelne na telefonie.
- [ ] Admin kalendarz jest uzywalny przez przewijanie poziome.

## H. Production smoke test

- [ ] Production env ma komplet zmiennych z `.env.example`.
- [ ] `npm run verify` przechodzi lokalnie lub w CI.
- [ ] `prisma migrate deploy` wykonuje migracje na produkcyjnej bazie.
- [ ] Seed admina zostal wykonany z mocnym tymczasowym haslem.
- [ ] Haslo admina zostalo zmienione po pierwszym logowaniu.
- [ ] Publiczne strony laduja sie na domenie produkcyjnej.
- [ ] Rejestracja, weryfikacja email, logowanie i reset hasla dzialaja na produkcji.
- [ ] Klient moze utworzyc i anulowac rezerwacje.
- [ ] Admin widzi rezerwacje w panelu i kalendarzu.
- [ ] Test maila w `/admin/email-test` przechodzi na providerze produkcyjnym.
- [ ] Upload galerii do Cloudinary dziala na produkcji.
