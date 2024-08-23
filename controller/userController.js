const { baseManager } = require("../ModelManager/BaseModel.Manager");
const userModel = require("../models/User-Models/userModel");

module.exports.getCookies = function getCookies(req, res) {
  let cookies = req.cookies;
  console.log("cookies:", cookies);
  res.send("Cookies received");
};

module.exports.setCookies = function setCookies(req, res) {
  res.status(200);
  res.cookie("isLoggedIn", true, {
    maxAge: 1000 * 60 * 60 * 24, // age of cookies
    secure: true, // means its only uses HTTPS
    httpOnly: true, // stops the cookie access from frontend of webbrowser
  });
  res.cookie("isPrimeMember", true, { httpOnly: true });
  res.send("cookies has been set");
};

module.exports.updateUserInfo = async function updateUserInfo(req, res) {
  try {
    let user = req.body;
    console.log("user:", user);
    const userManager = new baseManager(userModel);
    let userObj = await userManager.getById(req.user.id);
    console.log("userObj:", userObj);
    for (let key in user) {
      if (key == "mobileNumber" || key == "address" || key == "name") {
        userObj[key] = user[key];
      } else {
        console.log("This key is not allowed to be updated");
      }
    }
    userObj.updatedAt = new Date();
    await userObj.save();
    let newUser = userObj;
    newUser.password = undefined;
    return res.json({ message: "user info updated", updatedUser: newUser });
  } catch (error) {
    console.log(error);
    return res.json(`Error while updating user info: ${error}`);
    // throw new Error(`Error while updating user info: ${error}`);
  }
};

module.exports.getProfile = async (req, res) => {
  console.log(req.user);
  const userId = req.user.id;
  const userManager = new baseManager(userModel);
  let user = await userManager.getById(userId);
  user.password = undefined;
  return res.json({ message: "user info", user: user });
};
