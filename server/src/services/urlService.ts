import { DB } from "../storage/db";
import { Redis } from "../storage/redis";
import { convertToBase62 } from "../utils/helper";
import { IDGeneratorService } from "./idGeneratorService";

const redisUrlPrefix = "urls:";
const redisTinyUrlPrefix = "tiny_urls:";
const redisLongUrlPrefix = "long_urls:";

const getUrlSql = `SELECT * FROM urls WHERE url = ?`;
const getTinyUrlSql = `SELECT * FROM urls WHERE tiny_url = ?`;
const insertUrlSql = `INSERT INTO urls (id, url, tiny_url) VALUES (?, ?, ?)`;

async function getLongUrl(tinyUrl: string) {
  if (tinyUrl === "") {
    console.error("Tiny URL cannot be empty");
    throw new Error("URL cannot be empty");
  }

  const redisClient = Redis.getInstance();
  try {
    const cacheUrl = await redisClient.hget(
      redisUrlPrefix,
      `${redisTinyUrlPrefix}${tinyUrl}`
    );
    if (cacheUrl) {
      return cacheUrl;
    }
  } catch (error) {
    console.error("Error getting URL from Redis:", error);
  }

  const dbClient = DB.getInstance();
  const result = await dbClient.query(getTinyUrlSql, [tinyUrl]);
  if (!result.length) {
    console.error("Long URL not found", tinyUrl);
    return null;
  }

  const longUrl = result[0].url;

  try {
    await redisClient.hset(
      redisUrlPrefix,
      `${redisTinyUrlPrefix}${tinyUrl}`,
      longUrl
    );
  } catch (error) {
    console.error("Error caching URL in Redis:", error);
  }

  return longUrl;
}

async function createTinyUrl(url: string) {
  if (url === "") {
    throw new Error("URL cannot be empty");
  }

  const dbClient = DB.getInstance();

  let id;
  try {
    id = IDGeneratorService.getInstance().generate();
  } catch (error) {
    console.error("Error generating ID:", error);
    throw error;
  }

  const tinyUrl = convertToBase62(id);

  await dbClient.query(insertUrlSql, [id, url, tinyUrl]);

  try {
    const redisClient = Redis.getInstance();
    await redisClient.hset(
      redisUrlPrefix,
      `${redisTinyUrlPrefix}${tinyUrl}`,
      url
    );
    await redisClient.hset(
      redisUrlPrefix,
      `${redisLongUrlPrefix}${url}`,
      tinyUrl
    );
  } catch (error) {
    console.error("Error caching URL in Redis:", error);
  }

  return tinyUrl;
}

async function getTinyUrlByLongUrl(url: string) {
  if (url === "") {
    throw new Error("url cannot be empty");
  }

  const redisClient = Redis.getInstance();
  const cacheUrl = await redisClient.hget(
    redisUrlPrefix,
    `${redisLongUrlPrefix}${url}`
  );

  if (cacheUrl !== null) {
    return cacheUrl;
  }

  const dbClient = DB.getInstance();
  const result = await dbClient.query(getUrlSql, [url]);
  if (!result.length) {
    throw new Error("URL not found");
  }

  return result[0].tiny_url;
}

export { getLongUrl, createTinyUrl, getTinyUrlByLongUrl };
