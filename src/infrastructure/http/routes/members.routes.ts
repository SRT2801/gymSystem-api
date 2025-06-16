import { Router } from "express";
import { MembersController } from "../controllers/MembersController";

const membersRouter = Router();
const membersController = new MembersController();

// Rutas para miembros
membersRouter.post("/", membersController.create);
membersRouter.get("/", membersController.getAll);
membersRouter.get("/:id", membersController.getById);
membersRouter.put("/:id", membersController.update);
membersRouter.delete("/:id", membersController.delete);

export { membersRouter };
