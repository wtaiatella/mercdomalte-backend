import pino from "pino";
import "dotenv/config";

const logger = pino();
logger.level = process.env.LOG_LEVEL || "info";

export default logger;
