export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 400,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Recurso no encontrado") {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "No autorizado") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Acceso prohibido") {
    super(message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Datos de entrada inválidos") {
    super(message, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflicto con recurso existente") {
    super(message, 409);
  }
}
