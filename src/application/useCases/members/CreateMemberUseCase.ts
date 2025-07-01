import { Member } from "@domain/entities/Member";
import { IMemberRepository } from "@domain/repositories/IMemberRepository";

export class CreateMemberUseCase {
  constructor(private memberRepository: IMemberRepository) {}
  async execute(
    memberData: Omit<Member, "id" | "registrationDate">
  ): Promise<Member> {
    const existingMemberByEmail = await this.memberRepository.findByEmail(
      memberData.email
    );
    if (existingMemberByEmail) {
      throw new Error("Ya existe un miembro con este correo electrónico");
    }
   
    if (!memberData.documentId) {
      throw new Error("El número de documento es requerido");
    }
    const existingMemberByDocId = await this.memberRepository.findByDocumentId(
      memberData.documentId
    );

    if (existingMemberByDocId) {
      throw new Error("Ya existe un miembro con este número de documento");
    }

    const member: Member = {
      ...memberData,
      registrationDate: new Date(),
      active: true,
    };

    return this.memberRepository.create(member);
  }
}
