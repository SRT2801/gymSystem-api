import { Request, Response } from "express";
import { MembershipRepository } from "@infrastructure/repositories/MembershipRepository";

const membershipRepository = new MembershipRepository();

export class MembershipsController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description, price, durationDays } = req.body;

      const membership = await membershipRepository.create({
        name,
        description,
        price,
        durationDays,
        active: true,
      });

      return res.status(201).json(membership);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const memberships = await membershipRepository.findAll();
      return res.status(200).json(memberships);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const membership = await membershipRepository.findById(id);

      if (!membership) {
        return res.status(404).json({ message: "Membresía no encontrada" });
      }

      return res.status(200).json(membership);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const membership = await membershipRepository.update(id, updateData);

      if (!membership) {
        return res.status(404).json({ message: "Membresía no encontrada" });
      }

      return res.status(200).json(membership);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const deleted = await membershipRepository.delete(id);

      if (!deleted) {
        return res.status(404).json({ message: "Membresía no encontrada" });
      }

      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
