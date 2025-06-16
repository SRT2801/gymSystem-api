import { seedMemberships } from "./membershipSeeder";

async function runSeeders() {
  try {
    console.log("Iniciando seeders...");
    await seedMemberships();
    console.log("Todos los seeders ejecutados correctamente");
    process.exit(0);
  } catch (error) {
    console.error("Error al ejecutar los seeders:", error);
    process.exit(1);
  }
}

runSeeders();
