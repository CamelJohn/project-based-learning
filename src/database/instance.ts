import { Sequelize } from "sequelize";
import { getConfig } from "../utils/dotenv";

const { database } = getConfig()

export const $db = new Sequelize({
  database: database.name,
  password: database.password,
  username: database.username,
  port: database.port,
  dialect: "postgres",
  define: {
    timestamps: true,
    // paranoid: true,
    freezeTableName: true,
  },
  logging: console.log,
  // sync: {
  //   force: false,
  //   alter: false,
  // },
});
