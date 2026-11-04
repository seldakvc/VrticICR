# Vrtic backend

Express/Mongoose migracija Laravel API-ja, koristi Node.js ES module sintaksu (`import`/`export`).

## Pokretanje

Potrebni su Node.js i npm. Kopiraj `.env.example` u `.env`, postavi `JWT_SECRET` i `MONGODB_URI`, zatim pokreni:

```bash
npm install
npm run dev
```

Server je dostupan na `http://localhost:3000` (podesivo preko `PORT`). MongoDB konfiguracija je u `src/config/database.js`; server namjerno ne otvara vezu. Dok aplikacija nije povezana s bazom, `/api` rute vraćaju `503`.

Swagger dokumentacija je dostupna na [`/api-docs`](http://localhost:3000/api-docs). Pregled Laravel-to-Express mapiranja i statusa nalazi se u [MIGRATION.md](./MIGRATION.md).

## Osnovne rute

- `GET /` — API poruka
- `GET /health` — provjera dostupnosti servera
- `/api/*` — migrirane Laravel API rute
- `/api-docs` — OpenAPI dokumentacija
