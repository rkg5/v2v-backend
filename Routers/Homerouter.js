const express = require("express");
const userModel = require("../models/User-Models/userModel.js");
const HomeRouter = express.Router();
const protectRoute = require("../middleware/protectRoute.js");

HomeRouter.route("/")
  .get((req, res) => {
    res.status(200);
    res.json({
      message: "Home page",
    });
    //console.log(req);
    //console.log({ message: "Home page" });
  })
  .post();

HomeRouter.route("/user")
  .get(protectRoute, async (req, res) => {
    try {
      let users = await userModel.find();
      res.json({
        message: "successful getUser data",
        listOfUsers: users,
      });
    } catch (e) {
      console.log(e);
    }
  })
  .post();

HomeRouter.route("/user/:id")
  .get(protectRoute, async (req, res, next) => {
    try {
      let user = await userModel.find({ email: req.params.id });
      res.json({
        message: "Id route",
        userData: user,
      });
    } catch (e) {
      console.log(e);
    }
    next();
  })
  .post()
  .patch()
  .delete();

module.exports = HomeRouter;
