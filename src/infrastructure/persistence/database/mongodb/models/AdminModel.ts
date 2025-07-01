import mongoose, { Schema } from "mongoose";

const AdminSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: {
      type: String,
      enum: ["admin", "staff"],
      default: "staff",
    },
    active: { type: Boolean, default: true },
    googleId: { type: String, sparse: true, unique: true },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    profilePicture: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const AdminModel = mongoose.model("Admin", AdminSchema);
