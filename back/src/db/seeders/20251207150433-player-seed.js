"use strict";

const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;

module.exports = { 
  async up(queryInterface, Sequelize) {
    const hashedPasswordAlice = await bcrypt.hash("pass123A", SALT_ROUNDS);
    const hashedPasswordBob = await bcrypt.hash("pass123B", SALT_ROUNDS);
    const hashedPasswordCharlie = await bcrypt.hash("pass123C", SALT_ROUNDS);

    await queryInterface.bulkInsert(
      "players",
      [
        {
          email: "alice@seed.com",
          password: hashedPasswordAlice,
          pseudo: "Alice",
          is_online: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "bob@seed.com",
          password: hashedPasswordBob,
          pseudo: "Bob",
          is_online: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "charlie@seed.com",
          password: hashedPasswordCharlie,
          pseudo: "Charlie",
          is_online: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "robert2@seed.com",
          password: hashedPasswordCharlie,
          pseudo: "Robert",
          is_online: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "robert3@seed.com",
          password: hashedPasswordCharlie,
          pseudo: "Robert",
          is_online: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("players", null, {});
  },
};
