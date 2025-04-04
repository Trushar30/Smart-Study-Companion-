import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const studyPlans = pgTable("study_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  subject: text("subject").notNull(),
  topics: jsonb("topics").$type<string[]>().notNull(),
  examDateTime: text("exam_date_time").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  topic: text("topic").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  topic: text("topic").notNull(),
  score: integer("score").notNull(),
  date: timestamp("date").defaultNow().notNull(),
});

export const topicProgress = pgTable("topic_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  topic: text("topic").notNull(),
  progress: integer("progress").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const checkpoints = pgTable("checkpoints", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  studyPlanId: integer("study_plan_id").references(() => studyPlans.id),
  topic: text("topic").notNull(),
  dateCompleted: timestamp("date_completed").defaultNow().notNull(),
  minutesSpent: integer("minutes_spent").notNull(),
  notes: text("notes"),
  isCompleted: boolean("is_completed").default(false).notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertStudyPlanSchema = createInsertSchema(studyPlans).pick({
  userId: true,
  subject: true,
  topics: true,
  examDateTime: true,
  content: true,
});

export const insertNoteSchema = createInsertSchema(notes).pick({
  userId: true,
  topic: true,
  content: true,
});

export const insertQuizResultSchema = createInsertSchema(quizResults).pick({
  userId: true,
  topic: true,
  score: true,
});

export const insertTopicProgressSchema = createInsertSchema(topicProgress).pick({
  userId: true,
  topic: true,
  progress: true,
});

export const insertCheckpointSchema = createInsertSchema(checkpoints).pick({
  userId: true,
  studyPlanId: true,
  topic: true,
  minutesSpent: true,
  notes: true,
  isCompleted: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCheckpoint = z.infer<typeof insertCheckpointSchema>;
export type User = typeof users.$inferSelect;
export type StudyPlan = typeof studyPlans.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type QuizResult = typeof quizResults.$inferSelect;
export type TopicProgress = typeof topicProgress.$inferSelect;
export type Checkpoint = typeof checkpoints.$inferSelect;
