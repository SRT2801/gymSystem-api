import { MembershipSubscription } from "@domain/entities/MembershipSubscription";
import { IMembershipSubscriptionRepository } from "@domain/repositories/IMembershipSubscriptionRepository";
import { MembershipSubscriptionModel } from "@infrastructure/persistence/database/mongodb/models/MembershipSubscriptionModel";

export class MembershipSubscriptionRepository
  implements IMembershipSubscriptionRepository
{
  async findAll(): Promise<MembershipSubscription[]> {
    const subscriptions = await MembershipSubscriptionModel.find();
    return subscriptions.map((sub) => ({
      id: sub._id.toString(),
      memberId: sub.memberId.toString(),
      membershipId: sub.membershipId.toString(),
      startDate: sub.startDate,
      endDate: sub.endDate,
      paymentStatus: sub.paymentStatus,
      paymentAmount: sub.paymentAmount,
      paymentDate: sub.paymentDate,
      active: sub.active,
    }));
  }

  async findById(id: string): Promise<MembershipSubscription | null> {
    const subscription = await MembershipSubscriptionModel.findById(id);
    if (!subscription) return null;

    return {
      id: subscription._id.toString(),
      memberId: subscription.memberId.toString(),
      membershipId: subscription.membershipId.toString(),
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
