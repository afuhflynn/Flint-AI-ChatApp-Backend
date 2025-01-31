import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf } = format;
const logFormat = printf(({ level, message, timestamp }) => {
    return `[${level.toUpperCase()}] ${timestamp} - ${message}\n`;
});
const logger = createLogger({
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    transports: [
        new transports.File({ filename: "../logs/log.log" }),
        new transports.Console(),
    ],
});
export default logger;
//# sourceMappingURL=loger.js.map