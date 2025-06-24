import { Request, Response, NextFunction } from "express";
import { AppError } from "@infrastructure/common/errors/AppError";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[ERROR] ${err.message}`);
  console.error(err.stack);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      code: err.constructor.name, 
    });
  }

  // Errores de JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "error",
      message: "Token inválido",
      code: "JWT_INVALID",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "error",
      message: "Token expirado",
      code: "JWT_EXPIRED",
    });
  }


  if (err.name === "MongoServerError") {
    const mongoErr = err as any;


    if (mongoErr.code === 11000) {
      const duplicateKey = Object.keys(mongoErr.keyPattern)[0] || "campo";
      const duplicateValue = mongoErr.keyValue
        ? mongoErr.keyValue[duplicateKey]
        : "";

      return res.status(409).json({
        status: "error",
        message: `El ${duplicateKey} '${duplicateValue}' ya está registrado`,
        code: "DUPLICATE_KEY",
        field: duplicateKey,
      });
    }
  }


  if (err.name === "ValidationError") {
    const validationErr = err as any;
    const errors: Record<string, string> = {};

    for (const field in validationErr.errors) {
      errors[field] = validationErr.errors[field].message;
    }

    return res.status(400).json({
      status: "error",
      message: "Error de validación en los datos enviados",
      code: "VALIDATION_ERROR",
      errors: errors,
    });
  }


  return res.status(500).json({
    status: "error",
    message: "Error interno del servidor",
    code: "INTERNAL_SERVER_ERROR",
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
