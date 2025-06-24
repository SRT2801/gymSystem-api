import { Member } from "@domain/entities/Member";
import {
  IMemberRepository,
  PaginationOptions,
  PaginationResult,
  MemberFilter,
} from "@domain/repositories/IMemberRepository";

export interface GetAllMembersOptions extends PaginationOptions {
  active?: boolean;
}

export class GetAllMembersUseCase {
  constructor(private memberRepository: IMemberRepository) {}

  async execute(
    options?: GetAllMembersOptions
  ): Promise<{ members: PaginationResult<Member>; isEmpty: boolean }> {
    // Preparar opciones de filtrado
    const filter: MemberFilter = {};

    if (options?.active !== undefined) {
      filter.active = options.active;
    }

    const paginationOptions: PaginationOptions = {
      page: options?.page,
      limit: options?.limit,
      filter: filter,
    };

    const members = await this.memberRepository.findAll(paginationOptions);
    return {
      members,
      isEmpty: members.data.length === 0,
    };
  }
}
