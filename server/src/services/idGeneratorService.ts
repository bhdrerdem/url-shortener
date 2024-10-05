import { IDGeneratorConfig } from "../config/default";

// This service generates unique IDs for the shortened URLs using the Snowflake algorithm.
export class IDGeneratorService {
  private static instance: IDGeneratorService;
  private static readonly EPOCH = 1720987200n;
  private config: IDGeneratorConfig;
  private sequence: bigint = 0n;
  private lastTimestamp: bigint = -1n;

  constructor(config: IDGeneratorConfig) {
    this.config = config;
  }

  public static async init(config: IDGeneratorConfig): Promise<void> {
    if (!IDGeneratorService.instance) {
      IDGeneratorService.instance = new IDGeneratorService(config);
    }
  }

  public static getInstance(): IDGeneratorService {
    if (!IDGeneratorService.instance) {
      throw new Error("IDGeneratorService not initialized");
    }

    return IDGeneratorService.instance;
  }

  private currentTimestamp(): bigint {
    return BigInt(Math.floor(Date.now() / 1000));
  }

  public generate(): bigint {
    const machineId = BigInt(this.config.machineId);

    let timestamp = this.currentTimestamp();

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & 4095n;
    } else {
      this.sequence = 0n;
    }

    this.lastTimestamp = timestamp;

    const timestampPart = (timestamp - IDGeneratorService.EPOCH) << 17n;
    const machinePart = machineId << 12n;
    const sequencePart = this.sequence;

    return timestampPart | machinePart | sequencePart;
  }
}
