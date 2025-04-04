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
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    // Try a different model version - older model may be more widely available
    try {
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
      console.log("Gemini AI model initialized successfully with gemini-pro");
    } catch (error) {
      console.error("Error with gemini-pro model, trying alternative:", error);
      // Fallback to a newer model if available
      model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
      console.log("Gemini AI model initialized successfully with gemini-1.0-pro");
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
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Store in memory if needed for later use
      await storage.saveStudyPlan({
        subject,
        topics,
        examDateTime,
        content: text
      });
      
      res.json({ message: "Study plan generated successfully", plan: text });
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
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();
      
      res.json({ message: "Notes generated successfully", content });
    } catch (error) {
      console.error("Error generating notes:", error);
      res.status(500).json({ message: "Failed to generate notes" });
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
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();
      
      res.json({ message: "Explanation generated successfully", content });
    } catch (error) {
      console.error("Error generating explanation:", error);
      res.status(500).json({ message: "Failed to generate explanation" });
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
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
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
      res.status(500).json({ message: "Failed to generate quiz" });
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
