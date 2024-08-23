const userModel = require("../models/User-Models/userModel.js");
const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;
const path = require("node:path");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utility/sendEmail.js");
const { getHtmlString } = require("../utility/htmlString.js");
const { baseManager } = require("../ModelManager/BaseModel.Manager.js");

module.exports.getSignup = function getSignup(req, res) {
  try {
    console.log("getSignup", __dirname);
    // let path1 = "/home/ankit-maurya/Documents/backend/public/";
    // let path2 = "/home/ankit-maurya/Documents/backend/controller/";
    // let relPath = path.join(path.relative(path2, path1), "index.html");
    // console.log(relPath);
    res.sendFile(path.join(__dirname, "../public/index.html"));
    // , {
    //   root: __dirname,
    // })
    //res.send("hi");
    //res.sendFile("/public/index.html", { root: __dirname });}
  } catch (e) {
    throw new Error(`Error while getting signup: ${e}`);
  }
};

// signup function : creates a new user
module.exports.postSignup = async function postSignup(req, res) {
  try {
    let dataObject = req.body;
    console.log(dataObject);
    if (dataObject.password != dataObject.confirmPassword) {
      return res.json({ message: "password mismatched" });
    }
    if (!dataObject.password) {
      return res.json({ message: "password can't be blank" });
    }
    let userManager = new baseManager(userModel);
    //let User = await userModel.findOne({ email: dataObject.email });
    let User = await userManager.findOne({ email: dataObject.email });
    console.log(User);
    if (User) {
      return res.json({ message: "Email already exists" });
    }
    //console.log("backend", dataObject);
    //let user = await userModel.create(dataObject);
    let salt = await bcrypt.genSalt();
    let hashedString = await bcrypt.hash(dataObject.password, salt);
    dataObject.password = hashedString;
    let user = await userManager.create(dataObject);
    console.log("created user:", user);
    sendEmail("signup", user);
    return res.json({
      message: "user Signed up",
      data: dataObject,
    });
  } catch (e) {
    throw new Error(`Error while signup: ${e}`);
  }
};

module.exports.loginUser = async function loginUser(req, res) {

  console.log(req.body);
  if (req.body.email) {
    try {
      let user = await userModel.findOne({ email: req.body.email });
      if (user) {
        console.log(req.body.password, user.password);
        //bcrypt has be to taken care of
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
          let uid = user["_id"]; // unique id
          // this function will include header itself default
          let JWTtoken = jwt.sign(
            { payload: { id: uid, email: user.email } },
            JWT_KEY
          ); // by default- HMAC-SHA256 but to specify{algorithm:'RS256'}
          //setting the cookie as true for logged in user
          res.cookie("isLoggedIn", JWTtoken, { httpOnly: true }); // sending single cookie and seetting it http true to stop access from frontend
          return res.json({
            message: "User Found",
            userDetails: req.body,
            token: JWTtoken,
          });
        } else {
          return res.json({ message: "Invalid Credential" });
        }
      } else {
        return res.json({ message: "User not found" });
      }
    } catch (e) {
      throw new Error(`Error while login: ${e}`);
    }
  } else {
    res.json({ message: "Empty email found" });
  }
};

module.exports.logOut = async function logOut(req, res, next) {
  const user_id = req.user.id;
  let user = await new baseManager(userModel).findOne({ _id: req.user.id });
  await res.cookie("isLoggedIn", "-");
  return await res.json({ message: `User ${user.name} logged out` });
};

module.exports.forgotPassword = async function forgotPassword(req, res) {
  try {
    let email = req.body.email;
    let user = await userModel.findOne({ email: email });
    //console.log(user);
    if (user) {
      //console.log(user);
      // send nodemailer reset link to user
      let token = jwt.sign({ payload: email }, JWT_KEY, {
        expiresIn: 10 * 60,
      });
      // store the reset token to database
      const resUpdate = await userModel.updateOne(
        { email: email },
        { resetToken: token }
      );
      //console.log(resUpdate);
      if (!resUpdate.acknowledged) {
        res.json({ message: "Error occurred while updating" });
      }

      const url = `${req.protocol}://${req.get(
        "host"
      )}/auth/forgotPassword/${token}?email=${email}`;

      //console.log(url);
      let htmlString = getHtmlString("reset password", {
        email: email,
        resetToken: token,
        resetURL: url,
      });
      // send the reset link to user email address and set the reset token to null
      //console.log(typeof sendResetEmail);
      const info = await sendEmail(email, "reset password", htmlString);
      //console.log(sendResetEmail);
      res.json({
        message: "reset token created!",
      });
      //
    } else {
      res.json({ message: "User not found" });
    }
  } catch (e) {
    throw new Error(`Error in forgetPassword: ${e}`);
  }
};

module.exports.resetPassword = async function resetPassword(req, res) {
  try {
    let data = req.body; // has new password
    let params = req.params; // has resetToken
    let query = req.query; // has email
    //console.log(query, data, params);
    if (data.password == data.confirmPassword) {
      let user = await userModel.findOne({ email: query.email });
      //console.log(user, user.resetToken == params.resetToken);
      let validateToken = false;
      jwt.verify(params.resetToken, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
          console.log(err);
          res.status(500); // internal server error
          res.json({ error: err });
        } else {
          validateToken = true;
        }
      });

      if (user && validateToken && user.resetToken == params.resetToken) {
        // updating the user's password and reseting the token to null
        let salt = await bcrypt.genSalt();
        let hashedPassword = await bcrypt.hash(data.password, salt);
        let updateInfo = await userModel.updateOne(
          { email: query.email },
          { password: hashedPassword, resetToken: null }
        );
        res.json({
          message: "user reset password",
          data: updateInfo,
        });
      } else {
        res.status(400); // bad request
        res.json({ message: "Invalid user" });
      }
    } else {
      res.status(401); // unauthorized
      res.json({ message: "mismatch password" });
    }
  } catch (e) {
    throw new Error(`Error in resetPassword: ${e}`);
  }
};
