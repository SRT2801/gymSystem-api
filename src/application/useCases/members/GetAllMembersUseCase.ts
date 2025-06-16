import { Member } from "@domain/entities/Member";
import { IMemberRepository } from "@domain/repositories/IMemberRepository";

export class GetAllMembersUseCase {
  constructor(private memberRepository: IMemberRepository) {}

  async execute(): Promise<{ members: Member[]; isEmpty: boolean }> {
    const members = await this.memberRepository.findAll();
    return {
      members,
      isEmpty: members.length === 0,
    };
  }
}
