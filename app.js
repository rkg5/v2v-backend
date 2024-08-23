const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
// const swaggerJSDoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");

// const swaggerDefinition = {
//   info: {
//     title: "V2V Swagger Documentation",
//     version: "1.0.0",
//     description: "backend API documentation",
//   },
//   host: `localhost:${process.env.PORT}`,
//   basePath: "/",
// };

// const options = {
//   swaggerDefinition,
//   apis: ["./Routers/*.js"], // Path to the API routes
// };

// const swaggerSpec = swaggerJSDoc(options);SS
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const cookieParser = require("cookie-parser");
const HomeRouter = require("./Routers/Homerouter");
const authRouter = require("./Routers/authRouter");
const userRouter = require("./Routers/userRouter");
const surveyRouter = require("./Routers/surveyRouter");
const uploadRouter = require("./Routers/uploadRouter");
app.use(cors());
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
  // console.log(
  //   `Swagger running on http://localhost:${process.env.PORT}/api-docs`
  // );
});

// express.json() parses incoming request, post data in json string format and query parameters in url encoded string and make
// them available in req.body(post data for post http request) and req.params(query parameters)
// like @ get uncoded as %40

app.use(express.json());
app.use(cookieParser());
// allows cross origin resource sharing means any other webapge can access my server resources



app.use("/home", HomeRouter);
app.use("/auth", authRouter);
app.use("/getUser", userRouter);
app.use("/survey", surveyRouter);
app.use("/upload", uploadRouter);

// middleware functions has access to req-res cycle and by using next inbuilt function we pass the
// modified req-res to incoming middleware means which will get executed next
app.use("/other", (req, res, next) => {
  //......
  next();
});

module.exports = app;
