import mongoose, { Schema } from "mongoose";

const MembershipSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const MembershipModel = mongoose.model("Membership", MembershipSchema);
