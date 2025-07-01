import mongoose, { Schema } from "mongoose";

const MemberSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: {
      type: String,
      required: false,
    },
    documentId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    birthDate: {
      type: Date,

      required: false,
    },
    registrationDate: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
    completeProfile: { type: Boolean, default: false },

    password: { type: String },
    hasAccount: { type: Boolean, default: false },
    googleId: { type: String, sparse: true, unique: true },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    profilePicture: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const MemberModel = mongoose.model("Member", MemberSchema);
