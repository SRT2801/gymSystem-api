import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import {
  authenticate,
  authorize,
  optionalAuth,
} from "../middlewares/authMiddleware";
import passport from "passport";

export const authRouter = Router();
const authController = new AuthController();

authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);

authRouter.post("/register", optionalAuth, authController.register);

authRouter.get("/me", authenticate, authController.me);

authRouter.post(
  "/complete-profile",
  authenticate,
  authController.completeProfile
);

authRouter.post(
  "/register-admin",
  authenticate,
  authorize("admin"),
  authController.registerAdmin
);

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "select_account",
    accessType: "online",
  }),
  authController.googleLogin
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  authController.googleCallback
);
