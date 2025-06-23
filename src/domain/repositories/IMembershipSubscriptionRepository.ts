import { MembershipSubscription } from "../entities/MembershipSubscription";
import { PaginationOptions, PaginationResult } from "./IMemberRepository";

export interface IMembershipSubscriptionRepository {
  findAll(
    options?: PaginationOptions
  ): Promise<PaginationResult<MembershipSubscription>>;
  findById(id: string): Promise<MembershipSubscription | null>;
  findByMemberId(memberId: string): Promise<MembershipSubscription[]>;
  findActiveByMemberId(
    memberId: string
  ): Promise<MembershipSubscription | null>;
  create(subscription: MembershipSubscription): Promise<MembershipSubscription>;
  update(
    id: string,
    subscription: Partial<MembershipSubscription>
  ): Promise<MembershipSubscription | null>;
  delete(id: string): Promise<boolean>;
}
