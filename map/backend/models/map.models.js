const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Map = sequelize.define("map", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {  // ฟิลด์ address
    type: DataTypes.STRING,
    allowNull: false,
  },
  direction: {  // ฟิลด์ direction
    type: DataTypes.STRING,
    allowNull: false,
  },
  lat: {  // ฟิลด์ direction
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  lng: {  // ฟิลด์ direction
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  radius: {  // ฟิลด์ direction
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

Map.sync({ force: false })
  .then(() => {
    console.log("Table created or already exists");
  })
  .catch((error) => {
    console.log("Error creating table:", error);
  });

module.exports = Map;
