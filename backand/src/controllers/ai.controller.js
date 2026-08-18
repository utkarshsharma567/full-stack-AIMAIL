require("dotenv").config();


const axios = require('axios');
const EmailHistory = require('../models/emailHistory.model')

//generate email using ai groq api
exports.generateEmail = async (req, resp) => {
  const { prompt } = req.body;

  try {
    // Validate prompt
    if (!prompt) {
      return resp.status(400).json({
        message: "Prompt is required",
      });
    }

    if (prompt.trim().length === 0) {
      return resp.status(400).json({
        message: "Prompt cannot be empty",
      });
    }

    if (prompt.length > 2000) {
      return resp.status(400).json({
        message: "Prompt cannot exceed 2000 characters",
      });
    }

    // System prompt
    const systemPrompt = `
You are an expert job outreach strategist.

Generate a professional and high-converting cold email for a recruiter.

Make reasonable professional assumptions if the user's request is short.
Do not ask questions.
Do not ask for clarification.

The candidate:
- Has 2+ years of software engineering experience
- Is strong in DSA and system design
- Has backend API experience
- Has worked on scalable production systems
- Has contributed to production-level features
- Is looking for Software Engineer opportunities

Writing rules:
- Professional
- Confident
- Concise
- No emojis
- No hype
- No markdown

Subject:
- 6-9 words
- Professional
- Highlight candidate value

Email body:
- 60-90 words
- Personalized observation
- Mention a relevant hiring/scaling challenge
- Mention candidate experience
- Mention potential value
- Clear call to action
- Professional sign-off

LinkedIn DM:
- 30-50 words
- Conversational
- Observation + value + soft ask

Follow-up email:
- 50-80 words
- New angle
- Professional urgency
- Clear call to action

User request:
${prompt.trim()}
`;

    // Groq API request
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

        temperature: 0.5,
        max_tokens: 1024,

        // Strict JSON Schema
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
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check Groq response
    if (
      !aiResponse.data.choices ||
      !aiResponse.data.choices[0] ||
      !aiResponse.data.choices[0].message
    ) {
      throw new Error("Invalid response from Groq API");
    }

    const generatedText =
      aiResponse.data.choices[0].message.content;

    console.log("Groq Response:", generatedText);

    // Parse JSON
    let parsedResponse;

    try {
      parsedResponse = JSON.parse(generatedText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Generated text:", generatedText);

      return resp.status(500).json({
        message: "Failed to parse AI response",
        error: "AI generated invalid JSON",
      });
    }

    // Prepare email data
    const emailData = {
      subject: parsedResponse.subject || "New Opportunity",
      emailBody: parsedResponse.emailBody || "",
      linkedInDM: parsedResponse.linkedInDM || "",
      followUpEmail: parsedResponse.followUpEmail || "",
    };

    // Validate
    if (!emailData.subject || !emailData.emailBody) {
      return resp.status(500).json({
        message: "AI generated incomplete email data",
      });
    }

    // Save history
    const historyEntry = await EmailHistory.create({
      userId: req.user._id,
      prompt: prompt.trim(),
      subject: emailData.subject,
      emailBody: emailData.emailBody,
      linkedInDM: emailData.linkedInDM,
      followUpEmail: emailData.followUpEmail,
    });

    return resp.status(200).json(historyEntry);

  } catch (error) {
    console.error(
      "AI Generation Error:",
      error.response?.data || error.message
    );

    // Rate limit
    if (error.response?.status === 429) {
      return resp.status(429).json({
        message:
          "Too many requests. Please wait a moment before trying again.",
        error: "Rate limit exceeded",
      });
    }

    return resp.status(500).json({
      message: "Failed to generate email",
      error:
        error.response?.data?.error?.message ||
        error.message,
    });
  }
};



// fetch all email 
exports.getHistory = async (req, resp) => {
  try {//user ki id sai uski history lana
    const history = await EmailHistory.find({ userId: req.user._id }).sort({ createdAt: -1 });
    resp.status(200).json(history);
  } catch (error) {
    resp.status(500).json({ message: 'Failed to fetch history',error:error.message });
  }
};

 
      
