import path from "path";
import winston, { format } from "winston";
import { home } from "../config";

type levelType = "info" | "error" | "warn";

const logger = winston.createLogger({
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.simple(),
    winston.format.json(),
    format.printf(
      ({ level, message, timestamp }) => `${timestamp} ${level} ${message}`,
    ),
  ),

  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(home || "./", "./MIB.log"),
    }),
  ],
});
// 记录输出
export default (value: string, level: levelType = "info"): void => {
  logger.log(level, value);
};
