import { Request, Response, NextFunction } from "express";
import { AuthService } from "@application/services/AuthService";
import { AdminRepository } from "@infrastructure/repositories/AdminRepository";
import { MemberRepository } from "@infrastructure/repositories/MemberRepository";
import {
  UnauthorizedError,
  ForbiddenError,
} from "@infrastructure/common/errors/AppError";
import { asyncHandler } from "./errorHandler";

const adminRepository = new AdminRepository();
const memberRepository = new MemberRepository();
const authService = new AuthService(adminRepository, memberRepository);

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Intentar obtener token de cookies primero
    let token = req.cookies.authToken;

    // Si no hay token en cookies, verificar el header de autorización
    if (!token) {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError(
          "Acceso no autorizado: Token no proporcionado"
        );
      }

      token = authHeader.split(" ")[1];
    }

    const decodedToken = authService.verifyToken(token);

    if (!decodedToken) {
      throw new UnauthorizedError("Token inválido o expirado");
    }

    req.user = decodedToken;
    next();
  }
);

export const authorize = (...allowedRoles: string[]) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        throw new UnauthorizedError(
          "Acceso no autorizado: Usuario no autenticado"
        );
      }

      if (allowedRoles.includes(req.user.role)) {
        return next();
      }

      throw new ForbiddenError("No tienes permiso para acceder a este recurso");
    }
  );
};

export const optionalAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Intentar obtener token de cookies primero
      let token = req.cookies.authToken;

      // Si no hay token en cookies, verificar el header de autorización
      if (!token) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return next();
        }
        token = authHeader.split(" ")[1];
      }

      const decodedToken = authService.verifyToken(token);

      if (decodedToken) {
        req.user = decodedToken;
      }

      next();
    } catch (error) {
      next();
    }
  }
);
