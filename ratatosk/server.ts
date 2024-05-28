import express, { Application, Request, Response } from "express";
import { config as dotEnvconfig } from "dotenv";
import { Logger } from "./util/Logger";
import { Socket } from "socket.io";
import { Server, IncomingMessage, ClientRequest } from "http";
import { createProxyMiddleware, responseInterceptor } from "http-proxy-middleware";

interface Message {
  source: string;
  fuckapple: boolean;
  payload: { text: string; type: string };
}

dotEnvconfig();

const LOGGER: Logger = new Logger("ratatosk.server");

const PORT: number = parseInt(process.env.PORT || "3001");
const TARGET_SERVER: string | null = process.env.TARGET_SERVER || null;

if (TARGET_SERVER == null) {
  LOGGER.error("invalid config given, abort");
  process.exit(1);
}

const app: Application = express();
app.use(express.json());
app.use(express.static("public"));
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

async function proxyInterceptor(responseBuffer: Buffer, proxyResponse: IncomingMessage, req: Request, res: Response) {
    const contentType = proxyResponse.headers['content-type'];

  if (contentType && contentType.includes('text/html')) {
    let responseBody = responseBuffer.toString('utf-8');
    responseBody = responseBody.replace(
      '<head>',
      '<head><script src="/nidhogg/index.js"></script>'
    );
    return responseBody;
  }

  return responseBuffer;
}

const proxyMiddleware = createProxyMiddleware({
    target: TARGET_SERVER,
    changeOrigin: true,
    selfHandleResponse: true,
    pathFilter: (_path: string, req: Request): boolean => {
        return !req.originalUrl.startsWith("/eagle")
    },
    pathRewrite: (_path: string, req: Request): string => {
        return req.originalUrl;
    },
    on: {
        proxyRes: responseInterceptor(proxyInterceptor),
        proxyReq: (_proxyReq: ClientRequest, req: Request, _res: Response) => {
          LOGGER.debug(`Proxying request to: ${TARGET_SERVER}${req.originalUrl}`);
        }
    }
});

app.use("*", proxyMiddleware);

httpServer.listen(PORT, "0.0.0.0", () => {
  LOGGER.info(`listening on port ${PORT}...`);
});
