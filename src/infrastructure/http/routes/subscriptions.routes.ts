import { Router } from "express";
import { SubscriptionsController } from "../controllers/SubscriptionsController";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const subscriptionsRouter = Router();
const subscriptionsController = new SubscriptionsController();

subscriptionsRouter.use(authenticate);

subscriptionsRouter.get(
  "/",
  authorize("admin", "staff"),
  subscriptionsController.getAll
);

subscriptionsRouter.post("/", subscriptionsController.create);

subscriptionsRouter.get("/:id", subscriptionsController.getById);
subscriptionsRouter.get(
  "/member/:memberId",
  subscriptionsController.getByMemberId
);
subscriptionsRouter.get(
  "/member/:memberId/active",
  subscriptionsController.getActiveMembership
);

subscriptionsRouter.put(
  "/:id",
  authorize("admin", "staff"),
  subscriptionsController.update
);
subscriptionsRouter.delete(
  "/:id",
  authorize("admin"),
  subscriptionsController.delete
);

export { subscriptionsRouter };
