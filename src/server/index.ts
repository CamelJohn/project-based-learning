import express, { Application } from "express";
import { getConfig } from "../utils/dotenv";
import { Middleware } from "./middleware";

interface ServerArgs {
  test?: boolean;
}

export async function Server({ test = false }: ServerArgs) {
  try {
    const webServer: Application = express();

    const { server } = getConfig();

    webServer.get("/health", Middleware.health);

    // webServer.use(server.prefix, webRouter);

    webServer.use("*", Middleware.catchAll);

    webServer.use(Middleware.error);

    return webServer.listen(test ? server.test_port :server.port, () => console.log(test ? '' : server.message));
  } catch (error) {
    console.error({ error, context: "server" });
    process.exit(1);
  }
}
