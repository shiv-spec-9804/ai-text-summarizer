import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/**
 * Summarize and categorize an email using OpenAI
 * @param {string} body - The email content
 * @returns {Promise<{ summary_text: string, category: string }>}
 */
export async function summarizeEmail(body) {

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI that summarizes emails in 2-3 sentences and assigns a category (Meeting, Invoice, Support Request).",
        },
        { role: "user", content: `Summarize and categorize this email: ${body}` },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  const content = response.data.choices[0].message.content;

  // Try to extract both category and summary from the response
  let match = content.match(/Category:\s*(.*)\s*Summary:\s*([\s\S]*)/i);
  if (match) {
    return {
      category: match[1].trim(),
      summary_text: match[2].trim(),
    };
  }

  // Fallback: e.g., "Invoice: The email contains billing details..."
  match = content.match(/^(\w+):\s*([\s\S]*)/);
  if (match) {
    return {
      category: match[1].trim(),
      summary_text: match[2].trim(),
    };
  }

  // Default
  return { summary_text: content, category: "Uncategorized" };
}
