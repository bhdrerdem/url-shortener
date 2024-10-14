import Url, { IUrl } from "../models/Url.model";
import { IUser } from "../models/User.model";
import { Redis } from "../storage/redis";
import { convertToBase62 } from "../utils/helper";
import { IDGeneratorService } from "./id-generator.service";

const redisUrlPrefix = "urls:";
const redisTinyUrlPrefix = "tiny_urls:";

async function getLongUrl(tinyUrl: string) {
  if (tinyUrl === "") {
    throw new Error("URL cannot be empty");
  }

  const redisClient = Redis.getInstance();
  try {
    const url = await redisClient.hget(
      redisUrlPrefix,
      `${redisTinyUrlPrefix}${tinyUrl}`
    );
    if (url) {
      return JSON.parse(url);
    }
  } catch (error) {
    console.error("Error getting URL from Redis:", error);
  }

  let url;
  try {
    url = await Url.findOne({ tinyUrl });
  } catch (error) {
    console.error("Error getting URL from MongoDB:", error);
    throw error;
  }

  if (!url) {
    throw new Error("URL not found");
  }

  try {
    await redisClient.hset(
      redisUrlPrefix,
      `${redisTinyUrlPrefix}${tinyUrl}`,
      url.toJSON()
    );
  } catch (error) {
    console.error("Error caching URL in Redis:", error);
  }

  return url;
}

async function createTinyUrl(
  longUrl: string,
  user: IUser | null = null
): Promise<IUrl> {
  if (longUrl === "") {
    throw new Error("URL cannot be empty");
  }

  let id;
  try {
    id = IDGeneratorService.getInstance().generate();
  } catch (error) {
    console.error("Error generating ID:", error);
    throw error;
  }

  const tinyUrl = convertToBase62(id);

  let url;
  try {
    url = await new Url({
      id,
      longUrl,
      tinyUrl,
      user,
    }).save();
  } catch (error) {
    console.error("Error saving URL:", error);
    throw error;
  }

  const redisClient = Redis.getInstance();
  try {
    await redisClient.hset(
      redisUrlPrefix,
      `${redisTinyUrlPrefix}${tinyUrl}`,
      url.toJSON()
    );
  } catch (error) {
    console.error("Error caching URL in Redis:", error);
  }

  return url;
}

export { getLongUrl, createTinyUrl };
