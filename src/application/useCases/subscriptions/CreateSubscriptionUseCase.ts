import { MembershipSubscription } from "@domain/entities/MembershipSubscription";
import { IMemberRepository } from "@domain/repositories/IMemberRepository";
import { IMembershipRepository } from "@domain/repositories/IMembershipRepository";
import { IMembershipSubscriptionRepository } from "@domain/repositories/IMembershipSubscriptionRepository";

interface CreateSubscriptionDTO {
  memberId: string;
  membershipId: string;
  startDate: Date;
  paymentStatus: "pending" | "completed" | "failed";
  paymentAmount: number;
  paymentDate?: Date;
}

export class CreateSubscriptionUseCase {
  constructor(
    private subscriptionRepository: IMembershipSubscriptionRepository,
    private memberRepository: IMemberRepository,
    private membershipRepository: IMembershipRepository
  ) {}

  async execute(data: CreateSubscriptionDTO): Promise<MembershipSubscription> {
    const member = await this.memberRepository.findById(data.memberId);
    if (!member) {
      throw new Error("Miembro no encontrado");
    }

    const membership = await this.membershipRepository.findById(
      data.membershipId
    );
    if (!membership) {
      throw new Error("Membresía no encontrada");
    }

    const priceDifference = Math.abs(membership.price - data.paymentAmount);
    const priceTolerance = 0.01;
    if (priceDifference > priceTolerance) {
      throw new Error(
        `El monto de pago (${data.paymentAmount}) no coincide con el precio de la membresía (${membership.price})`
      );
    }

    const startDate = data.startDate || new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + membership.durationDays);

    const subscription: MembershipSubscription = {
      memberId: data.memberId,
      membershipId: data.membershipId,
      membershipName: membership.name,
      startDate,
      endDate,
      paymentStatus: data.paymentStatus,
      paymentAmount: data.paymentAmount,
      paymentDate: data.paymentDate,
      active: true,
    };

    return this.subscriptionRepository.create(subscription);
  }
}
