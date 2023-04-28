import dotenv from "dotenv";
import dotenvExpand from 'dotenv-expand';
import { DotEnv } from "./dotnev.types";

export function getConfig(): DotEnv.Contract {
  const raw = dotenv.config();
  const config = dotenvExpand.expand(raw);

  if (config.error) {
    throw config.error;
  }

  if (!config.parsed) {
    throw new Error("config is malformed");
  }

  const stringConfig = JSON.stringify(config.parsed);
  const parsed = JSON.parse(stringConfig) as DotEnv.Domain;

  return {
    server: {
      port: parseInt(parsed.SERVER_PORT),
      prefix: parsed.SERVER_PREFIX,
      message: parsed.SERVER_LISTEN_MESSAGE,
    },
    spa: {
      url: parsed.SPA_URL,
    },
  };
}
