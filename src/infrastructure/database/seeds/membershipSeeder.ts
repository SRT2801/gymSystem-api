import {
  connectDB,
  disconnectDB,
} from "@infrastructure/persistence/database/mongodb/connection";
import { MembershipModel } from "@infrastructure/persistence/database/mongodb/models/MembershipModel";

const memberships = [
  {
    name: "Pase Diario",
    description: "Acceso a todas las instalaciones por un día completo",
    price: 10.0,
    durationDays: 1,
    active: true,
  },
  {
    name: "Pase Semanal",
    description: "Acceso a todas las instalaciones durante 7 días consecutivos",
    price: 35.0,
    durationDays: 7,
    active: true,
  },
  {
    name: "Plan Mensual Básico",
    description: "Acceso a áreas de cardio y pesas durante un mes",
    price: 49.99,
    durationDays: 30,
    active: true,
  },
  {
    name: "Plan Mensual Plus",
    description:
      "Acceso a todas las instalaciones y una clase grupal a la semana durante un mes",
    price: 64.99,
    durationDays: 30,
    active: true,
  },
  {
    name: "Plan Trimestral",
    description:
      "Acceso completo a instalaciones durante 3 meses con 10% de descuento",
    price: 149.99,
    durationDays: 90,
    active: true,
  },
  {
    name: "Plan Semestral",
    description:
      "Acceso completo a instalaciones durante 6 meses con 15% de descuento",
    price: 279.99,
    durationDays: 180,
    active: true,
  },
  {
    name: "Plan Anual",
    description:
      "Acceso completo a instalaciones durante un año con 25% de descuento",
    price: 499.99,
    durationDays: 365,
    active: true,
  },
  {
    name: "Plan Familiar Mensual",
    description: "Acceso para 4 miembros de la familia durante un mes",
    price: 159.99,
    durationDays: 30,
    active: true,
  },
  {
    name: "Plan Estudiante",
    description:
      "Acceso a instalaciones con 20% de descuento para estudiantes (requiere identificación)",
    price: 39.99,
    durationDays: 30,
    active: true,
  },
  {
    name: "Plan Empresarial",
    description:
      "Paquete para empresas, mínimo 5 empleados, precio por persona",
    price: 34.99,
    durationDays: 30,
    active: true,
  },
  {
    name: "Plan Senior",
    description:
      "Plan especial para personas mayores de 60 años con acceso a clases adaptadas",
    price: 34.99,
    durationDays: 30,
    active: true,
  },
  {
    name: "Plan VIP",
    description:
      "Acceso 24/7, entrenador personal una vez por semana y casillero privado",
    price: 99.99,
    durationDays: 30,
    active: true,
  },
];

async function seedMemberships() {
  try {
    await connectDB();

    await MembershipModel.deleteMany({});
    console.log("Membresías anteriores eliminadas");

    const createdMemberships = await MembershipModel.insertMany(memberships);
    console.log(
      `${createdMemberships.length} membresías creadas correctamente`
    );

    await disconnectDB();
    console.log("Seeder completado con éxito");
  } catch (error) {
    console.error("Error al ejecutar el seeder:", error);
    await disconnectDB();
    process.exit(1);
  }
}

export async function seedMembershipsIfEmpty() {
  try {
    // Verificar si ya existen membresías
    const count = await MembershipModel.countDocuments();
    if (count === 0) {
      console.log(
        "No hay membresías en la base de datos. Ejecutando seeder..."
      );
      const createdMemberships = await MembershipModel.insertMany(memberships);
      console.log(
        `${createdMemberships.length} membresías creadas correctamente`
      );
    } else {
      console.log(
        `Ya existen ${count} membresías en la base de datos. Seeder no ejecutado.`
      );
    }
  } catch (error) {
    console.error("Error al ejecutar el seeder automático:", error);
  }
}

if (require.main === module) {
  seedMemberships();
}

export { seedMemberships };
