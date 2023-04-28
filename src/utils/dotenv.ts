import dotenv from "dotenv";
import { DotEnv } from "./dotnev.types";

export function getConfig(key: keyof DotEnv.Contract) {
  const config = dotenv.config();

  if (config.error) {
    throw config.error;
  }

  if (!config.parsed) {
    throw new Error("config is malformed");
  }

  const stringConfig = JSON.stringify(config.parsed);
  const parsed = JSON.parse(stringConfig) as DotEnv.Domain;

  const configMapper: DotEnv.Contract = {
    server: {
      port: parseInt(parsed.SERVER_PORT),
      prefix: parsed.SERVER_PREFIX,
      message: parsed.SERVER_LISTEN_MESSAGE,
    },
    spa: {
      url: parsed.SPA_URL,
    },
  };

  return configMapper[key];
}
