import { Member } from "@domain/entities/Member";
import { IMemberRepository } from "@domain/repositories/IMemberRepository";

export class GetAllMembersUseCase {
  constructor(private memberRepository: IMemberRepository) {}

  async execute(): Promise<Member[]> {
    return this.memberRepository.findAll();
  }
}
