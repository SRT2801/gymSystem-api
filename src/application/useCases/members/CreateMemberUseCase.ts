import { Member } from "@domain/entities/Member";
import { IMemberRepository } from "@domain/repositories/IMemberRepository";

export class CreateMemberUseCase {
  constructor(private memberRepository: IMemberRepository) {}

  async execute(
    memberData: Omit<Member, "id" | "registrationDate">
  ): Promise<Member> {
    const existingMember = await this.memberRepository.findByEmail(
      memberData.email
    );
    if (existingMember) {
      throw new Error("Ya existe un miembro con este correo electrónico");
    }

    const member: Member = {
      ...memberData,
      registrationDate: new Date(),
      active: true,
    };

    return this.memberRepository.create(member);
  }
}
