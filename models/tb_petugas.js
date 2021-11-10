const Sequelize = require("sequelize");
const db = require("./sequelize");
module.exports = db.sequelize.define(
  "tbl_petugas",
  {
    id_petugas: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    level: {
      type: Sequelize.STRING
    },
    nama: {
      type: Sequelize.STRING
    }
  },
  { timestamps: false }
);
