import { MembershipSubscription } from "@domain/entities/MembershipSubscription";
import {
  IMembershipSubscriptionRepository,
  SubscriptionFilter,
  SubscriptionPaginationOptions,
} from "@domain/repositories/IMembershipSubscriptionRepository";
import { PaginationResult } from "@domain/repositories/IMemberRepository";

export interface GetAllSubscriptionsOptions
  extends SubscriptionPaginationOptions {
  active?: boolean;
  memberId?: string;
  membershipId?: string;
  paymentStatus?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export class GetAllSubscriptionsUseCase {
  constructor(
    private subscriptionRepository: IMembershipSubscriptionRepository
  ) {}

  async execute(options?: GetAllSubscriptionsOptions): Promise<{
    subscriptions: PaginationResult<MembershipSubscription>;
    isEmpty: boolean;
  }> {
    // Preparar opciones de filtrado
    const filter: SubscriptionFilter = {};

    if (options?.active !== undefined) {
      filter.active = options.active;
    }

    if (options?.memberId) {
      filter.memberId = options.memberId;
    }

    if (options?.membershipId) {
      filter.membershipId = options.membershipId;
    }

    if (options?.paymentStatus) {
      filter.paymentStatus = options.paymentStatus;
    }

    if (options?.startDateFrom) {
      filter.startDateFrom = new Date(options.startDateFrom);
    }

    if (options?.startDateTo) {
      filter.startDateTo = new Date(options.startDateTo);
    }

    if (options?.endDateFrom) {
      filter.endDateFrom = new Date(options.endDateFrom);
    }

    if (options?.endDateTo) {
      filter.endDateTo = new Date(options.endDateTo);
    }

    const paginationOptions: SubscriptionPaginationOptions = {
      page: options?.page,
      limit: options?.limit,
      filter: filter,
      sortBy: options?.sortBy,
      sortOrder: options?.sortOrder,
    };

    const subscriptions = await this.subscriptionRepository.findAll(
      paginationOptions
    );
    return {
      subscriptions,
      isEmpty: subscriptions.data.length === 0,
    };
  }
}
