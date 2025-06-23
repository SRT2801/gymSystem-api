import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { membersRouter } from "./routes/members.routes";
import { membershipsRouter } from "./routes/memberships.routes";
import { subscriptionsRouter } from "./routes/subscriptions.routes";
import { authRouter } from "./routes/auth.routes";
import { errorHandler } from "./middlewares/errorHandler";

export async function startServer(): Promise<Application> {
  const app: Application = express();
  const port = process.env.PORT || 3000;

  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());

  // Rutas
  app.use("/api/auth", authRouter);
  app.use("/api/members", membersRouter);
  app.use("/api/memberships", membershipsRouter);
  app.use("/api/subscriptions", subscriptionsRouter);

  app.get("/health", (req, res) => {
    res.status(200).send("OK");
  });

  app.use((req, res) => {
    res.status(404).json({
      status: "error",
      message: `La ruta ${req.originalUrl} no existe en este servidor`,
    });
  });

  app.use(errorHandler);

  app.listen(port);

  return app;
}
