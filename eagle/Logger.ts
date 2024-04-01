enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

const COLORS: { [key: string]: string } = {
  RESET: "\x1b[0m",
  RED: "\x1b[31m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  MAGENTA: "\x1b[35m",
};

export class Logger {
  private identifier: string;

  public constructor(identifier: string) {
    this.identifier = identifier;
  }

  public debug(msg: string) {
    this.log(msg, LogLevel.DEBUG);
  }

  public info(msg: string) {
    this.log(msg, LogLevel.INFO);
  }

  public warn(msg: string) {
    this.log(msg, LogLevel.WARN);
  }

  public error(msg: string) {
    this.log(msg, LogLevel.ERROR);
  }

  private log(msg: string, logLevel: LogLevel) {
    const now: Date = new Date();
    let date: string = now.getFullYear().toString();
    date += "." + (now.getMonth() + 1);
    date += "." + now.getDate();
    date += " " + now.getHours();
    date += ":" + now.getMinutes();
    date += ":" + now.getSeconds();
    date += ":" + now.getMilliseconds();

    console.log(
      `${date} [${this.identifier}] ${Logger.colorizeLogLevel(logLevel)} ${msg}`
    );
  }

  private static colorizeLogLevel(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return `${COLORS.BLUE}${level}${COLORS.RESET}`;
      case LogLevel.INFO:
        return `${COLORS.GREEN}${level}${COLORS.RESET}`;
      case LogLevel.WARN:
        return `${COLORS.YELLOW}${level}${COLORS.RESET}`;
      case LogLevel.ERROR:
        return `${COLORS.RED}${level}${COLORS.RESET}`;
      default:
        return `${COLORS.MAGENTA}${level}${COLORS.RESET}`;
    }
  }
}
