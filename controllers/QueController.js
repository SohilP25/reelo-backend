import Question from "../models/question.js";
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import generator from "../helper/generatorAI.js";
import { DiffieHellman } from "crypto";

class QueController {
  constructor() {}

  addQuestion = async (req, res) => {
    try {
      // Extract questions array from request body
      const questions = req.body.questions;

      // Validate that questions is an array
      if (!Array.isArray(questions)) {
        return res.status(400).json({
          success: false,
          message: "Invalid input: expected an array of questions",
          data: {},
          err: error,
        });
      }

      // Insert questions into the database
      const insertedQuestions = await Question.insertMany(questions);

      // Send response
      res.status(201).json({
        success: true,
        message: "Question Inserted Successfully",
        data: insertedQuestions,
      });
    } catch (error) {
      console.log("Question Insertion Error", error);
      return res.status(500).json({
        success: false,
        message: error.message,
        data: {},
        err: error,
      });
    }
  };

  generatePaper = async (req, res) => {
    try {
      const { totalMarks, difficulty } = req.body;
      const marksPerDifficulty = { Easy: 1, Medium: 2, Hard: 3 };
      let requiredQuestions = {
        Easy: Math.round(
          (totalMarks * difficulty.Easy) / 100 / marksPerDifficulty.Easy
        ),
        Medium: Math.round(
          (totalMarks * difficulty.Medium) / 100 / marksPerDifficulty.Medium
        ),
        Hard: Math.round(
          (totalMarks * difficulty.Hard) / 100 / marksPerDifficulty.Hard
        ),
      };

      // Adjust to match total marks
      let totalCalculatedMarks =
        requiredQuestions.Easy * marksPerDifficulty.Easy +
        requiredQuestions.Medium * marksPerDifficulty.Medium +
        requiredQuestions.Hard * marksPerDifficulty.Hard;

      //for remainnig marks
      let remMarks = totalMarks - totalCalculatedMarks;
      while (remMarks > 0) {
        if (remMarks >= 3) {
          requiredQuestions.Hard++;
          remMarks -= 3;
        } else if (remMarks === 2) {
          requiredQuestions.Medium++;
          remMarks -= 2;
        } else {
          requiredQuestions.Easy++;
          remMarks -= 1;
        }
      }

      const paper = [];
      for (const [diff, qty] of Object.entries(requiredQuestions)) {
        let questions = await Question.find({ difficulty: diff }).limit(qty);
        if (questions.length < qty) {
          return res.status(400).json({
            success: true,
            message: `Not enough ${diff} questions available.`,
            data: {},
          });
        }
        paper.push(...questions);
      }

      if (req.query.format === 'pdf') {
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment;filename=questions.pdf');
        doc.pipe(res);
        doc.fontSize(20) // Larger font size for the title
           .font('Helvetica-Bold') // Bold font style
           .text('Question Paper', {
               align: 'center' // Center alignment
           });
        doc.moveDown(0.5);
        
        paper.forEach((question, index) => {
          doc.fontSize(14).text(`${index + 1}. ${question.question}`, { continued: true }).fontSize(12).text(` (${question.marks} marks)`);
          doc.moveDown(0.2);
          doc.fontSize(13).text(`Subject: ${question.subject},`, { indent: 20 });
          doc.fontSize(13).text(`Topic: ${question.topic},`, { indent: 20 });
          doc.fontSize(13).text(`Difficulty: ${question.difficulty}`, { indent: 20 });
          doc.moveDown(0.5);
        });

        doc.end();

    } else {
        // Return JSON response
        res.status(200).json({
            success: true,
            message: "Paper Generated successfully",
            data: paper,
        });
    }

    } catch (error) {
      console.log("Paper Generation Error", error);
      return res.status(500).json({
        success: false,
        message: error.message,
        data: {},
        err: error,
      });
    } 
  };

  generateAI = async (req,res) => {
    try {
      const { totalMarks, difficulty } = req.body;
      const data = await generator(totalMarks,difficulty.Easy,difficulty.Medium,difficulty.Hard);
      res.status(200).json({
        success: true,
        message: "Paper Generated with cohere LLM API successfully",
        data: data,
    });
    } catch (error) {
      console.log("Paper Generation with Error(AI)", error);
      return res.status(500).json({
        success: false,
        message: error.message,
        data: {},
        err: error,
      });
    }
  }

}

export default QueController;
