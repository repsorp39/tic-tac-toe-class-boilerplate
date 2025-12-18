const { Sequelize } = require("sequelize");

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const POSTGRESQL_URL = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
const sequelize = new Sequelize(POSTGRESQL_URL,{ logging:false});

async function dbConnect() {
  try {
    await sequelize.authenticate({ force: true,});
    console.log("Sequelize is now connected...");
  } catch (error) {
    console.log("Sequelize could npt authenticate:", error);
  }
}
module.exports = { sequelize, dbConnect };
