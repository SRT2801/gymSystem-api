import {
  connectDB,
  disconnectDB,
} from "@infrastructure/persistence/database/mongodb/connection";
import { AdminModel } from "@infrastructure/persistence/database/mongodb/models/AdminModel";
import bcrypt from "bcrypt";

const seedAdmins = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("password123", salt);

    const admins = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password,
        role: "admin",
        active: true,
      },
      {
        name: "Staff User",
        email: "staff@example.com",
        password,
        role: "staff",
        active: true,
      },
    ];

    await AdminModel.deleteMany({});
    console.log("Administradores anteriores eliminados");

    const createdAdmins = await AdminModel.insertMany(admins);
    console.log(
      `${createdAdmins.length} administradores creados correctamente`
    );

    console.log("Seeder de administradores completado con éxito");
  } catch (error) {
    console.error("Error al ejecutar el seeder de administradores:", error);
  }
};

export async function seedAdminsIfEmpty() {
  try {
    const count = await AdminModel.countDocuments();
    if (count === 0) {
      console.log(
        "No hay administradores en la base de datos. Ejecutando seeder..."
      );
      await seedAdmins();
    } else {
      console.log(
        `Ya existen ${count} administradores en la base de datos. Seeder no ejecutado.`
      );
    }
  } catch (error) {
    console.error(
      "Error al ejecutar el seeder automático de administradores:",
      error
    );
  }
}

if (require.main === module) {
  (async () => {
    await connectDB();
    await seedAdmins();
    await disconnectDB();
  })();
}

export { seedAdmins };
