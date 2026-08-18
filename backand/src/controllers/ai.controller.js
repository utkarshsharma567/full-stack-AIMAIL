require("dotenv").config();

const axios = require("axios");
const EmailHistory = require("../models/emailHistory.model");

// Generate email using Groq AI
exports.generateEmail = async (req, res) => {
  const { prompt } = req.body;

  try {
    // -----------------------------
    // 1. Validate prompt
    // -----------------------------
    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    if (prompt.trim().length === 0) {
      return res.status(400).json({
        message: "Prompt cannot be empty",
      });
    }

    if (prompt.length > 2000) {
      return res.status(400).json({
        message: "Prompt cannot exceed 2000 characters",
      });
    }

    // -----------------------------
    // 2. Check Groq API key
    // -----------------------------
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        message: "GROQ_API_KEY is not configured on the server",
      });
    }

    // -----------------------------
    // 3. System prompt
    // -----------------------------
    const systemPrompt = `
You are an expert job outreach strategist.

Generate a professional cold email to a recruiter based on the user's request.

Make reasonable assumptions if the request is very short.

Candidate assumptions:
- 2+ years of software engineering experience
- Strong DSA and system design skills
- Backend API and scalable system experience
- Production-level development experience
- Looking for Software Engineer opportunities

Generate four things:

1. subject
2. emailBody
3. linkedInDM
4. followUpEmail

Rules:

SUBJECT:
- 6 to 9 words
- Professional
- Confident
- Avoid "Quick question"
- Avoid "Looking for opportunity"
- Avoid "Job application"

EMAIL BODY:
- 60 to 90 words
- Professional
- Personalized
- Mention candidate value
- Include a clear call to action
- No emojis
- No hype
- No markdown

LINKEDIN DM:
- 30 to 50 words
- Conversational
- Professional
- Include a soft call to action

FOLLOW UP EMAIL:
- 50 to 80 words
- Professional
- Add a new angle
- Include a clear call to action

IMPORTANT:
Return ONLY the requested JSON object.
Do not add explanations.
Do not add markdown.
`;

    // -----------------------------
    // 4. Groq API request
    // -----------------------------
    const aiResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "openai/gpt-oss-120b",

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt.trim(),
          },
        ],

        temperature: 0.6,

        max_completion_tokens: 1200,

        response_format: {
          type: "json_schema",
          json_schema: {
            name: "cold_email",
            strict: true,
            schema: {
              type: "object",

              properties: {
                subject: {
                  type: "string",
                },

                emailBody: {
                  type: "string",
                },

                linkedInDM: {
                  type: "string",
                },

                followUpEmail: {
                  type: "string",
                },
              },

              required: [
                "subject",
                "emailBody",
                "linkedInDM",
                "followUpEmail",
              ],

              additionalProperties: false,
            },
          },
        },

        // GPT-OSS reasoning ko low rakhenge
        reasoning_effort: "low",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // -----------------------------
    // 5. Check Groq response
    // -----------------------------
    if (
      !aiResponse.data ||
      !aiResponse.data.choices ||
      !aiResponse.data.choices[0] ||
      !aiResponse.data.choices[0].message
    ) {
      throw new Error("Invalid response received from Groq API");
    }

    const generatedText =
      aiResponse.data.choices[0].message.content;

    console.log("Groq response:", generatedText);

    // -----------------------------
    // 6. Parse JSON
    // -----------------------------
    let parsedResponse;

    try {
      parsedResponse = JSON.parse(generatedText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Generated Text:", generatedText);

      return res.status(500).json({
        message: "Failed to parse AI response",
        error: "AI returned invalid JSON",
      });
    }

    // -----------------------------
    // 7. Prepare email data
    // -----------------------------
    const emailData = {
      subject: parsedResponse.subject || "New Opportunity",
      emailBody: parsedResponse.emailBody || "",
      linkedInDM: parsedResponse.linkedInDM || "",
      followUpEmail: parsedResponse.followUpEmail || "",
    };

    // -----------------------------
    // 8. Validate AI output
    // -----------------------------
    if (
      !emailData.subject ||
      !emailData.emailBody ||
      !emailData.linkedInDM ||
      !emailData.followUpEmail
    ) {
      return res.status(500).json({
        message: "AI generated incomplete email data",
      });
    }

    // -----------------------------
    // 9. Save history
    // -----------------------------
    const historyEntry = await EmailHistory.create({
      userId: req.user._id,
      prompt: prompt.trim(),

      subject: emailData.subject,

      emailBody: emailData.emailBody,

      linkedInDM: emailData.linkedInDM,

      followUpEmail: emailData.followUpEmail,
    });

    // -----------------------------
    // 10. Send response
    // -----------------------------
    return res.status(200).json(historyEntry);
  } catch (error) {
    console.error(
      "AI Generation Error:",
      error.response?.data || error.message
    );

    // Rate limit
    if (error.response?.status === 429) {
      return res.status(429).json({
        message:
          "Too many requests. Please wait a moment and try again.",
        error: "Rate limit exceeded",
      });
    }

    // Groq API error
    if (error.response?.data?.error) {
      return res.status(500).json({
        message: "Groq API error",
        error: error.response.data.error.message,
        code: error.response.data.error.code,
      });
    }

    return res.status(500).json({
      message: "Failed to generate email",
      error: error.message,
    });
  }
};


// ------------------------------------
// Get email history
// ------------------------------------
exports.getHistory = async (req, res) => {
  try {
    const history = await EmailHistory.find({
      userId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json(history);
  } catch (error) {
    console.error("History Error:", error);

    return res.status(500).json({
      message: "Failed to fetch history",
      error: error.message,
    });
  }
};

 
      
