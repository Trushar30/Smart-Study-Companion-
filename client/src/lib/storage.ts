import { StudyPlan, TopicProgress, Note } from "./types";
import { generateId } from "./utils";

// Constants
const STORAGE_KEYS = {
  STUDY_PLAN: "smartstudy_plan",
  TOPICS_PROGRESS: "smartstudy_topics_progress",
  NOTES: "smartstudy_notes",
  QUIZ_RESULTS: "smartstudy_quiz_results",
};

// Study Plan Operations
export function saveStudyPlan(plan: StudyPlan): void {
  localStorage.setItem(STORAGE_KEYS.STUDY_PLAN, JSON.stringify(plan));
  
  // When a new study plan is created, initialize topic progress
  const topics: TopicProgress[] = plan.topics.map(topic => ({
    id: generateId(),
    name: topic,
    progress: 0,
  }));
  
  saveTopicsProgress(topics);
}

export function getStudyPlan(): StudyPlan | null {
  const planData = localStorage.getItem(STORAGE_KEYS.STUDY_PLAN);
  return planData ? JSON.parse(planData) : null;
}

// Topic Progress Operations
export function saveTopicsProgress(topics: TopicProgress[]): void {
  localStorage.setItem(STORAGE_KEYS.TOPICS_PROGRESS, JSON.stringify(topics));
}

export function getTopicsProgress(): TopicProgress[] {
  const topicsData = localStorage.getItem(STORAGE_KEYS.TOPICS_PROGRESS);
  return topicsData ? JSON.parse(topicsData) : [];
}

export function updateTopicProgress(topicId: string, newProgress: number): void {
  const topics = getTopicsProgress();
  const updatedTopics = topics.map(topic => {
    if (topic.id === topicId) {
      return { ...topic, progress: newProgress };
    }
    return topic;
  });
  
  saveTopicsProgress(updatedTopics);
}

// Notes Operations
export function saveNote(note: Note): void {
  const notes = getSavedNotes();
  notes.push(note);
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
}

export function getSavedNotes(): Note[] {
  const notesData = localStorage.getItem(STORAGE_KEYS.NOTES);
  return notesData ? JSON.parse(notesData) : [];
}

export function deleteNote(noteId: string): void {
  const notes = getSavedNotes();
  const updatedNotes = notes.filter(note => note.id !== noteId);
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));
}

// Clear all data
export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.STUDY_PLAN);
  localStorage.removeItem(STORAGE_KEYS.TOPICS_PROGRESS);
  localStorage.removeItem(STORAGE_KEYS.NOTES);
  localStorage.removeItem(STORAGE_KEYS.QUIZ_RESULTS);
}
