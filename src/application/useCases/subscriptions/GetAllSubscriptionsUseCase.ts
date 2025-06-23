import { MembershipSubscription } from "@domain/entities/MembershipSubscription";
import { IMembershipSubscriptionRepository } from "@domain/repositories/IMembershipSubscriptionRepository";
import {
  PaginationOptions,
  PaginationResult,
} from "@domain/repositories/IMemberRepository";

export class GetAllSubscriptionsUseCase {
  constructor(
    private subscriptionRepository: IMembershipSubscriptionRepository
  ) {}

  async execute(
    options?: PaginationOptions
  ): Promise<{
    subscriptions: PaginationResult<MembershipSubscription>;
    isEmpty: boolean;
  }> {
    const subscriptions = await this.subscriptionRepository.findAll(options);
    return {
      subscriptions,
      isEmpty: subscriptions.data.length === 0,
    };
  }
}
