import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "staff", "member"],
      default: "member",
    },
    active: { type: Boolean, default: true },
    memberId: { type: Schema.Types.ObjectId, ref: "Member" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const UserModel = mongoose.model("User", UserSchema);
