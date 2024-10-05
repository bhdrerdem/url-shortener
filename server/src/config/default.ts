import * as dotenv from "dotenv";
dotenv.config();

export type DBConfig = {
  host: string;
  user: string;
  password: string;
  database: string;
};

export type RedisConfig = {
  url: string;
};

export type MongoConfig = {
  url: string;
};

export type IDGeneratorConfig = {
  datacenterId: number;
  machineId: number;
};

export type Config = {
  port: number;
  db: DBConfig;
  redis: RedisConfig;
  mongo: MongoConfig;
  idGeneratorConfig: IDGeneratorConfig;
  host: string;
};

export default {
  port: process.env.PORT || 3001,
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "adm1n",
    database: process.env.DB_NAME || "url_db",
  } as DBConfig,
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  } as RedisConfig,
  mongo: {
    url: process.env.MONGO_URL || "mongodb://localhost:27017/url-shortener",
  } as MongoConfig,
  idGeneratorConfig: {
    datacenterId: parseInt(process.env.DATA_CENTER_ID || "1"),
    machineId: parseInt(process.env.MACHINE_ID || "1"),
  } as IDGeneratorConfig,
  host: process.env.HOST || "http://localhost:3001",
} as Config;
