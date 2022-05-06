import express from "express";
import { UserController } from "../controller/user.controller";

const router = express.Router();
const User = new UserController();

router.get("/user", User.getUsers);

router.get("/user/:id", User.getOneUser);

router.post("/user", User.createUser);

router.delete("/user/:id", User.deleteUser);

router.put("/user/:id", User.updateUser);

router.post("/upload/:id", User.uploadUserImage);

router.post("/generatePDF/", User.generateUserPDF);

export default router;
