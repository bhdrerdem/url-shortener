import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { IAuthInfo } from "./AuthInfo.model";

export interface IUser extends Document {
  _id: ObjectId;
  email: string;
  authInfo: mongoose.Schema.Types.ObjectId | IAuthInfo;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    authInfo: { type: Schema.Types.ObjectId, ref: "AuthInfo", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

UserSchema.method("toJSON", function () {
  const object = this.toObject() as Record<string, any>;
  object.id = object._id;
  delete object._id;
  delete object.__v;
  return object;
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
