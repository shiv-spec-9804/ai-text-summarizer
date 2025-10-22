import fs from "fs/promises";
import { Parser } from "json2csv";
import { db } from "../drizzle/drizzle.config.js";
import { summaries } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
import { summarizeEmail } from "../services/openaiService.js";
dotenv.config();

// POST /summarize-emails
export async function summarizeAllEmails(req, res) {
  try {
    const data = await fs.readFile("./mock_emails.json", "utf-8");
    const emails = JSON.parse(data);
    const results = [];

    for (const email of emails) {
      const existing = await db
        .select()
        .from(summaries)
        .where(eq(summaries.body, email.body));
      if (existing.length > 0) {
        console.log(`✅ Cache hit for: ${email.subject}`);
        results.push(existing[0]);
        continue; // Skip API call
      }  
      const { summary_text, category } = await summarizeEmail(email.body);
      const inserted = await db
        .insert(summaries)
        .values({
          sender: email.sender,
          subject: email.subject,
          body: email.body,
          summary_text,
          category,
        })
        .returning();
      results.push(inserted[0]);
       console.log(`🆕 Summarized new email: ${email.subject}`);
    }

    // res.json(results);
    res.json({
      total: emails.length,
      cached: results.filter(r => r.id).length,
      summaries: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to summarize emails" });
  }
}

// GET /summaries
export async function getAllSummaries(req, res) {
  try {
    const all = await db.select().from(summaries);
    res.json(all);
  } catch (err) {
    console.error("Error in GET /summaries:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch summaries", message: err?.message });
  }
}

// DELETE /summaries/:id
export async function deleteSummary(req, res) {
  try {
    const { id } = req.params;
    await db.delete(summaries).where(eq(summaries.id, Number(id)));
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting summary:", err);
    res.status(500).json({ error: "Failed to delete summary" });
  }
}

// POST /summaries/:id/resummarize
export async function resummarizeSummary(req, res) {
  try {
    const { id } = req.params;
    const record = await db
      .select()
      .from(summaries)
      .where(eq(summaries.id, Number(id)));

    if (!record || record.length === 0)
      return res.status(404).json({ error: "Not found" });

    const { summary_text, category } = await summarizeEmail(record[0].body);
    await db
      .update(summaries)
      .set({ summary_text, category })
      .where(eq(summaries.id, Number(id)));

    res.json({ summary_text, category });
  } catch (err) {
    console.error("Error resummarizing:", err);
    res.status(500).json({ error: "Failed to re-summarize" });
  }
}

export const exportSummariesCSV = async (req, res) => {
  try {
    const allSummaries = await db.select().from(summaries);

    const fields = ["id", "sender", "subject", "body", "summary_text", "category", "created_at"];
    const parser = new Parser({ fields });
    const csv = parser.parse(allSummaries);

    // Set headers to force download in browser
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="email_summaries_${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`
    );

    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to export summaries" });
  }
};

