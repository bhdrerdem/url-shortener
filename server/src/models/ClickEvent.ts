import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IClickEvent {
  tinyUrl: string;
  originalUrl: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  location?: {
    country?: string;
    city?: string;
  };
}

const ClickEventSchema: Schema = new mongoose.Schema({
  tinyUrl: { type: String, required: true },
  originalUrl: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String },
  referrer: { type: String },
  location: {
    country: { type: String },
    city: { type: String },
  },
});

const ClickEvent = mongoose.model<IClickEvent>("ClickEvent", ClickEventSchema);
export default ClickEvent;
