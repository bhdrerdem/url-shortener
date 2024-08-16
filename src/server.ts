import express, { Express, Request, Response } from "express";
import { Redis } from "./storage/redis";
import { DB } from "./storage/db";
import rateLimiter from "./middleware/rateLimiter";
import { IDGeneratorService } from "./services/idGeneratorService";
import { createUrl, getUrl } from "./handlers/url.handler";
import cors from "cors";
import { Config } from "./config/default";

export class Server {
    private config: Config;

    constructor(config: any) {
        this.config = config;
    }

    public async run() {
        await Redis.init(this.config.redis);
        await DB.init(this.config.db);

        const redis = Redis.getInstance();
        const db = DB.getInstance();

        setInterval(async () => {
            try {
                if (!redis.getHealthCheck()) {
                    console.log(
                        "Redis is not healthy, attempting to reconnect..."
                    );
                    await redis.connect();
                }
                await redis.ping();
            } catch (error) {
                console.error(
                    "Error during Redis health check or reconnect:",
                    error
                );
            }
        }, 10000);

        setInterval(async () => {
            try {
                if (!db.getHealthCheck()) {
                    console.log(
                        "Database is not healthy, attempting to reconnect..."
                    );
                    await db.connect();
                }
                await db.ping();
            } catch (error) {
                console.error(
                    "Error during database health check or reconnect:",
                    error
                );
            }
        }, 10000);

        IDGeneratorService.init(this.config.idGeneratorConfig);

        const app = express();
        const port = this.config.port;

        app.use(cors());

        app.use(express.json());
        app.use(rateLimiter);

        app.get("/:id", getUrl);
        app.post("/", createUrl(this.config.host));

        app.listen(port, () => {
            console.log(`Server is running at ${this.config.host}`);
        });
    }
}
