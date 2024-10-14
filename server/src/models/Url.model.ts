import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IUrl extends Document {
  id: number;
  originalUrl: string;
  user: ObjectId;
  shortUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const UrlSchema: Schema = new mongoose.Schema(
  {
    id: { type: Schema.Types.BigInt, required: true, unique: true },
    originalUrl: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    shortUrl: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  {
    timestamps: true,
    _id: true, // Ensure _id is enabled
  }
);

UrlSchema.method("toJSON", function () {
  const object = this.toObject() as Record<string, any>;
  object.id = object._id;
  delete object._id;
  delete object.__v;
  return object;
});

const Url = mongoose.model<IUrl>("Url", UrlSchema);
export default Url;
