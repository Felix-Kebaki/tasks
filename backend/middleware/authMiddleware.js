const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const Protect = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.status(401).json({ error: "Unauthorized-No token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized-Invalid token" });
    }
    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized - User not found" });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
    console.error(error.message);
  }
};

module.exports = Protect;
