require("dotenv").config();
const express = require("express"); //commonjs
const configViewEngine = require("./config/viewEngine");
const apiRoutes = require("./routes/user");
const connection = require("./config/database");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const fileUpload = require('express-fileupload')

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

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(fileUpload())


configViewEngine(app);


app.use("/v1/api/", apiRoutes);
// app.use('',routerAPI)

(async () => {
  try {
    //using mongoose
    await connection();

    app.listen(port, () => {   
      console.log(`http://localhost:${port}`);
    });
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();
