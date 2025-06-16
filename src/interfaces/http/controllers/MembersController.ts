import { Request, Response } from "express";
import { CreateMemberUseCase } from "@application/useCases/members/CreateMemberUseCase";
import { GetAllMembersUseCase } from "@application/useCases/members/GetAllMembersUseCase";
import { MemberRepository } from "@infrastructure/repositories/MemberRepository";

const memberRepository = new MemberRepository();

export class MembersController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, phone, documentId, birthDate } = req.body;

      const createMemberUseCase = new CreateMemberUseCase(memberRepository);
      const member = await createMemberUseCase.execute({
        name,
        email,
        phone,
        documentId,
        birthDate: new Date(birthDate),
        active: true,
      });

      return res.status(201).json(member);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const getAllMembersUseCase = new GetAllMembersUseCase(memberRepository);
      const members = await getAllMembersUseCase.execute();

      return res.status(200).json(members);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const member = await memberRepository.findById(id);

      if (!member) {
        return res.status(404).json({ message: "Miembro no encontrado" });
      }

      return res.status(200).json(member);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const member = await memberRepository.update(id, updateData);

      if (!member) {
        return res.status(404).json({ message: "Miembro no encontrado" });
      }

      return res.status(200).json(member);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const deleted = await memberRepository.delete(id);

      if (!deleted) {
        return res.status(404).json({ message: "Miembro no encontrado" });
      }

      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
