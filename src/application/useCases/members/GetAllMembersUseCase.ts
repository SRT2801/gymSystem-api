import { Member } from "@domain/entities/Member";
import {
  IMemberRepository,
  PaginationOptions,
  PaginationResult,
  MemberFilter,
} from "@domain/repositories/IMemberRepository";

export interface GetAllMembersOptions extends PaginationOptions {
  active?: boolean;
  name?: string;
  email?: string;
  documentId?: string;
  hasAccount?: boolean;
  registrationDateFrom?: string;
  registrationDateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export class GetAllMembersUseCase {
  constructor(private memberRepository: IMemberRepository) {}

  async execute(
    options?: GetAllMembersOptions
  ): Promise<{ members: PaginationResult<Member>; isEmpty: boolean }> {
    const filter: MemberFilter = {};

    if (options?.active !== undefined) {
      filter.active = options.active;
    }

    if (options?.name) {
      filter.name = options.name;
    }

    if (options?.email) {
      filter.email = options.email;
    }

    if (options?.documentId) {
      filter.documentId = options.documentId;
    }

    if (options?.hasAccount !== undefined) {
      filter.hasAccount = options.hasAccount;
    }

    if (options?.registrationDateFrom) {
      filter.registrationDateFrom = new Date(options.registrationDateFrom);
    }

    if (options?.registrationDateTo) {
      filter.registrationDateTo = new Date(options.registrationDateTo);
    }

    const paginationOptions: PaginationOptions = {
      page: options?.page,
      limit: options?.limit,
      filter: filter,
      sortBy: options?.sortBy,
      sortOrder: options?.sortOrder,
    };

    const members = await this.memberRepository.findAll(paginationOptions);
    return {
      members,
      isEmpty: members.data.length === 0,
    };
  }
}
