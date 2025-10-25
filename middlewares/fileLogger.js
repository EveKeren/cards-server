import fs from "fs";
import path from "path";
import { currentTime } from "../utils/timeService.js";

const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

export const fileLogger = (req, res, next) => {
  const originalStatus = res.status;
  const originalSend = res.send;

  let statusCode = 200;

  res.status = function (code) {
    statusCode = code;
    return originalStatus.call(this, code);
  };

  res.send = function (data) {
    if (statusCode >= 400) {
      const { year, month, day, hours, minutes, seconds } = currentTime();
      const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      const logFileName = `${year}-${month}-${day}.log`;
      const logFilePath = path.join(logsDir, logFileName);

      const logMessage = `[${timestamp}] ${req.method} ${
        req.url
      } - Status: ${statusCode} - Error: ${
        typeof data === "string" ? data : JSON.stringify(data)
      }\n`;

      fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
          console.error("Error writing to log file:", err);
        }
      });
    }

    return originalSend.call(this, data);
  };

  next();
};
