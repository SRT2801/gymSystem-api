import express, { Application } from "express";
import cors from "cors";
// Eliminamos la importación del connectDB ya que ahora se gestiona en index.ts
import { membersRouter } from "./routes/members.routes";
import { membershipsRouter } from "./routes/memberships.routes";
import { subscriptionsRouter } from "./routes/subscriptions.routes";

export async function startServer(): Promise<Application> {
  const app: Application = express();
  const port = process.env.PORT || 3000;


  app.use(cors());
  app.use(express.json());


  app.use("/api/members", membersRouter);
  app.use("/api/memberships", membershipsRouter);
  app.use("/api/subscriptions", subscriptionsRouter);

  
  app.get("/health", (req, res) => {
    res.status(200).send("OK");
  });

 
  app.listen(port);

  return app;
}
