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

    if (admin && admin.active && admin.password) {
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

    let hashedPassword = undefined;
    if (adminData.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(adminData.password, salt);
    }

    const newAdmin = await this.adminRepository.create({
      ...adminData,
      password: hashedPassword,
      authProvider: adminData.authProvider || "local",
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

    if (memberData.documentId) {
      const existingMemberByDocId =
        await this.memberRepository.findByDocumentId(memberData.documentId);
      if (existingMemberByDocId) {
        throw new ConflictError(
          `El documento de identidad ${memberData.documentId} ya está registrado`
        );
      }
    }

    if (memberData.password) {
      const salt = await bcrypt.genSalt(10);
      memberData.password = await bcrypt.hash(memberData.password, salt);
    }

    return this.memberRepository.create(memberData);
  }

  generateToken(user: Admin | Member, role: string): string {
    const secret = process.env.JWT_SECRET || "your_jwt_secret";

    if (!user) {
      throw new Error(
        "No se puede generar un token para un usuario indefinido"
      );
    }

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

  async findOrCreateGoogleUser(
    googleUserData: {
      googleId: string;
      email: string;
      name: string;
      profilePicture?: string;
    },
    role: "admin" | "staff" | "member" = "member"
  ): Promise<{ user: Admin | Member; role: string; isNewUser: boolean }> {
    let user: Admin | Member | null = null;
    let isNewUser = false;

    if (role === "admin" || role === "staff") {
      user = await this.adminRepository.findByGoogleId(googleUserData.googleId);

      if (!user) {
        user = await this.adminRepository.findByEmail(googleUserData.email);

        if (user) {
          user = await this.adminRepository.update(user.id!, {
            googleId: googleUserData.googleId,
            authProvider: "google",
            profilePicture: googleUserData.profilePicture,
          });
        } else {
          user = await this.adminRepository.create({
            name: googleUserData.name,
            email: googleUserData.email,
            googleId: googleUserData.googleId,
            authProvider: "google",
            profilePicture: googleUserData.profilePicture,
            role: role,
            active: true,
          } as Admin);
          isNewUser = true;
        }
      }

      return { user: user!, role: user!.role, isNewUser };
    } else {
      user = await this.memberRepository.findByGoogleId(
        googleUserData.googleId
      );

      if (!user) {
        user = await this.memberRepository.findByEmail(googleUserData.email);

        if (user) {
          user = await this.memberRepository.update(user.id!, {
            googleId: googleUserData.googleId,
            authProvider: "google",
            profilePicture: googleUserData.profilePicture,
            hasAccount: true,
          });
        } else {
          user = await this.memberRepository.create({
            name: googleUserData.name,
            email: googleUserData.email,
            googleId: googleUserData.googleId,
            authProvider: "google",
            profilePicture: googleUserData.profilePicture,
            active: true,
            hasAccount: true,
            registrationDate: new Date(),
            completeProfile: false,
          } as Member);
          isNewUser = true;
        }
      }

      return { user: user!, role: "member", isNewUser };
    }
  }
}
