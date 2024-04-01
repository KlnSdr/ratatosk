import express, { Application, request, response } from "express";
import { config as dotEnvconfig } from "dotenv";
import { Logger } from "./Logger";

dotEnvconfig();

const LOGGER: Logger = new Logger("eagle.server");

const PORT: number = parseInt(process.env.PORT || "3001");

const app: Application = express();
app.use(express.json());
app.use(express.static("nidhogg"));
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, "0.0.0.0", () => {
  LOGGER.info(`listening on port ${PORT}...`);
});
