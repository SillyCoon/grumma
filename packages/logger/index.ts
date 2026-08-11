import { pino } from "pino";
import { createGcpLoggingPinoConfig } from "@google-cloud/pino-logging-gcp-config";

const logger = pino(
  createGcpLoggingPinoConfig(
    {
      serviceContext: {
        service: "grumma",
      },
    },
    {
      level: "info",
    },
  ),
);

export default logger;
