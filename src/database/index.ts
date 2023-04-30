import { $db } from "./instance";
import { $definitions } from "./models";

async function $connect({ alter = false}) {
  await $db.authenticate();
  $definitions();
  await $db.sync({ alter });
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
