"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const buffer_1 = require("buffer");
class UserController {
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findAll();
                res.status(200).json(user);
            }
            catch (err) {
                console.error(`Server error ` + err);
                res.status(500);
            }
        });
    }
    getOneUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield user_model_1.default.findOne({ where: { id: id } });
            if (user !== null) {
                res.status(200).json(user);
            }
            else {
                res.status(404).json(`User with id: ${id} does not exist`);
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // email, firstName, lastName REQUIRED!
            const { email, firstName, lastName, image, pdf } = req.body;
            const user = yield user_model_1.default.create({
                email: email,
                firstName: firstName,
                lastName: lastName,
                image: image,
                pdf: pdf,
            });
            res.status(201).send(`User with email: ${email} created successfully`);
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const checkUserIsset = yield user_model_1.default.findOne({ where: { id: id } });
            if (checkUserIsset !== null) {
                yield user_model_1.default.destroy({
                    where: {
                        id: id,
                    },
                });
                res.status(201).send("User deleted successfully");
            }
            else {
                res.status(404).send(`User with id: ${id} does not exist`);
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, firstName, lastName, image, pdf } = req.body;
            const { id } = req.params;
            const checkUserIsset = yield user_model_1.default.findOne({ where: { id: id } });
            if (checkUserIsset !== null) {
                yield user_model_1.default.update({
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    image: image,
                    pdf: pdf,
                }, {
                    where: {
                        id: id,
                    },
                });
                res.status(200).send(`User with id: ${id} was updated successfully`);
            }
            else {
                res.status(404).send(`User with id: ${id} not found`);
            }
        });
    }
    uploadUserImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const label = req.files.img.name;
            const { id } = req.params;
            const checkUserIsset = yield user_model_1.default.findOne({ where: { id: id } });
            console.log(checkUserIsset);
            if (checkUserIsset !== null) {
                try {
                    req.files.img.mv("./dist/public/images/" + req.files.img.name);
                    yield user_model_1.default.update({
                        image: "/images/" + label,
                    }, { where: { id: id } });
                }
                catch (err) {
                    console.error(`Server error ` + err);
                    res.status(500);
                }
                res
                    .status(200)
                    .send(`User ${id} image ${label} was uploaded successfully`);
            }
            else {
                res.status(404).send(`User with id: ${id} does not exist`);
            }
        });
    }
    generateUserPDF(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const user = yield user_model_1.default.findOne({ where: { email: email } });
            if (user !== null) {
                const doc = new pdfkit_1.default();
                doc.pipe(fs_1.default.createWriteStream(path_1.default.join(__dirname, `../../dist/temp/${email}.pdf`)));
                doc.fontSize(30);
                doc.font(path_1.default.join(__dirname, "../../dist/public/fonts/Roboto-Black.ttf"));
                doc.text(`${user.firstName} ${user.lastName}`, 25, 25);
                doc.image(path_1.default.join(__dirname, "../../dist/public/", user.image), 320, 280, { scale: 0.4 });
                doc.end();
                const stringBuf = Buffer.from(path_1.default.join(__dirname, `../../dist/temp/${email}.pdf`));
                user_model_1.default.update({
                    pdf: new buffer_1.Blob([stringBuf], { type: "application/pdf" }),
                }, { where: { email: email } });
                res.status(200).send("PDF successfuly generated and saved");
            }
            else {
                res.status(404).send(`User with email: ${email} does not exist`);
            }
        });
    }
}
exports.UserController = UserController;
