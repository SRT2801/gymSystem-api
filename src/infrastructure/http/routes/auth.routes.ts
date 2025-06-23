import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import {
  authenticate,
  authorize,
  optionalAuth,
} from "../middlewares/authMiddleware";

export const authRouter = Router();
const authController = new AuthController();

// Rutas públicas
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);

// Ruta única para registro que usa autenticación opcional
authRouter.post("/register", optionalAuth, authController.register);

// Ruta protegida
authRouter.get("/me", authenticate, authController.me);

// Ruta específica para administradores (requiere autenticación como admin)
authRouter.post(
  "/register-admin",
  authenticate,
  authorize("admin"),
  authController.registerAdmin
);
