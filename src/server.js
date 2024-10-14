require("dotenv").config();
const express = require("express"); //commonjs
const configViewEngine = require("./config/viewEngine");
const apiRoutes = require("./routes/user");
const connection = require("./config/database");
const cookieParser = require('cookie-parser');
const { getHomepage } = require("./controllers/homeController");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8888;

// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, 
  })
);
app.use(cookieParser());

//config req.body
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // for form data

//config template engine
configViewEngine(app);

//khai báo route
app.use("/v1/api/", apiRoutes);
// app.use('',routerAPI)

(async () => {
  try {
    //using mongoose
    await connection();

    app.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();
