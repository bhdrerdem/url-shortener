import { Request, Response, NextFunction } from "express";
import { Redis } from "../storage/redis";

const rateLimitPrefix = "rate_limit:";
const RATE_LIMIT = 10;
const TIME_WINDOW = 60;

async function rateLimiter(req: Request, res: Response, next: NextFunction) {
    const clientIp = req?.ip;

    if (!clientIp) {
        return res.status(400).send("Bad Request");
    }

    const redisClient = Redis.getInstance();
    const key = `${rateLimitPrefix}${clientIp}`;
    const now = Math.floor(Date.now() / 1000);

    const [lastRequestTime, requestCount] = await redisClient.hmget(
        key,
        "lastRequestTime",
        "requestCount"
    );

    const lastTime = Number(lastRequestTime);
    const currentCount = Number(requestCount);

    // Last request was outside the time window or no requests have been made
    if (!lastRequestTime || now - lastTime > TIME_WINDOW) {
        await resetRateLimit(redisClient, key, now);
        setRateLimitHeaders(res, RATE_LIMIT, RATE_LIMIT - 1);
        return next();
    }

    if (currentCount + 1 > RATE_LIMIT) {
        const retryAfter = TIME_WINDOW - (now - lastTime);
        setRateLimitHeaders(res, RATE_LIMIT, 0, retryAfter);
        return res.status(429).send("Too Many Requests");
    }

    await incrementRequestCount(redisClient, key, currentCount, now);
    setRateLimitHeaders(res, RATE_LIMIT, RATE_LIMIT - (currentCount + 1));
    return next();
}

async function resetRateLimit(redisClient: any, key: string, now: number) {
    await redisClient.hmset(
        key,
        "lastRequestTime",
        String(now),
        "requestCount",
        String(1)
    );
    await redisClient.expire(key, TIME_WINDOW);
}

async function incrementRequestCount(
    redisClient: any,
    key: string,
    currentCount: number,
    now: number
) {
    await redisClient.hmset(
        key,
        "lastRequestTime",
        String(now),
        "requestCount",
        String(currentCount + 1)
    );
}

function setRateLimitHeaders(
    res: Response,
    limit: number,
    remaining: number,
    retryAfter?: number
) {
    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", remaining);
    if (retryAfter !== undefined) {
        res.setHeader("Retry-After", retryAfter);
    }
}

export default rateLimiter;
