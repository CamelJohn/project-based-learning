import { $db } from "./instance";
import { $definitions } from "./models";

async function $connect() {
  await $db.authenticate();
  $definitions();
  await $db.sync({ alter: true });
}

async function $close() {
  console.info(`Closing connection to ${$db.getDatabaseName()} datbase.`)
  await $db.close();
}

export function database() {
  return {
    $connect,
    $close,
  };
}
