import { MembershipSubscription } from "../entities/MembershipSubscription";
import { PaginationOptions, PaginationResult } from "./IMemberRepository";

export interface SubscriptionFilter {
  memberId?: string;
  membershipId?: string;
  active?: boolean;
  paymentStatus?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
}

export interface SubscriptionPaginationOptions extends PaginationOptions {
  filter?: SubscriptionFilter;
}

export interface IMembershipSubscriptionRepository {
  findAll(
    options?: SubscriptionPaginationOptions
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
