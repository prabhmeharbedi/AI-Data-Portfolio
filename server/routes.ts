import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertMessageSchema } from "@shared/schema";
import { getAIResponse } from "./openai-service";
import { sendContactEmail, verifyEmailConnection } from "./email-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Verify email connection when server starts
  await verifyEmailConnection();

  // API routes
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate the incoming data
      const messageData = insertMessageSchema.parse(req.body);
      
      // Save to database
      const message = await storage.createMessage(messageData);
      
      // Send email notification
      try {
        await sendContactEmail(
          messageData.name,
          messageData.email,
          messageData.subject,
          messageData.message
        );
        console.log("Contact email sent successfully");
      } catch (emailError) {
        console.error("Error sending contact email:", emailError);
        // We still return success even if email fails, since data was saved to DB
      }
      
      res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(400).json({ success: false, message: "Invalid message data" });
    }
  });

  // Chat with GPT-4
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = z.object({
        message: z.string(),
        sessionId: z.string()
      }).parse(req.body);

      // Save user message to history
      await storage.createChatHistory({
        sessionId,
        message,
        isUser: true
      });

      try {
        // Get response from OpenAI service
        const aiResponse = await getAIResponse(message);

        // Save AI response to history
        await storage.createChatHistory({
          sessionId,
          message: aiResponse,
          isUser: false
        });

        res.json({ 
          success: true, 
          message: aiResponse 
        });
      } catch (error) {
        console.error("OpenAI API error:", error);
        
        // Fallback response if API fails
        const fallbackResponse = "I'm currently experiencing some technical difficulties. Please try again later or use the contact form to get in touch directly.";
        
        // Save fallback response to history
        await storage.createChatHistory({
          sessionId,
          message: fallbackResponse,
          isUser: false
        });
        
        res.json({ 
          success: true, 
          message: fallbackResponse,
          error: "API error"
        });
      }
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: "Invalid request format" 
      });
    }
  });

  // Get chat history for a session
  app.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const history = await storage.getChatHistoryBySessionId(sessionId);
      res.json({ success: true, history });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error retrieving chat history" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
