import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.errors({ stack: true }),
    format.simple()
  ),
  defaultMeta: { service: "customer-service" },
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.File({
      maxsize: 5120000,
      maxFiles: 5,
      filename: "logs/quick-start-error.log",
      level: "error"
    }),
    new transports.File({ filename: "logs/quick-start-combined.log" }),
    new transports.Console({
      level: "debug"
    })
  ]
});
