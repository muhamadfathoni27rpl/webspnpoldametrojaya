const Sequelize = require("sequelize");
const db = require("./sequelize");
module.exports = db.sequelize.define(
  "tbl_kurikulum",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    judul: {
        type: Sequelize.STRING
    },
    jenis: {
        type: Sequelize.STRING
      },
    file: {
        type: Sequelize.STRING
    },
      
  },
  { timestamps: false }
);
