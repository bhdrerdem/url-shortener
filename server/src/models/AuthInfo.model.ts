import mongoose, { Document, ObjectId, Schema } from "mongoose";

export enum Provider {
  GOOGLE = "google",
  LOCAL = "local",
}

export interface IAuthInfo extends Document {
  _id: ObjectId;
  provider: Provider;
  providerId: string;
  password?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const AuthInfoSchema: Schema = new mongoose.Schema(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
    password: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

AuthInfoSchema.method("toJSON", function () {
  const object = this.toObject() as Record<string, any>;
  object.id = object._id;
  delete object._id;
  delete object.__v;
  return object;
});

const AuthInfo = mongoose.model<IAuthInfo>("AuthInfo", AuthInfoSchema);
export default AuthInfo;
