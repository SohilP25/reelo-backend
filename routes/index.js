import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  QueController,AuthController
} from "../controllers/index.js";
const router = express.Router();

const queController = new QueController();
const authController = new AuthController()

//register an user
router.post("/register",authController.registerUser);
//login already registered user
router.post("/login",authController.loginUser);
// add a question to a database
router.post("/addQuestions",protect, queController.addQuestion);
// generate a paper with givem marks and weightage
router.post("/generate-paper",protect, queController.generatePaper);


export default router;
