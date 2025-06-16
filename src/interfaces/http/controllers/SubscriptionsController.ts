import { Request, Response } from "express";
import { CreateSubscriptionUseCase } from "../../../application/useCases/subscriptions/CreateSubscriptionUseCase";
import { MemberRepository } from "../../../infrastructure/repositories/MemberRepository";
import { MembershipRepository } from "../../../infrastructure/repositories/MembershipRepository";
import { MembershipSubscriptionRepository } from "../../../infrastructure/repositories/MembershipSubscriptionRepository";

const memberRepository = new MemberRepository();
const membershipRepository = new MembershipRepository();
const subscriptionRepository = new MembershipSubscriptionRepository();

function formatDate(date: Date | string | undefined | null): string | null {
  if (!date) return null;

  const d = new Date(date);

  // Formato DD/MM/YYYY HH:MM
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export class SubscriptionsController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const {
        memberId,
        membershipId,
        startDate,
        paymentStatus,
        paymentAmount,
        paymentDate,
      } = req.body;

      const createSubscriptionUseCase = new CreateSubscriptionUseCase(
        subscriptionRepository,
        memberRepository,
        membershipRepository
      );

      const subscription = await createSubscriptionUseCase.execute({
        memberId,
        membershipId,
        startDate: startDate ? new Date(startDate) : new Date(),
        paymentStatus,
        paymentAmount,
        paymentDate: paymentDate ? new Date(paymentDate) : undefined,
      });

      return res.status(201).json(subscription);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const subscriptions = await subscriptionRepository.findAll();

      const enrichedSubscriptions = await Promise.all(
        subscriptions.map(async (subscription) => {
          const membership = await membershipRepository.findById(
            subscription.membershipId
          );

          return {
            id: subscription.id,
            memberId: subscription.memberId,
            membershipId: subscription.membershipId,
            membershipName: membership
              ? membership.name
              : "Membresía no encontrada",
            startDate: formatDate(subscription.startDate),
            endDate: formatDate(subscription.endDate),
            paymentStatus: subscription.paymentStatus,
            paymentAmount: subscription.paymentAmount,
            paymentDate: formatDate(subscription.paymentDate),
            active: subscription.active,
          };
        })
      );

      return res.status(200).json(enrichedSubscriptions);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const subscription = await subscriptionRepository.findById(id);

      if (!subscription) {
        return res.status(404).json({ message: "Suscripción no encontrada" });
      }

      const membership = await membershipRepository.findById(
        subscription.membershipId
      );

      const enrichedSubscription = {
        id: subscription.id,
        memberId: subscription.memberId,
        membershipId: subscription.membershipId,
        membershipName: membership
          ? membership.name
          : "Membresía no encontrada",
        startDate: formatDate(subscription.startDate),
        endDate: formatDate(subscription.endDate),
        paymentStatus: subscription.paymentStatus,
        paymentAmount: subscription.paymentAmount,
        paymentDate: formatDate(subscription.paymentDate),
        active: subscription.active,
      };

      return res.status(200).json(enrichedSubscription);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getByMemberId(req: Request, res: Response): Promise<Response> {
    try {
      const { memberId } = req.params;
      const subscriptions = await subscriptionRepository.findByMemberId(
        memberId
      );

      const enrichedSubscriptions = await Promise.all(
        subscriptions.map(async (subscription) => {
          const membership = await membershipRepository.findById(
            subscription.membershipId
          );

          return {
            id: subscription.id,
            memberId: subscription.memberId,
            membershipId: subscription.membershipId,
            membershipName: membership
              ? membership.name
              : "Membresía no encontrada",
            startDate: formatDate(subscription.startDate),
            endDate: formatDate(subscription.endDate),
            paymentStatus: subscription.paymentStatus,
            paymentAmount: subscription.paymentAmount,
            paymentDate: formatDate(subscription.paymentDate),
            active: subscription.active,
          };
        })
      );

      return res.status(200).json(enrichedSubscriptions);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getActiveMembership(req: Request, res: Response): Promise<Response> {
    try {
      const { memberId } = req.params;
      const subscription = await subscriptionRepository.findActiveByMemberId(
        memberId
      );

      if (!subscription) {
        return res.status(404).json({
          message: "No se encontró una suscripción activa para este miembro",
        });
      }

      const membership = await membershipRepository.findById(
        subscription.membershipId
      );

      const enrichedSubscription = {
        id: subscription.id,
        memberId: subscription.memberId,
        membershipId: subscription.membershipId,
        membershipName: membership
          ? membership.name
          : "Membresía no encontrada",
        startDate: formatDate(subscription.startDate),
        endDate: formatDate(subscription.endDate),
        paymentStatus: subscription.paymentStatus,
        paymentAmount: subscription.paymentAmount,
        paymentDate: formatDate(subscription.paymentDate),
        active: subscription.active,
      };

      return res.status(200).json(enrichedSubscription);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const subscription = await subscriptionRepository.update(id, updateData);

      if (!subscription) {
        return res.status(404).json({ message: "Suscripción no encontrada" });
      }

      return res.status(200).json(subscription);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const deleted = await subscriptionRepository.delete(id);

      if (!deleted) {
        return res.status(404).json({ message: "Suscripción no encontrada" });
      }

      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
