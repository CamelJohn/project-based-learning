import express, { Application } from "express";

import { Middleware } from "./middleware";
import { getConfig } from "../utils/dotenv";
import { webRouter } from "./router";
import { database } from "../database";

interface ServerArgs {
  test?: boolean;
}

export async function Server({ test = false }: ServerArgs) {
  const { $close, $connect } = database();
  try {
    await $connect();

    const webServer: Application = express();

    const { server } = getConfig();

    webServer.use(Middleware.base);

    webServer.get("/health", Middleware.health);

    webServer.use(server.prefix, Middleware.auth, webRouter);

    webServer.use("*", Middleware.catchAll);

    webServer.use(Middleware.error);

    if (test) {
      return webServer.listen(server.test_port, (): void =>
        console.log(server.test_message)
      );
    }

    return webServer.listen(server.port, (): void =>
      console.log(server.message)
    );
  } catch (error) {
    console.error({ error, context: "server" });
    await $close();
    process.exit(1);
  }
}
