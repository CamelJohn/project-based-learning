import express, { Application } from "express";
import { getConfig } from "../utils/dotenv";
import { Middleware } from "./middleware";

export async function Server() {
  try {
    const webServer: Application = express();

    const { server } = getConfig();

    webServer.get("/health", Middleware.health);

    // webServer.use(server.prefix, webRouter);

    webServer.use("*", Middleware.catchAll);

    webServer.use(Middleware.error);

    return webServer.listen(server.port, () => console.log(server.message));
  } catch (error) {
    console.error({ error, context: "server" });
    process.exit(1);
  }
}
