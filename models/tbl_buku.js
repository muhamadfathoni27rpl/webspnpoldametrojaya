const Sequelize = require("sequelize");
const db = require("./sequelize");
module.exports = db.sequelize.define(
  "tbl_buku",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    judul: {
      type: Sequelize.STRING
    },
    pengarang: {
      type: Sequelize.STRING
    },
    edisi: {
      type: Sequelize.STRING
    },
    thn_terbit: {
      type: Sequelize.STRING
    },
    penerbit: {
      type: Sequelize.STRING
    },
    jml:{
      type: Sequelize.STRING
    },
    rak_no:{
      type: Sequelize.STRING
    },
    kondisi:{
      type: Sequelize.STRING
    },
    img:{
      type: Sequelize.STRING
    }
  },
  { timestamps: false }
);
