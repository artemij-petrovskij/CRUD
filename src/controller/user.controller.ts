import User from "../model/user.model";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { Blob } from "buffer";
import { isClassStaticBlockDeclaration } from "typescript";

interface User {
  getUsers(req: Request, res: Response): Promise<any>;
  getOneUser(req: Request, res: Response): Promise<any>;
  createUser(req: Request, res: Response): Promise<any>;
  deleteUser(req: Request, res: Response): Promise<any>;
  updateUser(req: Request, res: Response): Promise<any>;
  uploadUserImage(req: Request, res: Response): Promise<any>;
  generateUserPDF(req: Request, res: Response): Promise<any>;
}

class UserController implements User {
  async getUsers(req: Request, res: Response): Promise<any> {
    try {
      const user = await User.findAll();

      res.status(200).json(user);
    } catch (err) {
      console.error(`Server error ` + err);
      res.status(500);
    }
  }

  async getOneUser(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const user = await User.findOne({ where: { id: id } });

    if (user !== null) {
      res.status(200).json(user);
    } else {
      res.status(404).json(`User with id: ${id} does not exist`);
    }
  }

  async createUser(req: Request, res: Response): Promise<any> {
    // email, firstName, lastName REQUIRED!
    const { email, firstName, lastName, image, pdf } = req.body;
    const user = await User.create({
      email: email,
      firstName: firstName,
      lastName: lastName,
      image: image,
      pdf: pdf,
    });
    res.status(201).send(`User with email: ${email} created successfully`);
  }

  async deleteUser(req: Request, res: Response): Promise<any> {
    const { id } = req.params;

    const checkUserIsset = await User.findOne({ where: { id: id } });
    if (checkUserIsset !== null) {
      await User.destroy({
        where: {
          id: id,
        },
      });
      res.status(201).send("User deleted successfully");
    } else {
      res.status(404).send(`User with id: ${id} does not exist`);
    }
  }

  async updateUser(req: Request, res: Response): Promise<any> {
    const { email, firstName, lastName, image, pdf } = req.body;
    const { id } = req.params;
    const checkUserIsset = await User.findOne({ where: { id: id } });
    if (checkUserIsset !== null) {
      await User.update(
        {
          email: email,
          firstName: firstName,
          lastName: lastName,
          image: image,
          pdf: pdf,
        },
        {
          where: {
            id: id,
          },
        }
      );

      res.status(200).send(`User with id: ${id} was updated successfully`);

    } else {
      res.status(404).send(`User with id: ${id} not found`);

    }

  }
  async uploadUserImage(req: Request, res: Response): Promise<any> {
    const label = req.files.img.name;
    const { id } = req.params;
    const checkUserIsset = await User.findOne({ where: { id: id } });
    console.log(checkUserIsset)
    if (checkUserIsset !== null) {
      try {
        req.files.img.mv("./dist/public/images/" + req.files.img.name);
        await User.update(
          {
            image: "/images/" + label,
          },
          { where: { id: id } }
        );
      } catch (err) {
        console.error(`Server error ` + err);
        res.status(500);
      }

      res
        .status(200)
        .send(`User ${id} image ${label} was uploaded successfully`);
    } else {
      res.status(404).send(`User with id: ${id} does not exist`);
    }
  }

  async generateUserPDF(req: Request, res: Response): Promise<any> {
    const { email } = req.body;

    const user = await User.findOne({ where: { email: email } });
    if (user !== null) {
      const doc = new PDFDocument();
      doc.pipe(
        fs.createWriteStream(
          path.join(__dirname, `../../dist/temp/${email}.pdf`)
        )
      );
      doc.fontSize(30);
      doc.font(
        path.join(__dirname, "../../dist/public/fonts/Roboto-Black.ttf")
      );
      doc.text(`${user.firstName} ${user.lastName}`, 25, 25);
      doc.image(
        path.join(__dirname, "../../dist/public/", user.image),
        320,
        280,
        { scale: 0.4 }
      );
      doc.end();


      const stringBuf = Buffer.from(path.join(__dirname, `../../dist/temp/${email}.pdf`));

      User.update(
        {
          pdf: new Blob([stringBuf], { type: "application/pdf" }),
        },
        { where: { email: email } }
      );

      res.status(200).send("PDF successfuly generated and saved");
    } else {
      res.status(404).send(`User with email: ${email} does not exist`);
    }
  }
}

export { UserController };
