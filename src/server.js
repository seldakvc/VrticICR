import "dotenv/config";
import app from "./app.js";
import { connectToDatabase, ensureAdminAccount } from "./config/database.js";

const port = process.env.PORT || 3000;

async function startServer() {
  await connectToDatabase();
  await ensureAdminAccount();

  app.listen(port, () => {
    console.log(`Server je pokrenut na portu ${port}.`);
  });
}

startServer().catch((error) => {
  const errorName = error instanceof Error ? error.name : "UnknownError";
  console.error(
    `Pokretanje aplikacije nije uspjelo (${errorName}); server nije pokrenut. Provjeri MongoDB i ADMIN_USERNAME/ADMIN_PASSWORD postavke.`,
  );
  process.exitCode = 1;
});
