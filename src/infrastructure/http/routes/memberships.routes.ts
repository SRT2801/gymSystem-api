import { Router } from "express";
import { MembershipsController } from "../controllers/MembershipsController";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const membershipsRouter = Router();
const membershipsController = new MembershipsController();


membershipsRouter.get("/", membershipsController.getAll);
membershipsRouter.get("/:id", membershipsController.getById);

membershipsRouter.use(authenticate);
membershipsRouter.post("/", authorize("admin"), membershipsController.create);
membershipsRouter.put("/:id", authorize("admin"), membershipsController.update);
membershipsRouter.delete(
  "/:id",
  authorize("admin"),
  membershipsController.delete
);

export { membershipsRouter };
