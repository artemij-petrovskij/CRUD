"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// async function testConnect() {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// }
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./dist/database/db.sqlite",
});
const User = sequelize.define("User", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        defaultValue: "/images/default.jpg",
    },
    pdf: {
        type: DataTypes.BLOB,
    },
}, {
    timestamps: false,
});
User.sync();
exports.default = User;
