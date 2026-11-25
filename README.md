# Vrtic backend

Express/Mongoose migracija Laravel API-ja, koristi Node.js ES module sintaksu (`import`/`export`).

## Pokretanje

Potrebni su Node.js i npm. Podesi `JWT_SECRET`, `MONGODB_URI` i jedinstvenu `ADMIN_PASSWORD` lozinku od 16 do 72 karaktera u `.env` (korisničko ime admina je `admin`), zatim pokreni:

```bash
npm install
npm run dev
```

Server se pokreće na `http://localhost:3000` (podesivo preko `PORT`) nakon uspješnog povezivanja s MongoDB bazom. Primjer lokalne konfiguracije nalazi se u `.env.example`; ako koristiš MongoDB Atlas, postavi svoj Atlas connection string kao `MONGODB_URI`. `/api` rute vraćaju `503` dok baza nije povezana.

Admin nalog se kreira ili ažurira pri pokretanju aplikacije. Prijava je na `POST /api/admin/login` sa JSON tijelom `{ "username": "admin", "password": "<ADMIN_PASSWORD>" }`; odgovor sadrži JWT koji se koristi kao Bearer token za zaštićene rute.

Swagger dokumentacija je dostupna na [`/api-docs`](http://localhost:3000/api-docs). Pregled Laravel-to-Express mapiranja i statusa nalazi se u [MIGRATION.md](./MIGRATION.md).

## Osnovne rute

- `GET /` — API poruka
- `GET /health` — provjera dostupnosti servera
- `/api/*` — migrirane Laravel API rute
- `/api-docs` — OpenAPI dokumentacija

## Uloge i upis djece

- `admin` se kreira pri pokretanju iz `ADMIN_USERNAME` i `ADMIN_PASSWORD`; samo admin može upravljati roditeljima, vaspitačima, grupama, upisima i djecom.
- `vaspitac` naloge kreira admin (`POST /api/vaspitac`). Vaspitač vidi samo djecu iz svoje grupe i može da čita, dodaje i uređuje njihove dnevne aktivnosti na `/api/dijete/{id}/aktivnosti`; brisanje aktivnosti je rezervisano za admina.
- Javna registracija (`POST /api/staratelj/register`) kreira samo roditeljski nalog. Roditelj šalje zahtjev za upis na `POST /api/staratelj/zahtjevi`; vidi samo sopstvene zahtjeve i odobrenu djecu/aktivnosti.
- Admin pregleda zahtjeve preko `GET /api/upisi` i odobrava ih uz dodjelu grupe ili odbija preko `PATCH /api/upisi/{id}`.
- Sve zaštićene rute zahtijevaju `Authorization: Bearer <token>`. Dozvole se provjeravaju na serveru.

Frontend nije dio ovog repozitorijuma; sakrivanje stranica i dugmadi prema ulozi treba povezati u frontend projektu.
