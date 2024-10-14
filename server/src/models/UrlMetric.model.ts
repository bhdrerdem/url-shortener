import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { IUrl } from "./Url.model";

export interface IUrlMetric {
  url: string | IUrl;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  location?: {
    country?: string;
    city?: string;
  };
}

const UrlMetricSchema: Schema = new mongoose.Schema({
  url: { type: Schema.Types.String, ref: "Url", required: true },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String },
  referrer: { type: String },
  location: {
    country: { type: String },
    city: { type: String },
  },
});

const UrlMetric = mongoose.model<IUrlMetric>("UrlMetric", UrlMetricSchema);
export default UrlMetric;
