import { 
  type User, 
  type InsertUser, 
  type Question, 
  type InsertQuestion, 
  type Comment, 
  type InsertComment,
  type QuestionWithAuthor,
  type CommentWithAuthor
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getTopHelpers(): Promise<User[]>;
  
  // Question methods
  getQuestion(id: string): Promise<Question | undefined>;
  getQuestions(): Promise<Question[]>;
  getQuestionsWithAuthors(): Promise<QuestionWithAuthor[]>;
  getQuestionWithAuthor(id: string): Promise<QuestionWithAuthor | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: string, updates: Partial<Question>): Promise<Question | undefined>;
  
  // Comment methods
  getComment(id: string): Promise<Comment | undefined>;
  getCommentsForQuestion(questionId: string): Promise<CommentWithAuthor[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  updateComment(id: string, updates: Partial<Comment>): Promise<Comment | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private questions: Map<string, Question> = new Map();
  private comments: Map<string, Comment> = new Map();

  constructor() {
    // Initialize with some demo data for development
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo users
    const demoUsers = [
      {
        id: randomUUID(),
        firebaseUid: "demo-user-1",
        email: "alex.chen@example.com",
        name: "Alex Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        points: 1247,
        rank: "Gold Helper",
        questionsAnswered: 73,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        firebaseUid: "demo-user-2",
        email: "sarah.johnson@example.com",
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        points: 892,
        rank: "Silver Helper",
        questionsAnswered: 45,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        firebaseUid: "demo-user-3",
        email: "david.kim@example.com",
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        points: 1847,
        rank: "Diamond Helper",
        questionsAnswered: 128,
        createdAt: new Date(),
      },
    ];

    demoUsers.forEach(user => this.users.set(user.id, user));

    // Create demo questions
    const userIds = Array.from(this.users.keys());
    const demoQuestions = [
      {
        id: randomUUID(),
        title: "Need help with quadratic equations - finding roots",
        content: "I'm struggling with solving quadratic equations using the quadratic formula. Can someone explain the steps and maybe show an example?",
        subject: "Mathematics",
        gradeLevel: "Grade 11",
        difficulty: "Easy",
        images: ["https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop"],
        authorId: userIds[1],
        solved: false,
        likes: 12,
        views: 45,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: randomUUID(),
        title: "Understanding Newton's Second Law - Force and Acceleration",
        content: "I understand F = ma conceptually, but I'm having trouble applying it to real-world problems. Can someone break down the problem-solving approach?",
        subject: "Physics",
        gradeLevel: "Grade 12",
        difficulty: "Medium",
        images: [],
        authorId: userIds[2],
        solved: false,
        likes: 18,
        views: 67,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
      {
        id: randomUUID(),
        title: "Balancing complex chemical equations with multiple compounds",
        content: "Having trouble balancing this equation: C₈H₁₈ + O₂ → CO₂ + H₂O. What's the systematic approach?",
        subject: "Chemistry",
        gradeLevel: "Grade 11",
        difficulty: "Hard",
        images: [],
        authorId: userIds[1],
        solved: true,
        likes: 25,
        views: 89,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
    ];

    demoQuestions.forEach(question => this.questions.set(question.id, question));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.firebaseUid === firebaseUid);
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      avatar: insertUser.avatar || null,
      points: insertUser.points || 0,
      rank: insertUser.rank || "Bronze Helper",
      questionsAnswered: insertUser.questionsAnswered || 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getTopHelpers(): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 10);
  }

  // Question methods
  async getQuestion(id: string): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async getQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values());
  }

  async getQuestionsWithAuthors(): Promise<QuestionWithAuthor[]> {
    const questions = Array.from(this.questions.values());
    const questionsWithAuthors: QuestionWithAuthor[] = [];

    for (const question of questions) {
      const author = this.users.get(question.authorId);
      if (author) {
        const commentCount = Array.from(this.comments.values())
          .filter(comment => comment.questionId === question.id).length;
        
        questionsWithAuthors.push({
          ...question,
          author,
          commentCount,
        });
      }
    }

    return questionsWithAuthors;
  }

  async getQuestionWithAuthor(id: string): Promise<QuestionWithAuthor | undefined> {
    const question = this.questions.get(id);
    if (!question) return undefined;

    const author = this.users.get(question.authorId);
    if (!author) return undefined;

    const commentCount = Array.from(this.comments.values())
      .filter(comment => comment.questionId === question.id).length;

    return {
      ...question,
      author,
      commentCount,
    };
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = randomUUID();
    const question: Question = {
      ...insertQuestion,
      id,
      images: insertQuestion.images || null,
      solved: false,
      likes: 0,
      views: 0,
      createdAt: new Date(),
    };
    this.questions.set(id, question);
    return question;
  }

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question | undefined> {
    const question = this.questions.get(id);
    if (!question) return undefined;
    
    const updatedQuestion = { ...question, ...updates };
    this.questions.set(id, updatedQuestion);
    return updatedQuestion;
  }

  // Comment methods
  async getComment(id: string): Promise<Comment | undefined> {
    return this.comments.get(id);
  }

  async getCommentsForQuestion(questionId: string): Promise<CommentWithAuthor[]> {
    const comments = Array.from(this.comments.values())
      .filter(comment => comment.questionId === questionId);
    
    const commentsWithAuthors: CommentWithAuthor[] = [];
    for (const comment of comments) {
      const author = this.users.get(comment.authorId);
      if (author) {
        commentsWithAuthors.push({
          ...comment,
          author,
        });
      }
    }

    return commentsWithAuthors;
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = {
      ...insertComment,
      id,
      parentId: insertComment.parentId || null,
      helpful: false,
      likes: 0,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);
    return comment;
  }

  async updateComment(id: string, updates: Partial<Comment>): Promise<Comment | undefined> {
    const comment = this.comments.get(id);
    if (!comment) return undefined;
    
    const updatedComment = { ...comment, ...updates };
    this.comments.set(id, updatedComment);
    return updatedComment;
  }
}

export const storage = new MemStorage();
