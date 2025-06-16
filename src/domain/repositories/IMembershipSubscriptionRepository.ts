import { MembershipSubscription } from "../entities/MembershipSubscription";

export interface IMembershipSubscriptionRepository {
  findAll(): Promise<MembershipSubscription[]>;
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
