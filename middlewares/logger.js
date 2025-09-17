import morgan from "morgan";
import chalk from "chalk";
import { currentTime } from "./../utils/timeService.js";
export default morgan(function (tokens, req, res) {
  const { year, month, day, hours, minutes, seconds } = currentTime();
  const currentDate = `[${year}/${month}/${day} ${hours}:${minutes}:${seconds}]`;
  const result = [
    currentDate,
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    "-",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");
  if (tokens.status(req, res) >= 400) {
    return chalk.redBright(result);
  } else {
    return chalk.cyanBright(result);
  }
});
