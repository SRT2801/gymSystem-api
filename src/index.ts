import "dotenv/config";
import { startServer } from "./interfaces/http/server";
import { connectDB } from "@infrastructure/persistence/database/mongodb/connection";
import { seedMembershipsIfEmpty } from "./infrastructure/database/seeds/membershipSeeder";

async function bootstrap() {
  try {
    await connectDB();

    await seedMembershipsIfEmpty();

    const server = await startServer();
    console.log(`Server running on port ${process.env.PORT}`);
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

bootstrap();
