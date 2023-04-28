import { db } from "./instance";

async function $connect() {
  await db.authenticate();
}

async function $close() {
  console.info(`Closing connection to ${db.getDatabaseName()} datbase.`)
  await db.close();
}

export function database() {
  return {
    $connect,
    $close,
  };
}
