export interface MembershipSubscription {
  id?: string;
  memberId: string;
  membershipId: string;
  membershipName: string;
  startDate: Date;
  endDate: Date;
  paymentStatus: "pending" | "completed" | "failed";
  paymentAmount: number;
  paymentDate?: Date;
  active: boolean;
}
