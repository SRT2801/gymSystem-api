import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  try {
    mongoose.set("strictQuery", false);

    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/gymSystem";
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  console.log("MongoDB disconnected");
}
