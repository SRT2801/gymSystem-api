import { Membership } from "../entities/Membership";

export interface IMembershipRepository {
  findAll(): Promise<Membership[]>;
  findById(id: string): Promise<Membership | null>;
  create(membership: Membership): Promise<Membership>;
  update(
    id: string,
    membership: Partial<Membership>
  ): Promise<Membership | null>;
  delete(id: string): Promise<boolean>;
}
