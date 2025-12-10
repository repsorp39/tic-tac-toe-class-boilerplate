"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const ALICE_ID = 1;
    const BOB_ID = 2;
    const CHARLIE_ID = 3;

    const gameData = [
      {
        player_1: ALICE_ID,
        player_2: BOB_ID,
        winner_id: ALICE_ID,
        status: "FINISHED",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        player_1: ALICE_ID,
        player_2: CHARLIE_ID,
        winner_id: ALICE_ID,
        status: "FINISHED",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        player_1: ALICE_ID,
        player_2: BOB_ID,
        winner_id: ALICE_ID,
        status: "FINISHED",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        player_1: CHARLIE_ID,
        player_2: ALICE_ID,
        winner_id: ALICE_ID,
        status: "FINISHED",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        player_1: BOB_ID,
        player_2: ALICE_ID,
        winner_id: ALICE_ID,
        status: "FINISHED",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        player_1: ALICE_ID,
        player_2: BOB_ID,
        status: "FINISHED",
        winner_id: BOB_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        player_1: ALICE_ID,
        player_2: CHARLIE_ID,
        status: "FINISHED",
        winner_id: CHARLIE_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        player_1: ALICE_ID,
        player_2: BOB_ID,
        winner_id: BOB_ID,
        status: "FINISHED",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        player_1: CHARLIE_ID,
        player_2: ALICE_ID,
        winner_id: CHARLIE_ID,
        status: "FINISHED",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        player_1: BOB_ID,
        player_2: ALICE_ID,
        winner_id: BOB_ID,
        status: "FINISHED",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        player_1: ALICE_ID,
        player_2: CHARLIE_ID,
        status: "FINISHED",
        winner_id: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("games", gameData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("games", null, {});
  },
};
