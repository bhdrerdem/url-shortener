import UrlMetric, { IUrlMetric } from "../models/UrlMetric.model";
import { Mongo } from "../storage/mongo";
import geoip from "geoip-lite";

const sendMetric = async (
  urlId: string,
  ip?: string,
  userAgent?: string,
  referrer?: string
): Promise<void> => {
  let country = null;
  let city = null;
  if (ip) {
    const geo = geoip.lookup(ip);
    if (geo) {
      country = geo.country;
      city = geo.city;
    }
  }

  const event: IUrlMetric = {
    url: urlId,
    timestamp: new Date(),
    ipAddress: ip,
    userAgent: userAgent,
    referrer: referrer,
    location: {
      country: country || undefined,
      city: city || undefined,
    },
  };

  const clickEvent = new UrlMetric(event);
  await clickEvent.save();
};

export { sendMetric };
