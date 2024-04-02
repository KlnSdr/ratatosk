import express, { Application, request, response } from "express";
import { config as dotEnvconfig } from "dotenv";
import { Logger } from "./util/Logger";
import { Socket } from "socket.io";
import http, { Server } from "http";

interface obj {
  [key: string]: any;
}

interface Message {
  source: string;
  payload: { text: string; type: string };
}

dotEnvconfig();

const LOGGER: Logger = new Logger("ratatosk.server");

const PORT: number = parseInt(process.env.PORT || "3001");

const app: Application = express();
app.use(express.json());
app.use(express.static("nidhogg"));
app.use(express.static("eagle"));
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

httpServer.listen(PORT, "0.0.0.0", () => {
  LOGGER.info(`listening on port ${PORT}...`);
});
