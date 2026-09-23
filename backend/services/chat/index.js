import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/chat.routes.js";
dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CHAT  service is running");
});

app.use("/", router);

app.listen(port, () => {
  console.log(`Chat service is running at http://localhost:${port}`);
  connectDB();
});
