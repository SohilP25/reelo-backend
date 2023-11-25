import { User } from "../models/index.js";
import generateToken from "../helper/generateToken.js";

class AuthController {
  registerUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(401).json({
          success: false,
          message: "Enter email and password correctly",
          data: {},
        });
      }

      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(401).json({
          success: false,
          message: "User already exists",
          data: {},
        });
      }
      const user = await User.create({
        email,
        password,
      });
      if (user) {
        res.status(201).json({
          success: true,
          message: "Regeistered Successfully",
          data: {
            id: user._id,
            email: user.email,
            token: generateToken(user._id),
          },
        });
      } else {
        res.status(201).json({
          success: false,
          message: "Regeistered Failed",
          data: {},
        });
      }
    } catch (error) {
      console.log("Authentication Error", error);
      return res.status(401).json({
        success: false,
        message: error.message,
        data: {},
        err: error,
      });
    }
  };

  loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (user && (await user.matchPassword(password))) {
        res.status(201).json({
          success: true,
          message: "LogIn Successfully",
          data: {
            id: user._id,
            email: user.email,
            token: generateToken(user._id),
          },
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Invalid username and password",
          data: {},
        });
      }
    } catch (error) {
      console.log("Authentication Error", error);
      return res.status(401).json({
        success: false,
        message: error.message,
        data: {},
        err: error,
      });
    }
  };
}

export default AuthController;
