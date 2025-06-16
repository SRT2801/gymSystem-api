import mongoose, { Schema } from "mongoose";

const MembershipSubscriptionSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, required: true, ref: "Member" },
    membershipId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Membership",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentAmount: { type: Number, required: true },
    paymentDate: { type: Date },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const MembershipSubscriptionModel = mongoose.model(
  "MembershipSubscription",
  MembershipSubscriptionSchema
);
