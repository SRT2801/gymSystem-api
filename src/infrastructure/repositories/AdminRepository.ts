import { Admin } from "@domain/entities/Admin";
import { IAdminRepository } from "@domain/repositories/IAdminRepository";
import { AdminModel } from "@infrastructure/persistence/database/mongodb/models/AdminModel";

export class AdminRepository implements IAdminRepository {
  async findAll(): Promise<Admin[]> {
    const admins = await AdminModel.find().select("-password");
    return admins.map((admin) => ({
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
      active: admin.active,
      password: "",
    }));
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = await AdminModel.findById(id).select("-password");
    if (!admin) return null;

    return {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
      active: admin.active,
      password: "",
    };
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await AdminModel.findOne({ email });
    if (!admin) return null;

    return {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      password: admin.password,
      role: admin.role,
      active: admin.active,
    };
  }

  async create(adminData: Admin): Promise<Admin> {
    const admin = await AdminModel.create(adminData);

    return {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
      active: admin.active,
      password: "",
    };
  }

  async update(id: string, adminData: Partial<Admin>): Promise<Admin | null> {
    const admin = await AdminModel.findByIdAndUpdate(id, adminData, {
      new: true,
    }).select("-password");

    if (!admin) return null;

    return {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
      active: admin.active,
      password: "",
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = await AdminModel.findByIdAndDelete(id);
    return !!result;
  }

  async findByGoogleId(googleId: string): Promise<Admin | null> {
    const admin = await AdminModel.findOne({ googleId });
    if (!admin) return null;

    return {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      password: admin.password || "",
      role: admin.role,
      active: admin.active,
      googleId: admin.googleId,
      authProvider: admin.authProvider,
      profilePicture: admin.profilePicture,
    };
  }
}
