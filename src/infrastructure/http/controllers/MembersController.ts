import { Request, Response } from "express";
import { CreateMemberUseCase } from "@application/useCases/members/CreateMemberUseCase";
import { GetAllMembersUseCase } from "@application/useCases/members/GetAllMembersUseCase";
import { MemberRepository } from "@infrastructure/repositories/MemberRepository";
import { formatDate } from "@infrastructure/common/utils/dateFormatter";
import { asyncHandler } from "../middlewares/errorHandler";
import {
  ValidationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from "@infrastructure/common/errors/AppError";

const memberRepository = new MemberRepository();

export class MembersController {
  create = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { name, email, phone, documentId, birthDate } = req.body;

      if (!name || !email || !phone || !documentId || !birthDate) {
        throw new ValidationError("Todos los campos son requeridos");
      }

      const createMemberUseCase = new CreateMemberUseCase(memberRepository);

      try {
        const member = await createMemberUseCase.execute({
          name,
          email,
          phone,
          documentId,
          birthDate: new Date(birthDate),
          active: true,
        });

        // Formatear las fechas antes de devolver la respuesta
        const formattedMember = {
          ...member,
          birthDate: formatDate(member.birthDate),
          registrationDate: formatDate(member.registrationDate),
        };

        return res.status(201).json(formattedMember);
      } catch (error: any) {
        if (error.message.includes("Ya existe un miembro")) {
          throw new ConflictError(error.message);
        }
        throw error;
      }
    }
  );

  getAll = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const getAllMembersUseCase = new GetAllMembersUseCase(memberRepository);
      const { members, isEmpty } = await getAllMembersUseCase.execute();

      if (isEmpty) {
        return res.status(200).json({
          message: "No hay miembros registrados actualmente",
          data: [],
        });
      }

      const formattedMembers = members.map((member) => ({
        ...member,
        birthDate: formatDate(member.birthDate),
        registrationDate: formatDate(member.registrationDate),
      }));

      return res.status(200).json({
        message: `Se encontraron ${members.length} miembros`,
        data: formattedMembers,
      });
    }
  );

  getById = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { id } = req.params;

      // Si es un miembro, solo puede ver sus propios datos
      if (req.user?.role === "member" && req.user.id !== id) {
        throw new ForbiddenError(
          "No tienes permiso para acceder a estos datos"
        );
      }

      const member = await memberRepository.findById(id);

      if (!member) {
        throw new NotFoundError("Miembro no encontrado");
      }

      const formattedMember = {
        ...member,
        birthDate: formatDate(member.birthDate),
        registrationDate: formatDate(member.registrationDate),
      };

      return res.status(200).json(formattedMember);
    }
  );

  update = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { id } = req.params;
      const updateData = req.body;

      const member = await memberRepository.update(id, updateData);

      if (!member) {
        throw new NotFoundError("Miembro no encontrado");
      }

      return res.status(200).json(member);
    }
  );

  delete = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { id } = req.params;
      const deleted = await memberRepository.delete(id);

      if (!deleted) {
        throw new NotFoundError("Miembro no encontrado");
      }

      return res.status(204).send();
    }
  );
}
