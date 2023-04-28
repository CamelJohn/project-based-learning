import { Sequelize } from "sequelize";

export const db = new Sequelize({
  database: "",
  password: "",
  username: "",
  port: 5433,
  dialect: "postgres",
  define: {
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
  },
  logging: console.log,
  sync: {
    force: false,
    alter: true,
  },
});
