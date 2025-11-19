// server/routes/chatRouter.js
import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import db from "../config/db.js";

dotenv.config();

const chatRouter = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are an expert assistant that reads scientific papers and returns concise, structured overviews with clear headings.`;

// Helper to truncate large strings safely
const truncate = (s, n) =>
  s && s.length > n ? s.slice(0, n) + "...[truncated]" : s;

// POST /api/chat/:id
chatRouter.post("/:id", async (req, res) => {
  console.log("chat API Request Received");
  const { conversation = [], length, reg_no, paper_id } = req.body;
  req.reg_no = reg_no; // allow caller to pass reg_no in body
  console.log("Paper ID:", paper_id, "Conversation length:", length);
  console.log("Last user message:", conversation);

  db.query(
    "SELECT pdf_text, title, abstract FROM papers WHERE id = ?",
    [paper_id],
    async (error, results) => {
      if (error) {
        console.error("DB error:", error);
        return res.status(500).json({ error: "Database error" });
      }

      let paperText;
      let paperTitle;
      let paperAbstract;
      if (results.length === 0) paperText = "";
      else paperText = results[0].pdf_text;
      if (results.length === 0) paperTitle = "Untitled paper";
      else paperTitle = results[0].title;
      if (results.length === 0) paperAbstract = "";
      else paperAbstract = results[0].abstract;

      try {
        // Fetch user profile from SQL (assumes table 'user_profiles' with column 'reg_no')
        let profile = null;
        if (req.reg_no) {
          const profileQuery =
            "SELECT * FROM user_profiles WHERE reg_no = ? LIMIT 1";
          const profileRow = await new Promise((resolve, reject) => {
            db.query(profileQuery, [req.reg_no], (pErr, pResults) => {
              if (pErr) return reject(pErr);
              resolve(pResults && pResults.length ? pResults[0] : null);
            });
          });
          profile = profileRow ? { ...profileRow } : null;
        }

        // Make safe/truncated paper text to protect token limits
        const safePaperText = truncate(paperText, 15000);

        // Decide which prompt to use: overview (for short context) or conversational
        const convLength = Array.isArray(conversation)
          ? conversation.length
          : 0;

        // --- Overview prompt (when not enough conversation context) ---
        const overviewPrompt = `
${SYSTEM_PROMPT}

You are given: 1) the user's profile (if available), 2) the full text extracted from a paper, and 3) the paper abstract.

Task: Produce an *overview* of the paper titled: "${paperTitle}". The overview MUST be organized with clear section headings (use Markdown headings) and concise content under each heading. Return a single plain-text message (no JSON wrappers) that includes the following sections if applicable:

# Title
A one-line canonical title (prefer the given title).

# One-line Summary
1-sentence summary of the paper's main idea or contribution.

# Key Contributions
A bulleted list (2–6 bullets) with the most important contributions.

# Methods / Approach
A short paragraph describing the approach, datasets, experiments, and main techniques.

# Results & Findings
A short paragraph highlighting the primary results, metrics, or discoveries.

# Limitations
A short paragraph with the most important limitations or caveats.

# Practical Implications / Next Steps
2–4 short bullets suggesting how this research could be used, extended, or what to read next.

Only include these sections (but omit any that are empty). Use plain Markdown headings (e.g. \"# Results & Findings\"). Keep responses concise. Do not include any private tokens, API keys, or unrelated debug info.

--- USER PROFILE ---
${profile ? JSON.stringify(profile) : "No profile provided."}

--- Paper Abstract ---
${truncate(paperAbstract, 2000)}

--- PAPER TEXT ---
${safePaperText}

Respond with the overview only (plain text). Do not output anything else.
`;
        // --- Conversational prompt (when there is enough conversation) ---
        // The conversational prompt includes a short paper context + the chat history and asks the model to reply as assistant.
        const paperContext = `You have access to an academic paper titled \"${paperTitle}\". Abstract: ${truncate(paperAbstract, 1000)}

Refer to the paper when answering user questions.`;

        const lastMessage = conversation[conversation.length - 1];
        const previousMessages = conversation.slice(0, -1);
        const convoText = previousMessages
          .map(
            (m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`
          )
          .reverse()
          .join("\n");

        let promptToSend = "";
        if (convLength <= 1 && paper_id) {
          promptToSend = overviewPrompt;
        } else {
          // Build a conversational instruction that gives the model context about the paper and asks for a helpful reply.
          promptToSend = `You are an AI assistant helping the user based on their profile and the context.
--- USER PROFILE ---
${profile ? JSON.stringify(profile) : "No profile provided."}

--- LAST MESSAGE ---
${lastMessage.content}

--- CHAT HISTORY (most recent first) ---
${convoText}

Instructions: Reply concisely and helpfully to the user's last message. Reference sections of the paper if relevant (methods, results). Keep the reply to 4-8 short sentences. Plain text only.
`;
        }
        console.log(promptToSend.slice(0, 500));
        // Call the model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(promptToSend);

        let text = result.response.text().trim();
        // Cleanup safety (removes code fences or triple backticks)
        text = text.replace(/```/g, "").trim();

        console.log("AI Output:", text.slice(0, 300));
        return res.json({ text });
      } catch (err) {
        console.error("❌ chat API Error:", err);
        res.status(500).json({ error: "AI chat failed" });
      }
    }
  );
});

export default chatRouter;
