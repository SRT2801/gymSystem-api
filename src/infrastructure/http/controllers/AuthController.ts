import { Request, Response } from "express";
import { AuthService } from "@application/services/AuthService";
import { AdminRepository } from "@infrastructure/repositories/AdminRepository";
import { MemberRepository } from "@infrastructure/repositories/MemberRepository";
import {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from "@infrastructure/common/errors/AppError";
import { asyncHandler } from "../middlewares/errorHandler";

const adminRepository = new AdminRepository();
const memberRepository = new MemberRepository();
const authService = new AuthService(adminRepository, memberRepository);

export class AuthController {
  login = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ValidationError("Email y contraseña son requeridos");
      }


      const result = await authService.validateCredentials(email, password);

      if (!result) {
        throw new UnauthorizedError("Credenciales inválidas");
      }

      const { user, role } = result;

      // Generar token
      const token = authService.generateToken(user, role);

      return res.status(200).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: role,
        },
      });
    }
  );

  register = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const {
        name,
        email,
        password,
        role = "member",
        phone,
        documentId,
        birthDate,
      } = req.body;

      
      if (role === "admin" || role === "staff") {
    
        if (!req.user || req.user.role !== "admin") {
          throw new ForbiddenError(
            "No tienes permisos para crear usuarios con ese rol"
          );
        }

        if (!name || !email || !password) {
          throw new ValidationError(
            "Nombre, email y contraseña son requeridos"
          );
        }

        const admin = await authService.registerAdmin({
          name,
          email,
          password,
          role: role as "admin" | "staff",
          active: true,
        });

        return res.status(201).json({
          message: "Usuario administrativo registrado exitosamente",
          user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
          },
        });
      } else {
   
        if (
          !name ||
          !email ||
          !password ||
          !phone ||
          !documentId ||
          !birthDate
        ) {
          throw new ValidationError(
            "Todos los campos son requeridos para registrarse como miembro"
          );
        }

        try {
          const member = await authService.registerMember({
            name,
            email,
            password,
            phone,
            documentId,
            birthDate: new Date(birthDate),
            registrationDate: new Date(),
            active: true,
            hasAccount: true,
          });

          return res.status(201).json({
            message: "Miembro registrado exitosamente",
            user: {
              id: member.id,
              name: member.name,
              email: member.email,
              role: "member",
            },
          });
        } catch (error: any) {
          if (error.message.includes("ya está registrado")) {
            throw new ConflictError(error.message);
          }
          throw error;
        }
      }
    }
  );

  registerAdmin = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        throw new ValidationError("Todos los campos son requeridos");
      }

      if (role !== "admin" && role !== "staff") {
        throw new ValidationError("El rol debe ser 'admin' o 'staff'");
      }

      const admin = await authService.registerAdmin({
        name,
        email,
        password,
        role: role as "admin" | "staff",
        active: true,
      });

      return res.status(201).json({
        message: "Usuario administrativo registrado exitosamente",
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    }
  );

  me = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    if (!req.user?.id || !req.user?.role) {
      throw new UnauthorizedError("No autenticado");
    }

    let userData = null;

 
    if (req.user.role === "admin" || req.user.role === "staff") {
      userData = await adminRepository.findById(req.user.id);
    } else if (req.user.role === "member") {
      userData = await memberRepository.findById(req.user.id);
    }

    if (!userData) {
      throw new NotFoundError("Usuario no encontrado");
    }

    return res.status(200).json({
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: req.user.role,
      },
    });
  });
}
