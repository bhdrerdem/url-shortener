import mongoose from "mongoose";
import { DBConfig, MongoConfig } from "../config/default";
import { config } from "dotenv";

export class Mongo {
  private static instance: Mongo;
  public client!: mongoose.Connection;
  public config: MongoConfig;

  private constructor(config: MongoConfig) {
    this.config = config;
  }

  public static getInstance(): Mongo {
    if (!Mongo.instance) {
      throw new Error("DB instance not initialized");
    }

    return Mongo.instance;
  }

  public static async init(config: MongoConfig): Promise<void> {
    if (!Mongo.instance) {
      Mongo.instance = new Mongo(config);
    }

    await Mongo.instance.connect();
  }

  public async connect(): Promise<void> {
    try {
      this.client = await mongoose
        .connect(this.config.url)
        .then(() => mongoose.connection);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error(`Error connecting to MongoDB: ${error}`);
      throw error;
    }
  }

  public async ping(): Promise<void> {
    await this.client.db?.admin().ping();
  }

  public getHealthCheck(): boolean {
    return this.client.readyState === 1;
  }

  public async close(): Promise<void> {
    await this.client.close();
  }
}
