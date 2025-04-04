import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Generative AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

// Only initialize the AI model if we have a valid API key
if (GEMINI_API_KEY) {
  console.log("Initializing Gemini AI with API key");
  // Log first few characters of the key to verify format (don't log the full key for security)
  console.log("API key format check (first 5 chars):", GEMINI_API_KEY.substring(0, 5));
  
  try {
    // Debug: Make sure we're using a valid version of the library
    console.log("Using @google/generative-ai library");
    
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Try with the canonical model name 
    try {
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
      console.log("Gemini AI model initialized successfully with gemini-pro");
    } catch (modelError) {
      console.error("Error with gemini-pro model:", modelError);
      
      // Try with other options
      try {
        model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        console.log("Gemini AI model initialized successfully with gemini-1.0-pro");
      } catch (fallbackError) {
        console.error("Error with gemini-1.0-pro model, trying final option:", fallbackError);
        
        // Last resort option
        model = genAI.getGenerativeModel({ model: "models/gemini-pro" });
        console.log("Gemini AI model initialized successfully with models/gemini-pro");
      }
    }
  } catch (error) {
    console.error("Error initializing Gemini AI model:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes for Study Companion

  // 1. Generate Study Plan
  app.post("/api/study-plan", async (req: Request, res: Response) => {
    try {
      // Check if API key is available
      if (!GEMINI_API_KEY || !model) {
        return res.status(503).json({ 
          message: "Gemini API key is not configured. Please set a valid GEMINI_API_KEY in the environment variables." 
        });
      }
      
      const { subject, topics, examDateTime } = req.body;
      
      if (!subject || !Array.isArray(topics) || !examDateTime) {
        return res.status(400).json({ message: "Missing required information" });
      }
      
      // Send to AI for processing
      const prompt = `Create a personalized study plan for the subject: ${subject}. 
      Topics to include: ${topics.join(", ")}. 
      The exam is scheduled for ${examDateTime}.
      Structure the response with daily study goals, topic prioritization, and recommended study times.`;
      
      console.log("Sending prompt to Gemini API:", prompt.substring(0, 100) + "...");
      
      let responseText = "";
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        responseText = response.text();
        console.log("Successfully received response from Gemini API");
      } catch (genAIError) {
        console.error("Detailed Gemini API error:", genAIError);
        throw new Error(`Gemini API error: ${genAIError instanceof Error ? genAIError.message : "Unknown error"}`);
      }
      
      // Store in memory if needed for later use
      await storage.saveStudyPlan({
        subject,
        topics,
        examDateTime,
        content: responseText
      });
      
      res.json({ message: "Study plan generated successfully", plan: responseText });
    } catch (error) {
      console.error("Error generating study plan:", error);
      // Provide a more detailed error message
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ 
        message: "Failed to generate study plan", 
        error: errorMessage
      });
    }
  });

  // 2. Generate Notes
  app.post("/api/notes", async (req: Request, res: Response) => {
    try {
      // Check if API key is available
      if (!GEMINI_API_KEY || !model) {
        return res.status(503).json({ 
          message: "Gemini API key is not configured. Please set a valid GEMINI_API_KEY in the environment variables." 
        });
      }
      
      const { topic, detailLevel, format } = req.body;
      
      if (!topic || !detailLevel || !format) {
        return res.status(400).json({ message: "Missing required information" });
      }
      
      // Send to AI for processing
      const prompt = `Generate comprehensive study notes about "${topic}" with ${detailLevel} detail level.
      Format the notes as ${format === "bulletPoints" ? "bullet points" : 
        format === "paragraph" ? "paragraph text" :
        format === "flashcards" ? "flashcard questions and answers" :
        "a concept map with connections"}.
      Include key concepts, definitions, examples, and important points to remember.
      Make the notes easy to understand and remember.
      Use HTML formatting for structure (headings, lists, etc.)`;
      
      console.log("Sending notes generation prompt to Gemini API:", prompt.substring(0, 100) + "...");
      
      let content = "";
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        content = response.text();
        console.log("Successfully received notes from Gemini API");
      } catch (genAIError) {
        console.error("Detailed Gemini API error:", genAIError);
        throw new Error(`Gemini API error: ${genAIError instanceof Error ? genAIError.message : "Unknown error"}`);
      }
      
      res.json({ message: "Notes generated successfully", content });
    } catch (error) {
      console.error("Error generating notes:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ 
        message: "Failed to generate notes", 
        error: errorMessage
      });
    }
  });

  // 3. Generate Real-World Explanation
  app.post("/api/explanation", async (req: Request, res: Response) => {
    try {
      // Check if API key is available
      if (!GEMINI_API_KEY || !model) {
        return res.status(503).json({ 
          message: "Gemini API key is not configured. Please set a valid GEMINI_API_KEY in the environment variables." 
        });
      }
      
      const { topic } = req.body;
      
      if (!topic) {
        return res.status(400).json({ message: "Missing topic" });
      }
      
      // Send to AI for processing
      const prompt = `Explain the concept of "${topic}" using real-world analogies and examples.
      Start with a compelling everyday analogy that makes the concept easier to understand.
      Then explain how this concept works in the real world with 3-4 practical applications or examples.
      Use HTML formatting for structure (headings, lists, etc.).
      Make the explanation engaging, memorable, and easy to understand for a student.`;
      
      console.log("Sending explanation prompt to Gemini API:", prompt.substring(0, 100) + "...");
      
      let content = "";
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        content = response.text();
        console.log("Successfully received explanation from Gemini API");
      } catch (genAIError) {
        console.error("Detailed Gemini API error:", genAIError);
        throw new Error(`Gemini API error: ${genAIError instanceof Error ? genAIError.message : "Unknown error"}`);
      }
      
      res.json({ message: "Explanation generated successfully", content });
    } catch (error) {
      console.error("Error generating explanation:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ 
        message: "Failed to generate explanation", 
        error: errorMessage
      });
    }
  });

  // 4. Generate Quiz
  app.post("/api/quiz", async (req: Request, res: Response) => {
    try {
      // Check if API key is available
      if (!GEMINI_API_KEY || !model) {
        return res.status(503).json({ 
          message: "Gemini API key is not configured. Please set a valid GEMINI_API_KEY in the environment variables." 
        });
      }
      
      const { topic, difficulty, numQuestions } = req.body;
      
      if (!topic || !difficulty || !numQuestions) {
        return res.status(400).json({ message: "Missing required information" });
      }
      
      // Send to AI for processing
      const prompt = `Generate a ${difficulty} level quiz on the topic "${topic}" with ${numQuestions} multiple-choice questions.
      Each question should have 4 options with exactly one correct answer.
      The response should be structured as a JSON array of objects, where each object has the following fields:
      - question: the question text
      - options: an array of 4 answer choices
      - correctOption: the index (0-3) of the correct answer
      
      For example:
      {
        "questions": [
          {
            "question": "What is X?",
            "options": ["A", "B", "C", "D"],
            "correctOption": 2
          },
          ...
        ]
      }`;
      
      console.log("Sending quiz generation prompt to Gemini API:", prompt.substring(0, 100) + "...");
      
      let text = "";
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        text = response.text();
        console.log("Successfully received quiz data from Gemini API");
      } catch (genAIError) {
        console.error("Detailed Gemini API error:", genAIError);
        throw new Error(`Gemini API error: ${genAIError instanceof Error ? genAIError.message : "Unknown error"}`);
      }
      
      // Parse the JSON response from the AI
      try {
        const parsedResponse = JSON.parse(text);
        res.json(parsedResponse);
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        // Try to fix the response format and extract questions
        const fixedResponse = {
          questions: extractQuestionsFromText(text)
        };
        res.json(fixedResponse);
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ 
        message: "Failed to generate quiz", 
        error: errorMessage
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to extract quiz questions from text if JSON parsing fails
function extractQuestionsFromText(text: string): any[] {
  // Fallback questions if extraction fails
  const fallbackQuestions = [
    {
      question: "What is the purpose of this function?",
      options: [
        "To test knowledge",
        "To provide feedback",
        "To assess understanding",
        "All of the above"
      ],
      correctOption: 3
    }
  ];
  
  try {
    // Try to find JSON structure in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonText = jsonMatch[0];
      const parsed = JSON.parse(jsonText);
      if (parsed.questions && Array.isArray(parsed.questions)) {
        return parsed.questions;
      }
    }
    
    return fallbackQuestions;
  } catch (error) {
    console.error("Error in extraction fallback:", error);
    return fallbackQuestions;
  }
}
