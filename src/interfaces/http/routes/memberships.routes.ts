import { Router } from "express";
import { MembershipsController } from "../controllers/MembershipsController";

const membershipsRouter = Router();
const membershipsController = new MembershipsController();

// Rutas para membresías
membershipsRouter.post("/", membershipsController.create);
membershipsRouter.get("/", membershipsController.getAll);
membershipsRouter.get("/:id", membershipsController.getById);
membershipsRouter.put("/:id", membershipsController.update);
membershipsRouter.delete("/:id", membershipsController.delete);

export { membershipsRouter };
