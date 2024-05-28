import express, { Application, Request, Response } from "express";
import { config as dotEnvconfig } from "dotenv";
import { Logger } from "./util/Logger";
import { Socket } from "socket.io";
import { Server } from "http";
import fs from "fs";

interface Message {
  source: string;
  fuckapple: boolean;
  payload: { text: string; type: string };
}

dotEnvconfig();

const LOGGER: Logger = new Logger("ratatosk.server");

const PORT: number = parseInt(process.env.PORT || "3001");
const STATIC_DIR: string | null = process.env.STATIC_DIR || null;

const app: Application = express();
app.use(express.json());
app.use(express.static("public"));
if (STATIC_DIR == null) {
  LOGGER.error("no static dir given, abort");
  process.exit(1);
}
app.use(express.urlencoded({ extended: true }));

LOGGER.info("setting up websocket server...");
const httpServer: Server = require("http").Server(app);
const io = require("socket.io")(httpServer);

io.on("connection", (socket: Socket) => {
  LOGGER.debug("connected");
  socket.on("ratatosk", (data: Message) => {
    if (data.source != "nidhogg") {
      io.emit("nidhogg", data);
      return;
    }

    io.emit("eagle", data);

    if (data.payload.type === "command") {
      LOGGER.info("> " + data.payload.text);
    } else {
      switch (data.payload.type) {
        case "log":
          LOGGER.info("< " + data.payload.text);
          break;
        case "info":
          LOGGER.info("< " + data.payload.text);
          break;
        case "warn":
          LOGGER.warn("< " + data.payload.text);
          break;
        case "error":
          LOGGER.error("< " + data.payload.text);
          break;
        default:
          LOGGER.error("UNKNOWN LOG TYPE: " + data.payload.type);
          break;
      }
    }
  });
});

app.get("*", (req: Request, res: Response) => {
  let url: string = req.url;

  if (url === "/") {
    url = "/index.html";
  }

  const path: string = STATIC_DIR + url;
  fs.readFile(path, { encoding: "utf-8" }, function (err, data) {
    if (!err) {
      const contentType: string = (() => {
        if (url.endsWith("html")) {
          return "text/html";
        } else if (url.endsWith("css")) {
          return "text/css";
        } else if (url.endsWith("js")) {
          return "text/javascript";
        }
        return "";
      })();
      res.writeHead(200, { "Content-Type": contentType });
      if (url.endsWith("html")) {
        res.write(
          data.replace(
            "<head>",
            '<head><script src="/nidhogg/index.js"></script>'
          )
        );
      } else {
        res.write(data);
      }
      res.end();
    } else {
      res.sendStatus(404);
    }
  });
});

httpServer.listen(PORT, "0.0.0.0", () => {
  LOGGER.info(`listening on port ${PORT}...`);
});
