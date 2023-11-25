import express from "express";
import connectDB from "./config/db_connection.js";
import router from "./routes/index.js";
import bodyParser from "body-parser";
import 'dotenv/config'
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(3000, () => {
  connectDB();
  console.log("Server is running on port 3000");
});

app.use("/api/v1", router);
app.get("/", (req, res) => {
  res.send("Hey There!, I'm Ready to Integrate.");
});