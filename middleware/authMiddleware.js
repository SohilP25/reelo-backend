import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // decodes and verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Not Authorized,Token generation failed",
        data: {},
      });
    }
  }
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Not Authorized,Token generation failed",
      data: {},
    });
  }
};

export default protect;
