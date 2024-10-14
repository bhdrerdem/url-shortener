import express, { Express, Request, Response } from "express";
import { Redis } from "./storage/redis";
import rateLimiter from "./middleware/rateLimiter";
import { createUrl, getUrl } from "./handlers/url.handler";
import cors from "cors";
import { Config } from "./config/default";
import { Mongo } from "./storage/mongo";
import requestIp from "request-ip";
import { IDGeneratorService } from "./services/id-generator.service";
import { login, register } from "./handlers/auth.handler";

export class Server {
  private config: Config;

  constructor(config: any) {
    this.config = config;
  }

  public async run() {
    await Redis.init(this.config.redis);
    //await DB.init(this.config.db);
    await Mongo.init(this.config.mongo);

    const redis = Redis.getInstance();
    //const db = DB.getInstance();
    const mongo = Mongo.getInstance();

    setInterval(async () => {
      try {
        if (!redis.getHealthCheck()) {
          console.log("Redis is not healthy, attempting to reconnect...");
          await redis.connect();
        }
        await redis.ping();
      } catch (error) {
        console.error("Error during Redis health check or reconnect:", error);
      }
    }, 10000);

    // setInterval(async () => {
    //   try {
    //     if (!db.getHealthCheck()) {
    //       console.log("Database is not healthy, attempting to reconnect...");
    //       await db.connect();
    //     }
    //     await db.ping();
    //   } catch (error) {
    //     console.error(
    //       "Error during database health check or reconnect:",
    //       error
    //     );
    //   }
    // }, 10000);

    setInterval(async () => {
      try {
        if (!mongo.getHealthCheck()) {
          console.log("Mongo db is not healthy, attempting to reconnect...");
          await mongo.connect();
        }
        await mongo.ping();
      } catch (error) {
        console.error(
          "Error during mongo database health check or reconnect:",
          error
        );
      }
    }, 10000);

    IDGeneratorService.init(this.config.idGeneratorConfig);

    const app = express();
    const port = this.config.port;

    app.use(cors());

    app.use(express.json());
    app.use(requestIp.mw());
    app.use(rateLimiter);

    app.get("/urls/:id", getUrl);
    app.post("urls/", createUrl(this.config.host));
    app.post("/auth/login", login);
    app.post("/auth/register", register);

    app.listen(port, () => {
      console.log(`Server is running at ${this.config.host}`);
    });
  }
}
