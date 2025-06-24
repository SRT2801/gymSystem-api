import { Member } from "@domain/entities/Member";
import {
  IMemberRepository,
  PaginationOptions,
  PaginationResult,
} from "@domain/repositories/IMemberRepository";
import { MemberModel } from "@infrastructure/persistence/database/mongodb/models/MemberModel";

export class MemberRepository implements IMemberRepository {
  async findAll(
    options?: PaginationOptions
  ): Promise<PaginationResult<Member>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const [members, total] = await Promise.all([
      MemberModel.find().select("-password").skip(skip).limit(limit),
      MemberModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: members.map((member) => ({
        id: member._id.toString(),
        name: member.name,
        email: member.email,
        phone: member.phone,
        documentId: member.documentId,
        birthDate: member.birthDate,
        registrationDate: member.registrationDate,
        active: member.active,
        hasAccount: member.hasAccount,
      })),
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  async findById(id: string): Promise<Member | null> {
    const member = await MemberModel.findById(id).select("-password");
    if (!member) return null;

    return {
      id: member._id.toString(),
      name: member.name,
      email: member.email,
      phone: member.phone,
      documentId: member.documentId,
      birthDate: member.birthDate,
      registrationDate: member.registrationDate,
      active: member.active,
    };
  }

  async findByEmail(email: string): Promise<Member | null> {
    const member = await MemberModel.findOne({ email });
    if (!member) return null;

    return {
      id: member._id.toString(),
      name: member.name,
      email: member.email,
      phone: member.phone,
      documentId: member.documentId,
      birthDate: member.birthDate,
      registrationDate: member.registrationDate,
      active: member.active,
      password: member.password,
    };
  }

  async findByDocumentId(documentId: string): Promise<Member | null> {
    const member = await MemberModel.findOne({ documentId });
    if (!member) return null;

    return {
      id: member._id.toString(),
      name: member.name,
      email: member.email,
      phone: member.phone,
      documentId: member.documentId,
      birthDate: member.birthDate,
      registrationDate: member.registrationDate,
      active: member.active,
      password: member.password,
    };
  }

  async create(memberData: Member): Promise<Member> {
    const member = await MemberModel.create(memberData);

    return {
      id: member._id.toString(),
      name: member.name,
      email: member.email,
      phone: member.phone,
      documentId: member.documentId,
      birthDate: member.birthDate,
      registrationDate: member.registrationDate,
      active: member.active,
    };
  }

  async update(
    id: string,
    memberData: Partial<Member>
  ): Promise<Member | null> {
    const member = await MemberModel.findByIdAndUpdate(id, memberData, {
      new: true,
    }).select("-password");

    if (!member) return null;

    return {
      id: member._id.toString(),
      name: member.name,
      email: member.email,
      phone: member.phone,
      documentId: member.documentId,
      birthDate: member.birthDate,
      registrationDate: member.registrationDate,
      active: member.active,
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = await MemberModel.findByIdAndDelete(id);
    return !!result;
  }
}
