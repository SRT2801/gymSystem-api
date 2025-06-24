import { Member } from "../entities/Member";

export interface MemberFilter {
  active?: boolean;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  filter?: MemberFilter;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IMemberRepository {
  findAll(options?: PaginationOptions): Promise<PaginationResult<Member>>;
  findById(id: string): Promise<Member | null>;
  findByEmail(email: string): Promise<Member | null>;
  findByDocumentId(documentId: string): Promise<Member | null>;
  create(member: Member): Promise<Member>;
  update(id: string, member: Partial<Member>): Promise<Member | null>;
  delete(id: string): Promise<boolean>;
}
