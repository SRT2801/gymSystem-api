import { Admin } from "../entities/Admin";

export interface IAdminRepository {
  findAll(): Promise<Admin[]>;
  findById(id: string): Promise<Admin | null>;
  findByEmail(email: string): Promise<Admin | null>;
  create(admin: Admin): Promise<Admin>;
  update(id: string, admin: Partial<Admin>): Promise<Admin | null>;
  delete(id: string): Promise<boolean>;
}
