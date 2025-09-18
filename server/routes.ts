import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertUserSchema, insertQuestionSchema, insertCommentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      // In a real app, you would verify the Firebase token here
      // For demo purposes, return the first user
      const users = await storage.getUsers();
      if (users.length > 0) {
        res.json(users[0]);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error getting current user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Question routes
  app.get("/api/questions", async (req, res) => {
    try {
      const { sortBy } = req.query;
      const questions = await storage.getQuestionsWithAuthors();
      
      // Sort questions based on sortBy parameter
      let sortedQuestions = [...questions];
      if (sortBy === "helpful") {
        sortedQuestions.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      } else if (sortBy === "unanswered") {
        sortedQuestions = sortedQuestions.filter(q => q.commentCount === 0);
      } else {
        // Default to newest
        sortedQuestions.sort((a, b) => (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0));
      }
      
      res.json(sortedQuestions);
    } catch (error) {
      console.error("Error getting questions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/questions", async (req, res) => {
    try {
      const questionData = insertQuestionSchema.parse(req.body);
      // For demo purposes, use the first user as the author
      const users = await storage.getUsers();
      if (users.length === 0) {
        return res.status(400).json({ message: "No users found" });
      }
      
      const questionWithAuthor = {
        ...questionData,
        authorId: users[0].id,
      };
      
      const question = await storage.createQuestion(questionWithAuthor);
      res.json(question);
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(400).json({ message: "Invalid question data" });
    }
  });

  app.get("/api/questions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const question = await storage.getQuestionWithAuthor(id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      console.error("Error getting question:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Comment routes
  app.get("/api/questions/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;
      const comments = await storage.getCommentsForQuestion(id);
      res.json(comments);
    } catch (error) {
      console.error("Error getting comments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/questions/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;
      const commentData = insertCommentSchema.parse(req.body);
      
      // For demo purposes, use the first user as the author
      const users = await storage.getUsers();
      if (users.length === 0) {
        return res.status(400).json({ message: "No users found" });
      }
      
      const commentWithIds = {
        ...commentData,
        questionId: id,
        authorId: users[0].id,
      } as any;
      
      const comment = await storage.createComment(commentWithIds);
      res.json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(400).json({ message: "Invalid comment data" });
    }
  });

  // User routes
  app.get("/api/users/top-helpers", async (req, res) => {
    try {
      const users = await storage.getTopHelpers();
      res.json(users);
    } catch (error) {
      console.error("Error getting top helpers:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
