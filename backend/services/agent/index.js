import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/agent.route.js";
dotenv.config();

const port = process.env.PORT;
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Agent  service is running");
});

app.use("/", router);
app.listen(port, () => {
  console.log(`Agent service is running at http://localhost:${port}`);
  connectDB();
});
