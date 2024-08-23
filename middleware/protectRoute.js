const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;

// protect route middleware so just use (req,res,next) to make any function middleware
// next is keyword to pass the control of the req-res cycle
async function protectRoute(req, res, next) {
  try {
    let token = req.cookies.isLoggedIn;
    const authHeader = req.headers["authorization"];

    if (authHeader) {
      // Extract Bearer token from the Authorization header
      if (!token) token = authHeader.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }
    if (token) {
      let isValidToken = jwt.verify(token, JWT_KEY);
      if (isValidToken) {
        next();
      } else {
        return await res.json({ message: "user not verified" });
      }
    } else {
      return await res.json({ message: "operation not allowed" });
    }
  } catch (err) {
    console.log(err.message);
    return await res.json({ message: "Action not allowed" });
  }
}

module.exports = protectRoute;
