import express from "express";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import router from "./routes/user.routes";

const cors = require("cors");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(fileUpload({}));
app.use(express.static(__dirname + '/public/'))
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use("/v1", router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
