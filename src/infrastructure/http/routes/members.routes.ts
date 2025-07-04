import { Router } from "express";
import { MembersController } from "../controllers/MembersController";
import { authenticate, authorize } from "../middlewares/authMiddleware";
import { memberFiltersDocumentation } from "@infrastructure/common/utils/filterDocumentation";

const membersRouter = Router();
const membersController = new MembersController();

membersRouter.use(authenticate);

membersRouter.get("/filters", (req, res) => {
  res.status(200).json({
    message: "Filtros disponibles para el endpoint /members",
    filters: memberFiltersDocumentation,
  });
});

membersRouter.get("/", authorize("admin", "staff"), membersController.getAll);

membersRouter.get("/:id", membersController.getById);

membersRouter.post("/", authorize("admin", "staff"), membersController.create);
membersRouter.put(
  "/:id",
  authorize("admin", "staff"),
  membersController.update
);
membersRouter.delete("/:id", authorize("admin"), membersController.delete);

export { membersRouter };
