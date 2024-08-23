const jwt = require("jsonwebtoken");

const extractUserInfo = async (req, res, next) => {
  try {
    // Get the token from the request header or query parameter
    let token = req.cookies.isLoggedIn;
    const authHeader = req.headers["authorization"];
    if (authHeader) {
      // Extract Bearer token from the Authorization header
      if (!token) {
        token = authHeader.split(" ")[1];
      }
    }
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    // Verify the token and decode object {iat;string,payload:{id:string}}
    const decoded = jwt.verify(token, process.env.JWT_KEY); // Replace 'your-secret-key' with your actual secret key

    // Attach the user information to the request object
    req.user = decoded.payload;
    // Move to the next middleware
    next();
  } catch (error) {
    return await res
      .status(401)
      .json({ message: "Unauthorized: Invalid token", error });
  }
};

module.exports = extractUserInfo;
