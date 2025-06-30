import { MembershipSubscription } from "@domain/entities/MembershipSubscription";
import {
  IMembershipSubscriptionRepository,
  SubscriptionFilter,
  SubscriptionPaginationOptions,
} from "@domain/repositories/IMembershipSubscriptionRepository";
import { PaginationResult } from "@domain/repositories/IMemberRepository";
import { MembershipSubscriptionModel } from "@infrastructure/persistence/database/mongodb/models/MembershipSubscriptionModel";

export class MembershipSubscriptionRepository
  implements IMembershipSubscriptionRepository
{
  async findAll(
    options?: SubscriptionPaginationOptions
  ): Promise<PaginationResult<MembershipSubscription>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;


    const filter: any = {};

    if (options?.filter) {
      if (options.filter.active !== undefined) {
        filter.active = options.filter.active;
      }

      if (options.filter.memberId) {
        filter.memberId = options.filter.memberId;
      }

      if (options.filter.membershipId) {
        filter.membershipId = options.filter.membershipId;
      }

      if (options.filter.paymentStatus) {
        filter.paymentStatus = options.filter.paymentStatus;
      }


      if (options.filter.startDateFrom || options.filter.startDateTo) {
        filter.startDate = {};

        if (options.filter.startDateFrom) {
          filter.startDate.$gte = options.filter.startDateFrom;
        }

        if (options.filter.startDateTo) {
          filter.startDate.$lte = options.filter.startDateTo;
        }
      }


      if (options.filter.endDateFrom || options.filter.endDateTo) {
        filter.endDate = {};

        if (options.filter.endDateFrom) {
          filter.endDate.$gte = options.filter.endDateFrom;
        }

        if (options.filter.endDateTo) {
          filter.endDate.$lte = options.filter.endDateTo;
        }
      }
    }

  
    let sortOptions = {};
    if (options?.sortBy) {
      sortOptions = {
        [options.sortBy]: options.sortOrder === "desc" ? -1 : 1,
      };
    } else {

      sortOptions = { startDate: -1 };
    }

    const [subscriptions, total] = await Promise.all([
      MembershipSubscriptionModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sortOptions),
      MembershipSubscriptionModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: subscriptions.map((sub) => ({
        id: sub._id.toString(),
        memberId: sub.memberId.toString(),
        membershipId: sub.membershipId.toString(),
        membershipName: sub.membershipName,
        startDate: sub.startDate,
        endDate: sub.endDate,
        paymentStatus: sub.paymentStatus,
        paymentAmount: sub.paymentAmount,
        paymentDate: sub.paymentDate,
        active: sub.active,
      })),
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  async findById(id: string): Promise<MembershipSubscription | null> {
    const subscription = await MembershipSubscriptionModel.findById(id);
    if (!subscription) return null;

    return {
      id: subscription._id.toString(),
      memberId: subscription.memberId.toString(),
      membershipId: subscription.membershipId.toString(),
      membershipName: subscription.membershipName,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      paymentStatus: subscription.paymentStatus,
      paymentAmount: subscription.paymentAmount,
      paymentDate: subscription.paymentDate,
      active: subscription.active,
    };
  }

  async findByMemberId(memberId: string): Promise<MembershipSubscription[]> {
    const subscriptions = await MembershipSubscriptionModel.find({ memberId });
    return subscriptions.map((sub) => ({
      id: sub._id.toString(),
      memberId: sub.memberId.toString(),
      membershipId: sub.membershipId.toString(),
      membershipName: sub.membershipName,
      startDate: sub.startDate,
      endDate: sub.endDate,
      paymentStatus: sub.paymentStatus,
      paymentAmount: sub.paymentAmount,
      paymentDate: sub.paymentDate,
      active: sub.active,
    }));
  }

  async findActiveByMemberId(
    memberId: string
  ): Promise<MembershipSubscription | null> {
    const today = new Date();
    const subscription = await MembershipSubscriptionModel.findOne({
      memberId,
      active: true,
      startDate: { $lte: today },
      endDate: { $gte: today },
    });

    if (!subscription) return null;

    return {
      id: subscription._id.toString(),
      memberId: subscription.memberId.toString(),
      membershipId: subscription.membershipId.toString(),
      membershipName: subscription.membershipName,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      paymentStatus: subscription.paymentStatus,
      paymentAmount: subscription.paymentAmount,
      paymentDate: subscription.paymentDate,
      active: subscription.active,
    };
  }

  async create(
    subscriptionData: MembershipSubscription
  ): Promise<MembershipSubscription> {
    const subscription = await MembershipSubscriptionModel.create(
      subscriptionData
    );

    return {
      id: subscription._id.toString(),
      memberId: subscription.memberId.toString(),
      membershipId: subscription.membershipId.toString(),
      membershipName: subscription.membershipName,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      paymentStatus: subscription.paymentStatus,
      paymentAmount: subscription.paymentAmount,
      paymentDate: subscription.paymentDate,
      active: subscription.active,
    };
  }

  async update(
    id: string,
    subscriptionData: Partial<MembershipSubscription>
  ): Promise<MembershipSubscription | null> {
    const subscription = await MembershipSubscriptionModel.findByIdAndUpdate(
      id,
      subscriptionData,
      { new: true }
    );

    if (!subscription) return null;

    return {
      id: subscription._id.toString(),
      memberId: subscription.memberId.toString(),
      membershipId: subscription.membershipId.toString(),
      membershipName: subscription.membershipName,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      paymentStatus: subscription.paymentStatus,
      paymentAmount: subscription.paymentAmount,
      paymentDate: subscription.paymentDate,
      active: subscription.active,
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = await MembershipSubscriptionModel.findByIdAndDelete(id);
    return !!result;
  }
}
