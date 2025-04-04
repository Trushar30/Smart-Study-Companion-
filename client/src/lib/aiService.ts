import { Question } from "./types";
import { apiRequest } from "./queryClient";
import { generateId } from "./utils";

// API key error message
const API_KEY_MISSING_MESSAGE = "Gemini API key is not configured. Please set a valid GEMINI_API_KEY in the environment variables.";

// Generate a study plan
export async function generateStudyPlan(
  subject: string,
  topics: string[],
  examDateTime: string
): Promise<void> {
  const response = await apiRequest(
    "POST",
    "/api/study-plan",
    { subject, topics, examDateTime }
  );

  if (response.status === 503) {
    throw new Error(API_KEY_MISSING_MESSAGE);
  }
  
  if (!response.ok) {
    try {
      // Try to get detailed error message from response
      const data = await response.json();
      throw new Error(data.error || "Failed to generate study plan");
    } catch (e) {
      // If we can't parse the JSON response, use generic error
      throw new Error("Failed to generate study plan. Please check your API key and try again.");
    }
  }
}

// Generate notes for a topic
export async function generateNotes(
  topic: string,
  detailLevel: string,
  format: string
): Promise<string> {
  const response = await apiRequest(
    "POST",
    "/api/notes",
    { topic, detailLevel, format }
  );
  
  if (response.status === 503) {
    throw new Error(API_KEY_MISSING_MESSAGE);
  }
  
  if (!response.ok) {
    throw new Error("Failed to generate notes");
  }
  
  const data = await response.json();
  return data.content;
}

// Generate real-world explanation
export async function generateRealWorldExplanation(topic: string): Promise<string> {
  const response = await apiRequest(
    "POST",
    "/api/explanation",
    { topic }
  );
  
  if (response.status === 503) {
    throw new Error(API_KEY_MISSING_MESSAGE);
  }
  
  if (!response.ok) {
    throw new Error("Failed to generate explanation");
  }
  
  const data = await response.json();
  return data.content;
}

// Generate quiz questions
export async function generateQuiz(
  topic: string,
  difficulty: string,
  numQuestions: number
): Promise<Question[]> {
  const response = await apiRequest(
    "POST",
    "/api/quiz",
    { topic, difficulty, numQuestions }
  );
  
  if (response.status === 503) {
    throw new Error(API_KEY_MISSING_MESSAGE);
  }
  
  if (!response.ok) {
    throw new Error("Failed to generate quiz");
  }
  
  const data = await response.json();
  
  // Process the quiz data and add IDs to each question
  return data.questions.map((q: any) => ({
    ...q,
    id: generateId()
  }));
}
