import { Request, Response } from "express";
import { formatDate } from "@infrastructure/common/utils/dateFormatter";
import { CreateSubscriptionUseCase } from "../../../application/useCases/subscriptions/CreateSubscriptionUseCase";
import { MemberRepository } from "../../../infrastructure/repositories/MemberRepository";
import { MembershipRepository } from "../../../infrastructure/repositories/MembershipRepository";
import { MembershipSubscriptionRepository } from "../../../infrastructure/repositories/MembershipSubscriptionRepository";

const memberRepository = new MemberRepository();
const membershipRepository = new MembershipRepository();
const subscriptionRepository = new MembershipSubscriptionRepository();

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

      // Si es un miembro, solo puede crear suscripciones para sí mismo
      if (req.user?.role === "member" && req.user.id !== memberId) {
        return res
          .status(403)
          .json({
            message: "Solo puedes adquirir membresías para tu propia cuenta",
          });
      }

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

      // Formatear las fechas antes de devolver la respuesta
      const formattedSubscription = {
        ...subscription,
        startDate: formatDate(subscription.startDate),
        endDate: formatDate(subscription.endDate),
        paymentDate: formatDate(subscription.paymentDate),
      };

      return res.status(201).json(formattedSubscription);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const subscriptions = await subscriptionRepository.findAll();

      const formattedSubscriptions = subscriptions.map(subscription => ({
        id: subscription.id,
        memberId: subscription.memberId,
        membershipId: subscription.membershipId,
        membershipName: subscription.membershipName,
        startDate: formatDate(subscription.startDate),
        endDate: formatDate(subscription.endDate),
        paymentStatus: subscription.paymentStatus,
        paymentAmount: subscription.paymentAmount,
        paymentDate: formatDate(subscription.paymentDate),
        active: subscription.active,
      }));

      return res.status(200).json(formattedSubscriptions);
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

      // Si es un miembro, solo puede ver sus propias suscripciones
      if (
        req.user?.role === "member" &&
        req.user.id !== subscription.memberId
      ) {
        return res.status(403).json({
          message: "No tienes permiso para ver esta suscripción",
        });
      }

      const formattedSubscription = {
        id: subscription.id,
        memberId: subscription.memberId,
        membershipId: subscription.membershipId,
        membershipName: subscription.membershipName,
        startDate: formatDate(subscription.startDate),
        endDate: formatDate(subscription.endDate),
        paymentStatus: subscription.paymentStatus,
        paymentAmount: subscription.paymentAmount,
        paymentDate: formatDate(subscription.paymentDate),
        active: subscription.active,
      };

      return res.status(200).json(formattedSubscription);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getByMemberId(req: Request, res: Response): Promise<Response> {
    try {
      const { memberId } = req.params;

      // Si es un miembro, solo puede ver sus propias suscripciones
      if (req.user?.role === "member" && req.user.id !== memberId) {
        return res.status(403).json({
          message: "Solo puedes ver tus propias suscripciones",
        });
      }

      const subscriptions = await subscriptionRepository.findByMemberId(
        memberId
      );

      const formattedSubscriptions = subscriptions.map(subscription => ({
        id: subscription.id,
        memberId: subscription.memberId,
        membershipId: subscription.membershipId,
        membershipName: subscription.membershipName,
        startDate: formatDate(subscription.startDate),
        endDate: formatDate(subscription.endDate),
        paymentStatus: subscription.paymentStatus,
        paymentAmount: subscription.paymentAmount,
        paymentDate: formatDate(subscription.paymentDate),
        active: subscription.active,
      }));

      return res.status(200).json(formattedSubscriptions);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getActiveMembership(req: Request, res: Response): Promise<Response> {
    try {
      const { memberId } = req.params;

      // Si es un miembro, solo puede ver su propia suscripción activa
      if (req.user?.role === "member" && req.user.id !== memberId) {
        return res.status(403).json({
          message: "Solo puedes ver tu propia suscripción activa",
        });
      }

      const subscription = await subscriptionRepository.findActiveByMemberId(
        memberId
      );

      if (!subscription) {
        return res.status(404).json({
          message: "No se encontró una suscripción activa para este miembro",
        });
      }

      const formattedSubscription = {
        id: subscription.id,
        memberId: subscription.memberId,
        membershipId: subscription.membershipId,
        membershipName: subscription.membershipName,
        startDate: formatDate(subscription.startDate),
        endDate: formatDate(subscription.endDate),
        paymentStatus: subscription.paymentStatus,
        paymentAmount: subscription.paymentAmount,
        paymentDate: formatDate(subscription.paymentDate),
        active: subscription.active,
      };

      return res.status(200).json(formattedSubscription);
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
