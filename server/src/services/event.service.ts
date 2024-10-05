import ClickEvent, { IClickEvent } from "../models/ClickEvent";
import { Mongo } from "../storage/mongo";
import geoip from "geoip-lite";

const sendClickEvent = async (
  tinyUrl: string,
  originalUrl: string,
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

  const event: IClickEvent = {
    tinyUrl: tinyUrl,
    originalUrl: originalUrl,
    timestamp: new Date(),
    ipAddress: ip,
    userAgent: userAgent,
    referrer: referrer,
    location: {
      country: country || undefined,
      city: city || undefined,
    },
  };

  const clickEvent = new ClickEvent(event);
  await clickEvent.save();
};

export { sendClickEvent };
