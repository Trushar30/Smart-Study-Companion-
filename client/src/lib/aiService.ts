import { Question } from "./types";
import { apiRequest } from "./queryClient";
import { generateId } from "./utils";

// Error messages
const API_KEY_MISSING_MESSAGE = "Gemini API key is not configured. Please set a valid GEMINI_API_KEY in the environment variables.";
const MODEL_NOT_FOUND_MESSAGE = "The Gemini AI model could not be found. This could be due to an API version mismatch.";
const API_CONNECTIVITY_ISSUES = "Unable to connect to the Gemini AI service. Please check your internet connection and try again.";

// Helper function to parse error messages from the server
function parseErrorFromResponse(responseText: string): string {
  // Check for specific error patterns in the response
  if (responseText.includes("is not found for API version")) {
    return MODEL_NOT_FOUND_MESSAGE;
  }
  
  if (responseText.includes("Error fetching from")) {
    return API_CONNECTIVITY_ISSUES;
  }
  
  // Return the original message if no patterns match
  return responseText;
}

// Generate a study plan
export async function generateStudyPlan(
  subject: string,
  topics: string[],
  examDateTime: string
): Promise<{ message: string; plan: string }> {
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
      console.error("Error details from server:", data);
      
      // Parse the error message for user-friendly display
      const errorMessage = data.error 
        ? parseErrorFromResponse(data.error)
        : "Failed to generate study plan";
      
      throw new Error(errorMessage);
    } catch (e) {
      // If we can't parse the JSON response, use generic error
      console.error("Error parsing server response:", e);
      throw new Error(`Failed to generate study plan (Status: ${response.status}). Please check your API key and try again.`);
    }
  }

  // Parse and return the successful response
  const data = await response.json();
  return data;
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
    try {
      // Try to get detailed error message from response
      const data = await response.json();
      console.error("Error details from server:", data);
      
      // Parse the error message for user-friendly display
      const errorMessage = data.error 
        ? parseErrorFromResponse(data.error)
        : "Failed to generate notes";
        
      throw new Error(errorMessage);
    } catch (e) {
      // If we can't parse the JSON response, use generic error
      console.error("Error parsing server response:", e);
      throw new Error(`Failed to generate notes (Status: ${response.status}). Please check your API key and try again.`);
    }
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
    try {
      // Try to get detailed error message from response
      const data = await response.json();
      console.error("Error details from server:", data);
      
      // Parse the error message for user-friendly display
      const errorMessage = data.error 
        ? parseErrorFromResponse(data.error)
        : "Failed to generate explanation";
        
      throw new Error(errorMessage);
    } catch (e) {
      // If we can't parse the JSON response, use generic error
      console.error("Error parsing server response:", e);
      throw new Error(`Failed to generate explanation (Status: ${response.status}). Please check your API key and try again.`);
    }
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
    try {
      // Try to get detailed error message from response
      const data = await response.json();
      console.error("Error details from server:", data);
      
      // Parse the error message for user-friendly display
      const errorMessage = data.error 
        ? parseErrorFromResponse(data.error)
        : "Failed to generate quiz";
        
      throw new Error(errorMessage);
    } catch (e) {
      // If we can't parse the JSON response, use generic error
      console.error("Error parsing server response:", e);
      throw new Error(`Failed to generate quiz (Status: ${response.status}). Please check your API key and try again.`);
    }
  }
  
  const data = await response.json();
  
  // Process the quiz data and add IDs to each question
  return data.questions.map((q: any) => ({
    ...q,
    id: generateId()
  }));
}
