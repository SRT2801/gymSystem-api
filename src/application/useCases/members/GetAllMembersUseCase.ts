import { Member } from "@domain/entities/Member";
import {
  IMemberRepository,
  PaginationOptions,
  PaginationResult,
} from "@domain/repositories/IMemberRepository";

export class GetAllMembersUseCase {
  constructor(private memberRepository: IMemberRepository) {}

  async execute(
    options?: PaginationOptions
  ): Promise<{ members: PaginationResult<Member>; isEmpty: boolean }> {
    const members = await this.memberRepository.findAll(options);
    return {
      members,
      isEmpty: members.data.length === 0,
    };
  }
}
