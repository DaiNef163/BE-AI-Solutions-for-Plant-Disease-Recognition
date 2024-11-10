require("dotenv").config();
const express = require("express"); //commonjs
const configViewEngine = require("./config/viewEngine");
// const apiRoutes = require("./routes/user");
const apiAdmin = require("./routes/api.routes");
const connection = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const routerUser = require("./routes/Account.routes");
const cloudinary = require("cloudinary").v2;

const app = express();
const port = process.env.PORT || 8888;

//app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    createParentPath: true,
  })
);

configViewEngine(app);

// app.use('',routerAPI)

cloudinary.config({
  secure: true,
});

console.log("cloudinary.config()", cloudinary.config());

(async () => {
  try {
    await connection();
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();

app.use("/", routerUser);
app.use("/", apiAdmin);
