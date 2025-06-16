import { Membership } from "@domain/entities/Membership";
import { IMembershipRepository } from "@domain/repositories/IMembershipRepository";
import { MembershipModel } from "@infrastructure/persistence/database/mongodb/models/MembershipModel";

export class MembershipRepository implements IMembershipRepository {
  async findAll(): Promise<Membership[]> {
    const memberships = await MembershipModel.find();
    return memberships.map((membership) => ({
      id: membership._id.toString(),
      name: membership.name,
      description: membership.description ?? "",
      price: membership.price,
      durationDays: membership.durationDays,
      active: membership.active,
    }));
  }

  async findById(id: string): Promise<Membership | null> {
    const membership = await MembershipModel.findById(id);
    if (!membership) return null;

    return {
      id: membership._id.toString(),
      name: membership.name,
      description: membership.description ?? "",
      price: membership.price,
      durationDays: membership.durationDays,
      active: membership.active,
    };
  }

  async create(membershipData: Membership): Promise<Membership> {
    const membership = await MembershipModel.create(membershipData);

    return {
      id: membership._id.toString(),
      name: membership.name,
      description: membership.description ?? "",
      price: membership.price,
      durationDays: membership.durationDays,
      active: membership.active,
    };
  }

  async update(
    id: string,
    membershipData: Partial<Membership>
  ): Promise<Membership | null> {
    const membership = await MembershipModel.findByIdAndUpdate(
      id,
      membershipData,
      { new: true }
    );

    if (!membership) return null;

    return {
      id: membership._id.toString(),
      name: membership.name,
      description: membership.description ?? "",
      price: membership.price,
      durationDays: membership.durationDays,
      active: membership.active,
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = await MembershipModel.findByIdAndDelete(id);
    return !!result;
  }
}
