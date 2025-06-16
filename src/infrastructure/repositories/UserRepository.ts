import { User } from "@domain/entities/User";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { UserModel } from "@infrastructure/persistence/database/mongodb/models/UserModel";

export class UserRepository implements IUserRepository {
  async findAll(): Promise<User[]> {
    const users = await UserModel.find().select("-password");
    return users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      password: "",
    }));
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id).select("-password");
    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      password: "",
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      active: user.active,
    };
  }

  async create(userData: User): Promise<User> {
    const user = await UserModel.create(userData);

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      password: "",
    };
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(id, userData, {
      new: true,
    }).select("-password");

    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      password: "",
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }
}
