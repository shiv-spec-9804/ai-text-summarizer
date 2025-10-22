import express from "express";
import {
  summarizeAllEmails,
  getAllSummaries,
  deleteSummary,
  resummarizeSummary,
  exportSummariesCSV
} from "../controllers/summaryController.js";

const router = express.Router();

// Define API routes
router.post("/summarize-emails", summarizeAllEmails);
router.get("/summaries", getAllSummaries);
router.delete("/summaries/:id", deleteSummary);
router.post("/summaries/:id/resummarize", resummarizeSummary);
router.get("/summaries/export", exportSummariesCSV);

export default router;
