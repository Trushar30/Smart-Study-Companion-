import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveStudyPlan(plan: {
    subject: string;
    topics: string[];
    examDateTime: string;
    content: string;
  }): Promise<void>;
  getStudyPlan(subject: string): Promise<any | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private studyPlans: Map<string, any>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.studyPlans = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async saveStudyPlan(plan: {
    subject: string;
    topics: string[];
    examDateTime: string;
    content: string;
  }): Promise<void> {
    this.studyPlans.set(plan.subject, plan);
  }
  
  async getStudyPlan(subject: string): Promise<any | undefined> {
    return this.studyPlans.get(subject);
  }
}

export const storage = new MemStorage();
