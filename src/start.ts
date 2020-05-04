import { App } from "./app";
import { DatabaseConnection } from "./database.connection";
import { WarehouseStatusService } from "./domains/warehouse/services/warehouse-status.service";
// import { SqsConsumers } from "./sqs.consumers";
export async function start(): Promise<void> {
  const app = new App();
  const db = new DatabaseConnection();
  // const sqsConsumers = new SqsConsumers();
  const warehouseStatusSeed = new WarehouseStatusService();

  await app.start();
  await db.connect();
  // await sqsConsumers.start();
  await warehouseStatusSeed.warehouseStatusSeed();

  const graceful = async () => {
    await app.stop();
    await db.disconnect();
    // await sqsConsumers.stop();

    process.exit(0);
  };

  // Stop graceful
  process.on("SIGTERM", graceful);
  process.on("SIGINT", graceful);
}
