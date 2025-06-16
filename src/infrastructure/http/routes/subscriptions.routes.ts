import { Router } from "express";
import { SubscriptionsController } from "../controllers/SubscriptionsController";

const subscriptionsRouter = Router();
const subscriptionsController = new SubscriptionsController();

// Rutas para suscripciones
subscriptionsRouter.post("/", subscriptionsController.create);
subscriptionsRouter.get("/", subscriptionsController.getAll);
subscriptionsRouter.get("/:id", subscriptionsController.getById);
subscriptionsRouter.get(
  "/member/:memberId",
  subscriptionsController.getByMemberId
);
subscriptionsRouter.get(
  "/member/:memberId/active",
  subscriptionsController.getActiveMembership
);
subscriptionsRouter.put("/:id", subscriptionsController.update);
subscriptionsRouter.delete("/:id", subscriptionsController.delete);

export { subscriptionsRouter };
