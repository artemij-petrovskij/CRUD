"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const router = express_1.default.Router();
const User = new user_controller_1.UserController();
router.get("/user", User.getUsers);
router.get("/user/:id", User.getOneUser);
router.post("/user", User.createUser);
router.delete("/user/:id", User.deleteUser);
router.put("/user/:id", User.updateUser);
router.post("/upload/:id", User.uploadUserImage);
router.post("/generatePDF/", User.generateUserPDF);
exports.default = router;
