import { Member } from "@domain/entities/Member";
import { IMemberRepository } from "@domain/repositories/IMemberRepository";
import { MemberModel } from "@infrastructure/persistence/database/mongodb/models/MemberModel";

export class MemberRepository implements IMemberRepository {
  async findAll(): Promise<Member[]> {
    const members = await MemberModel.find().select("-password");
    return members.map((member) => ({
      id: member._id.toString(),
      name: member.name,
      email: member.email,
      phone: member.phone,
      documentId: member.documentId,
      birthDate: member.birthDate,
      registrationDate: member.registrationDate,
      active: member.active,
      hasAccount: member.hasAccount,
    }));
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
