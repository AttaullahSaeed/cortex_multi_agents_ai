import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/auth.route.js";
dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Auth  service is running");
});

app.use("/", authRoute);

app.listen(port, () => {
  console.log(`Auth service is running at http://localhost:${port}`);
  connectDB();
});
