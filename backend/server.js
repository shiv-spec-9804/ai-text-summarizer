// import fs from "fs/promises";
// import { db } from "./drizzle/drizzle.config.js";
// import { summaries } from "./drizzle/schema.js";
// import express from "express";
// import cors from "cors";
// import axios from "axios";
// import dotenv from "dotenv";
// import { eq } from "drizzle-orm";
// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Email Summarizer API is running!");
// });

// const PORT = process.env.PORT || 5000;

// async function summarizeEmail(body) {
//     console.log("shiv-body",body);
//   const response = await axios.post(
//     "https://api.openai.com/v1/chat/completions",
//     {
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: "You are an AI that summarizes emails in 2-3 sentences and assigns a category (Meeting, Invoice, Support Request)." },
//         { role: "user", content: `Summarize and categorize this email: ${body}` }
//       ]
//     },
//     {
//       headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
//     }
//   );
//   const content = response.data.choices[0].message.content;
//   console.log("shiv-content",content);
  
//   // Split response into summary + category (assuming user returns like "Summary: ... Category: ...")
//   let match = content.match(/Category:\s*(.*)\s*Summary:\s*([\s\S]*)/i);
//     if (match) {
//     return {
//         category: match[1].trim(),
//         summary_text: match[2].trim()
//     };
// }

// match = content.match(/^(\w+):\s*([\s\S]*)/);
//   if (match) {
//     return {
//       category: match[1].trim(),
//       summary_text: match[2].trim()
//     };
//   }
  
//   return { summary_text: content, category: "Uncategorized" };
// }

// // // Summarize all mock emails
// app.post("/summarize-emails", async (req, res) => {
//   try {
//     const data = await fs.readFile("./mock_emails.json", "utf-8");
//     console.log("shiv-data",data);
//     const emails = JSON.parse(data);
//     const results = [];
//     console.log("shiv-emails",emails);

//     for (const email of emails) {
//       const { summary_text, category } = await summarizeEmail(email.body);
//       const inserted = await db.insert(summaries).values({
//         sender: email.sender,
//         subject: email.subject,
//         body: email.body,
//         summary_text,
//         category,
//       }).returning();
//       results.push(inserted[0]);
//     }

//     res.json(results);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to summarize emails" });
//   }
// });

// // // Get all summaries
// // // Get all summaries
// app.get("/summaries", async (req, res) => {
//   try {
//     const all = await db.select().from(summaries);
//     res.json(all);
//   } catch (err) {
//     console.error("Error in GET /summaries:", err);
//     // Send a helpful error message for debugging (avoid sending sensitive details in production)
//     res.status(500).json({ error: "Failed to fetch summaries", message: err?.message || String(err) });
//   }
// });

// // Delete a summary
// app.delete("/summaries/:id", async (req, res) => {
//   const { id } = req.params;
//   await db.delete(summaries).where(eq(summaries.id, Number(id)));
//   res.json({ success: true });
// });

// // Re-summarize a summary
// app.post("/summaries/:id/resummarize", async (req, res) => {
//   const { id } = req.params;
//   const record = await db.select().from(summaries).where(eq(summaries.id, Number(id)));
//   console.log("shiv-record",record);
//   if (!record) return res.status(404).json({ error: "Not found" });

//   const { summary_text, category } = await summarizeEmail(record[0].body);
//   await db.update(summaries)
//     .set({ summary_text, category })
//     .where(eq(summaries.id, Number(id)));
  
//   res.json({ summary_text, category });
// });

// app.listen(PORT, () => console.log("✅ Server running on http://localhost:5000"));

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

