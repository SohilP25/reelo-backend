import mongoose from "mongoose";

const questionSchema = mongoose.Schema(
  {
    question: { 
        type: String, 
        required: true, 
        trim: true },
    subject: { 
        type: String, 
        required: true, 
        trim: true },
    topic: { 
        type: String, 
        required: true, 
        trim: true },
    difficulty: { 
        type: String, 
        required: true, 
        trim: true },
    marks: { 
        type: Number, 
        required: true },
  }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
