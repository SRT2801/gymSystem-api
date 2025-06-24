import { Admin } from "@domain/entities/Admin";
import { Member } from "@domain/entities/Member";
import { IAdminRepository } from "@domain/repositories/IAdminRepository";
import { IMemberRepository } from "@domain/repositories/IMemberRepository";
import {
  UnauthorizedError,
  ConflictError,
} from "@infrastructure/common/errors/AppError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
  constructor(
    private adminRepository: IAdminRepository,
    private memberRepository: IMemberRepository
  ) {}

  async validateCredentials(
    email: string,
    password: string
  ): Promise<{ user: Admin | Member; role: string } | null> {
    const admin = await this.adminRepository.findByEmail(email);

    if (admin && admin.active) {
      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (isPasswordValid) {
        return { user: admin, role: admin.role };
      }
    }

    const member = await this.memberRepository.findByEmail(email);

    if (member && member.active && member.password) {
      const isPasswordValid = await bcrypt.compare(password, member.password);

      if (isPasswordValid) {
        return { user: member, role: "member" };
      }
    }

    return null;
  }

  async registerAdmin(adminData: Omit<Admin, "id">): Promise<Admin> {
    const existingAdmin = await this.adminRepository.findByEmail(
      adminData.email
    );
    if (existingAdmin) {
      throw new ConflictError("El correo electrónico ya está registrado");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    const newAdmin = await this.adminRepository.create({
      ...adminData,
      password: hashedPassword,
    });

    return newAdmin;
  }

  async registerMember(memberData: Member): Promise<Member> {
 
    const existingMember = await this.memberRepository.findByEmail(
      memberData.email
    );
    if (existingMember) {
      throw new ConflictError(
        `El correo electrónico ${memberData.email} ya está registrado`
      );
    }

    const existingMemberByDocId = await this.memberRepository.findByDocumentId(
      memberData.documentId
    );
    if (existingMemberByDocId) {
      throw new ConflictError(
        `El documento de identidad ${memberData.documentId} ya está registrado`
      );
    }

    if (memberData.password) {
      const salt = await bcrypt.genSalt(10);
      memberData.password = await bcrypt.hash(memberData.password, salt);
    }

    return this.memberRepository.create(memberData);
  }

  generateToken(user: Admin | Member, role: string): string {
    const secret = process.env.JWT_SECRET || "your_jwt_secret";

    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: role,
    };
    const token = jwt.sign(tokenPayload, secret, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    return token;
  }

  verifyToken(token: string): any {
    const secret = process.env.JWT_SECRET || "your_jwt_secret";

    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      throw new UnauthorizedError("Token inválido o expirado");
    }
  }
}
