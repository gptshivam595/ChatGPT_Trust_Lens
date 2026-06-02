import { buildApp } from "./app.js";
import { loadConfig } from "./config.js";

const config = loadConfig();
const app = await buildApp(config);

try {
  await app.listen({ port: config.port, host: "0.0.0.0" });
} catch (error) {
  app.log.error({ error }, "Failed to start Trust Lens backend");
  process.exit(1);
}

const shutdown = async (signal: NodeJS.Signals) => {
  app.log.info({ signal }, "Shutting down Trust Lens backend");
  await app.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
