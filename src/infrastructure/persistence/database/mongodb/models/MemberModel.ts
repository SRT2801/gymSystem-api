import mongoose, { Schema } from "mongoose";

const MemberSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    documentId: { type: String, required: true },
    birthDate: { type: Date, required: true },
    registrationDate: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },

    password: { type: String },
    hasAccount: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const MemberModel = mongoose.model("Member", MemberSchema);
