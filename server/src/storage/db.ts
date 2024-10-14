// import mysql, { RowDataPacket } from "mysql2/promise";
// import { DBConfig } from "../config/default";

// export class DB {
//     private static instance: DB;
//     private config: DBConfig;
//     private health: boolean = false;
//     private client!: mysql.Pool;
//     private runningMigrations: boolean = false;

//     constructor(dbConfig: DBConfig) {
//         this.config = dbConfig;
//     }

//     public static getInstance(): DB {
//         if (!DB.instance || !DB.instance.getHealthCheck()) {
//             throw new Error("DB instance not initialized");
//         }

//         return DB.instance;
//     }

//     public static async init(config: DBConfig): Promise<void> {
//         if (!DB.instance) {
//             DB.instance = new DB(config);
//         }

//         await DB.instance.connect();
//         await DB.instance.runMigrations();
//     }

//     public getHealthCheck() {
//         return this.health;
//     }

//     public async connect() {
//         try {
//             this.client = mysql.createPool({
//                 host: this.config.host,
//                 user: this.config.user,
//                 password: this.config.password,
//                 database: this.config.database,
//                 waitForConnections: true,
//                 connectionLimit: 10,
//                 queueLimit: 0,
//             });

//             console.log("Connected to DB");

//             this.health = true;
//         } catch (error) {
//             console.error(`Error connecting to DB: ${error}`);
//             this.health = false;
//             throw error;
//         }
//     }

//     public async runMigrations() {
//         if (this.runningMigrations) {
//             return;
//         }

//         const migrations = [
//             `CREATE TABLE IF NOT EXISTS urls (
//                 id BIGINT PRIMARY KEY,
//                 url TEXT NOT NULL,
//                 tiny_url TEXT NOT NULL,
//                 created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//             )`,
//         ];

//         for (const migration of migrations) {
//             await this.query(migration);
//         }

//         this.runningMigrations = true;
//     }

//     public async ping() {
//         try {
//             await this.client.query("SELECT 1");
//         } catch (err) {
//             console.error("Error pinging DB:", err);
//             this.health = false;
//             throw err;
//         }
//     }

//     public async query(sql: string, values?: any) {
//         const [results, _]: [RowDataPacket[], any] = await this.client.query(
//             sql,
//             values
//         );
//         return results;
//     }
// }
