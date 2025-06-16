import { Member } from "../entities/Member";

export interface IMemberRepository {
  findAll(): Promise<Member[]>;
  findById(id: string): Promise<Member | null>;
  findByEmail(email: string): Promise<Member | null>;
  create(member: Member): Promise<Member>;
  update(id: string, member: Partial<Member>): Promise<Member | null>;
  delete(id: string): Promise<boolean>;
}
