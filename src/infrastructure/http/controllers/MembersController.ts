import { Request, Response } from "express";
import { CreateMemberUseCase } from "@application/useCases/members/CreateMemberUseCase";
import { GetAllMembersUseCase } from "@application/useCases/members/GetAllMembersUseCase";
import { MemberRepository } from "@infrastructure/repositories/MemberRepository";
import {
  formatDate,
  formatDateOnly,
} from "@infrastructure/common/utils/dateFormatter";
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

        const formattedMember = {
          ...member,
          birthDate: formatDateOnly(member.birthDate),
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
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Manejar filtrado por estado (activo/inactivo)
      let active: boolean | undefined = undefined;
      if (req.query.active !== undefined) {
        // Convertimos el string a booleano
        active = req.query.active === "true";
      }

      const getAllMembersUseCase = new GetAllMembersUseCase(memberRepository);
      const { members, isEmpty } = await getAllMembersUseCase.execute({
        page,
        limit,
        active,
      });

      if (isEmpty) {
        return res.status(200).json({
          message: "No hay miembros registrados actualmente",
          data: [],
          pagination: {
            total: 0,
            page,
            limit,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        });
      }

      const formattedMembers = members.data.map((member) => ({
        ...member,
        birthDate: formatDateOnly(member.birthDate),
        registrationDate: formatDate(member.registrationDate),
      }));

      return res.status(200).json({
        message: `Se encontraron ${members.total} miembros`,
        data: formattedMembers,
        pagination: {
          total: members.total,
          page: members.page,
          limit: members.limit,
          totalPages: members.totalPages,
          hasNextPage: members.hasNextPage,
          hasPrevPage: members.hasPrevPage,
        },
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
        birthDate: formatDateOnly(member.birthDate),
        registrationDate: formatDate(member.registrationDate),
      };

      return res.status(200).json(formattedMember);
    }
  );
  update = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { id } = req.params;
      const updateData = req.body;

      // Verificar si se está actualizando el documentId y si ya existe
      if (updateData.documentId) {
        const existingMember = await memberRepository.findByDocumentId(
          updateData.documentId
        );
        if (existingMember && existingMember.id !== id) {
          throw new ConflictError(
            "Ya existe un miembro con este número de documento"
          );
        }
      }

      const member = await memberRepository.update(id, updateData);

      if (!member) {
        throw new NotFoundError("Miembro no encontrado");
      }

      const formattedMember = {
        ...member,
        birthDate: member.birthDate
          ? formatDateOnly(member.birthDate)
          : undefined,
        registrationDate: member.registrationDate
          ? formatDate(member.registrationDate)
          : undefined,
      };

      return res.status(200).json(formattedMember);
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
