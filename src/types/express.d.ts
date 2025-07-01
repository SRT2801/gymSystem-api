import { Admin } from "../domain/entities/Admin";
import { Member } from "../domain/entities/Member";

declare global {
  namespace Express {
    interface User {
      user?: Admin | Member;
      role?: string;
      [key: string]: any; 
    }
  }
}

export {};
