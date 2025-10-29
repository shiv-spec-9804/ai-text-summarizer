import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import summaryRoutes from "./routes/summaryRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Base route
app.get("/", (req, res) => {
  res.send("Email Summarizer API is running!");
});

// Use the summary routes
app.use("/", summaryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

