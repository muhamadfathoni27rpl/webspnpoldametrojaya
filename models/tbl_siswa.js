const Sequelize = require("sequelize");
const db = require("./sequelize");
module.exports = db.sequelize.define(
  "tbl_siswa",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    nosis: {
      type: Sequelize.STRING
    },
    nama: {
      type: Sequelize.STRING
    },
    jenis_kelamin: {
      type: Sequelize.STRING
    },
    tmp_lhr: {
      type: Sequelize.STRING
    },
    tgl_lhr:{
      type: Sequelize.STRING
    },
    asal_polda: {
      type: Sequelize.STRING
    },
    no_hp: {
      type: Sequelize.STRING
    },
    alamat:{
      type: Sequelize.STRING
    }
  },
  { timestamps: false }
);
