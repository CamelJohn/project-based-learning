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
      test_port: parseInt(parsed.SERVER_TEST_PORT),
      prefix: parsed.SERVER_PREFIX,
      message: parsed.SERVER_LISTEN_MESSAGE,
      test_message: parsed.SERVER_TEST_LISTEN_MESSAGE
    },
    spa: {
      url: parsed.SPA_URL,
    },
    database: {
      port: parseInt(parsed.DATABASE_PORT, 10),
      password: parsed.DATABASE_PASSWORD,
      name: parsed.DATABASE_NAME,
      username: parsed.DATABASE_USERNAME
    }
  };
}
