export type AppConfig = {
  port: number;
  nodeEnv: "development" | "test" | "production";
  logLevel: string;
  corsOrigins: string[];
  storageDriver: "file" | "memory";
  dataDir: string;
  aiProvider: "mock";
  retrievalProvider: "mock";
  bodyLimitBytes: number;
  rateLimitMax: number;
  rateLimitWindow: string;
};

const parsePort = (value: string | undefined): number => {
  const parsed = Number(value ?? "4000");
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 4000;
};

const parseNodeEnv = (value: string | undefined): AppConfig["nodeEnv"] => {
  if (value === "test" || value === "production") return value;
  return "development";
};

const parseCorsOrigins = (value: string | undefined): string[] => {
  const viteDevPorts = ["5173", "5174", "5175", "5176", "5177", "5178", "5179", "5180"];
  const defaults = viteDevPorts.flatMap((port) => [
    `http://localhost:${port}`,
    `http://127.0.0.1:${port}`
  ]);
  if (!value) return defaults;
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const parseStorageDriver = (value: string | undefined): AppConfig["storageDriver"] => {
  if (value === "memory") return "memory";
  return "file";
};

const parsePositiveInteger = (
  value: string | undefined,
  fallback: number,
  minimum = 1
): number => {
  const parsed = Number(value ?? fallback);
  return Number.isInteger(parsed) && parsed >= minimum ? parsed : fallback;
};

export const validateConfig = (config: AppConfig): string[] => {
  const issues: string[] = [];

  if (config.nodeEnv === "production" && config.corsOrigins.includes("*")) {
    issues.push("CORS_ORIGIN cannot be '*' in production.");
  }

  if (config.dataDir.trim().length === 0) {
    issues.push("DATA_DIR cannot be empty.");
  }

  return issues;
};

export const loadConfig = (): AppConfig => ({
  port: parsePort(process.env.PORT),
  nodeEnv: parseNodeEnv(process.env.NODE_ENV),
  logLevel: process.env.LOG_LEVEL ?? "info",
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN),
  storageDriver: parseStorageDriver(process.env.STORAGE_DRIVER),
  dataDir: process.env.DATA_DIR ?? "data",
  aiProvider: "mock",
  retrievalProvider: "mock",
  bodyLimitBytes: parsePositiveInteger(process.env.BODY_LIMIT_BYTES, 1_000_000),
  rateLimitMax: parsePositiveInteger(process.env.RATE_LIMIT_MAX, 60),
  rateLimitWindow: process.env.RATE_LIMIT_WINDOW ?? "1 minute"
});
