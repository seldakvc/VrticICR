# Laravel to Express migration

## Plan and status

- [x] Analyze the Express entry points and Laravel API routes, controllers, services, models, middleware, and available migrations.
- [x] Add Express configuration, middleware, Mongoose models, controllers, and routes.
- [x] Add OpenAPI documentation and environment example.
- [x] Validate imports, startup, and endpoint documentation.
- [ ] Configure and explicitly start the MongoDB connection after supplying `MONGODB_URI`; startup intentionally does not connect.
- [ ] Confirm any additional legacy table columns/types against the original database schema before expanding the Mongoose models; create-table migrations for the domain tables are absent.

MongoDB ObjectIds will replace Laravel's auto-incrementing IDs. Existing Laravel JWTs contain SQL IDs and will not be accepted by Express; users must log in to receive an Express token. The MongoDB connection configuration will be provided but will not connect automatically.

The Laravel project has no create-table migrations for `dijete`, `grupa`, `staratelj`, or `vaspitac`. Their Mongoose fields will therefore be limited to fields evidenced by the Laravel models and auth validation; uncertain SQL field types will not be guessed.

## Laravel-to-Express file mapping

| Laravel source | Express destination | Status |
|---|---|---|
| `routes/api.php`, `routes/dijete.php` | `src/routes/apiRoutes.js`, `src/routes/dijeteRoutes.js` | Complete |
| `routes/api.php`, `routes/grupa.php` | `src/routes/apiRoutes.js`, `src/routes/grupaRoutes.js` | Complete |
| `routes/api.php`, `routes/staratelj.php` | `src/routes/apiRoutes.js`, `src/routes/starateljRoutes.js`, `src/routes/starateljiRoutes.js` | Complete |
| `routes/api.php`, `routes/vaspitac.php` | `src/routes/apiRoutes.js`, `src/routes/vaspitacRoutes.js` | Complete |
| `app/Http/Controllers/AuthController.php`, `app/Service/AuthService.php` | `src/controllers/authController.js`, `src/utils/passwords.js`, `src/utils/tokens.js` | Complete |
| `app/Http/Controllers/DijeteController.php`, `app/Service/DijeteService.php` | `src/controllers/dijeteController.js` | Complete |
| `app/Http/Controllers/GrupaController.php`, `app/Service/GrupaService.php` | `src/controllers/grupaController.js` | Complete |
| `app/Http/Controllers/StarateljController.php`, `app/Service/StarateljService.php` | `src/controllers/starateljController.js` | Complete |
| `app/Http/Controllers/VaspitacController.php`, `app/Service/VaspitacService.php` | `src/controllers/vaspitacController.js` | Complete |
| `app/Models/Dijete.php` | `src/models/Dijete.js` | Complete |
| `app/Models/Grupa.php` | `src/models/Grupa.js` | Complete |
| `app/Models/Staratelj.php` | `src/models/Staratelj.js` | Complete |
| `app/Models/Vaspitac.php` | `src/models/Vaspitac.js` | Complete |
| `app/Models/User.php` and `2014_10_12_000000_create_users_table.php` | `src/models/User.js` | Complete |
| `config/auth.php`, `config/jwt.php`, `app/Http/Kernel.php` | `src/middleware/authenticate.js`, `src/utils/tokens.js` | Complete |
| `app/Http/Middleware/TrimStrings.php`, `config/cors.php`, API throttle in `app/Providers/RouteServiceProvider.php` | `src/middleware/normalizeInput.js`, `src/app.js` | Complete |
| Existing `src/app.js`, `src/server.js` | Updated in place; no Laravel file changes | Complete |
| — | `src/config/database.js`, `.env.example`, `docs/openapi.js` | Complete |

`routes/auth.php` is not loaded by `routes/api.php`; its routes are not part of the active Laravel API. `app/Http/Middleware/JwtMiddleware.php` is a pass-through and is not assigned to the active routes; authentication is provided by the configured JWT guards.

## Active Laravel API surface

All routes below are prefixed with `/api`.

| Method and path | Access | Laravel action |
|---|---|---|
| `GET /vaspitac` | Public | List educators |
| `POST /vaspitac/register`, `POST /vaspitac/login` | Public | Educator authentication |
| `POST /staratelj/register`, `POST /staratelj/login` | Public | Guardian authentication |
| `GET /vaspitac/me`, `GET /vaspitac/grupa-djeca` | Educator JWT | Current educator and group children |
| `GET /vaspitac/{id}`, `PUT /vaspitac/{id}`, `DELETE /vaspitac/{id}` | Educator JWT | Educator CRUD |
| `GET /staratelj/me`, `GET /staratelj/djeca`, `GET /staratelj/djeca/{id}` | Guardian JWT | Current guardian and their children |
| `GET /staratelji`, `GET /staratelji/{id}`, `POST /staratelji`, `PUT /staratelji/{id}`, `DELETE /staratelji/{id}` | Educator JWT | Guardian CRUD |
| `GET /grupa`, `GET /grupa/{id}`, `POST /grupa`, `PUT /grupa/{id}`, `DELETE /grupa/{id}` | Educator JWT | Group CRUD |
| `GET /dijete`, `GET /dijete/{id}`, `PUT /dijete/{id}`, `DELETE /dijete/{id}` | Educator JWT | Child read/update/delete |
| `POST /dijete` | Educator or guardian JWT | Child creation |

Laravel validates authentication registration/login inputs. The CRUD services do not define additional request validation; migration will not add unsupported business rules.
