import "dotenv/config";
import { startServer } from "@infrastructure/http/server";
import { connectDB } from "@infrastructure/persistence/database/mongodb/connection";
import { seedMembershipsIfEmpty } from "./infrastructure/database/seeds/membershipSeeder";
import { seedAdminsIfEmpty } from "./infrastructure/database/seeds/adminSeeder";

async function bootstrap() {
  try {
    await connectDB();

    // Ejecutar seeders si es necesario
    await seedMembershipsIfEmpty();
    await seedAdminsIfEmpty();

    const server = await startServer();
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

bootstrap();
