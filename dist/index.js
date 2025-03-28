// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  messages;
  chats;
  userCurrentId;
  messageCurrentId;
  chatCurrentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.messages = /* @__PURE__ */ new Map();
    this.chats = /* @__PURE__ */ new Map();
    this.userCurrentId = 1;
    this.messageCurrentId = 1;
    this.chatCurrentId = 1;
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userCurrentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Message methods
  async createMessage(insertMessage) {
    const id = this.messageCurrentId++;
    const createdAt = /* @__PURE__ */ new Date();
    const message = { ...insertMessage, id, createdAt };
    this.messages.set(id, message);
    return message;
  }
  async getMessages() {
    return Array.from(this.messages.values());
  }
  // Chat history methods
  async createChatHistory(insertChat) {
    const id = this.chatCurrentId++;
    const timestamp2 = /* @__PURE__ */ new Date();
    const chat = { ...insertChat, id, timestamp: timestamp2 };
    this.chats.set(id, chat);
    return chat;
  }
  async getChatHistoryBySessionId(sessionId) {
    return Array.from(this.chats.values()).filter((chat) => chat.sessionId === sessionId).sort((a, b) => a.id - b.id);
  }
};
var storage = new MemStorage();

// server/routes.ts
import { z } from "zod";

// shared/schema.ts
import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  message: text("message").notNull(),
  isUser: boolean("is_user").notNull(),
  timestamp: timestamp("timestamp").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertMessageSchema = createInsertSchema(messages).pick({
  name: true,
  email: true,
  subject: true,
  message: true
});
var insertChatHistorySchema = createInsertSchema(chatHistory).pick({
  sessionId: true,
  message: true,
  isUser: true
});

// server/openai-service.ts
import OpenAI from "openai";
import "dotenv/config";
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
var portfolioContext = `
You are an AI assistant for a data science and AI portfolio website. Your ONLY purpose is to answer questions 
based on the resume information below. DO NOT make up any information or provide details not found in this resume.

RESUME INFORMATION:
Name: Prabhmehar Pal Singh Bedi
Contact: +91 90411-06968 | prabhmehar2509@gmail.com | linkedin.com/in/prabhmeharbedi | github.com/prabhmeharbedi

EDUCATION:
- Bachelor of Engineering in Electronics and Computer with Minor in Conversational AI by NVIDIA
  Thapar Institute of Engineering and Technology, Patiala, India (2021-2025)
  CGPA: 8.31
- CBSE Senior Secondary (12th): 93%, Secondary (10th): 94.4%
  GRM School, Bareilly, India (2019-2021)

EXPERIENCE:
1. Generative AI Intern at TerraByte Technologies, Bengaluru, India (Jan 2025-Present)
   - Implemented and customized LLMs through prompt engineering to build custom RAG code generation systems
   - Developed advanced RAG pipelines using LangChain with ChromaDB and Cohere embeddings
   - Designed evaluation framework using RAGAS to measure context relevance, answer faithfulness, and semantic similarity
   - Engineered short-term and long-term memory systems for AI chat applications

POSITION OF RESPONSIBILITY:
- Finance Secretary, Environment Conservation Club (Jan 2023-Dec 2024)
   - Directed allocation of funds for club activities, ensuring optimal resource use for 200+ members
   - Organized society fair showcasing past projects and led development of six projects involving 50+ students
   - Enhanced financial acumen and effective collaboration with senior stakeholders

PROJECTS:
1. Fracture Detection (Sept 2024)
   - Developed medical image analysis system using CNNs to detect bone fractures in X-ray images with 90% accuracy
   - Implemented web interface for seamless interaction between deep learning model and users
   - Fine-tuned model hyperparameters and deployed on cloud platform for real-time accessibility

2. Real Time Motorcycle Helmet Rule Violation Detection (July 2024)
   - Developed real-time motorcyclist helmet rule violation detection system using YOLO v8 with 86.8% accuracy
   - Integrated model with Jetson Nano for real-time detection to enhance road safety measures
   - Evaluated effectiveness of ResNet50 and VGG19 neural network architectures

3. Article Sentiment Analysis (Jan 2024)
   - Engineered sentiment analysis system to extract emotional tones from articles with 86% accuracy
   - Implemented web scraping with Python (requests, BeautifulSoup) for data collection
   - Applied advanced NLP techniques using nltk for precise sentiment analysis
   - Developed interactive visualization dashboard with Tableau for effective display of insights

SKILLS:
- Languages: Python, SQL, C/C++
- Machine Learning/AI: Natural Language Processing, Deep Learning, RAG, Prompt Engineering, Vector Databases
- Frameworks/Libraries: PyTorch, TensorFlow, Keras, LangChain, Hugging Face, scikit-learn, Pandas, Matplotlib
- Tools/Platforms: Git, VS Code, Jupyter, SQL Workbench, MS Excel
- Soft Skills: Problem Solving, Team Collaboration, Technical Documentation, Project Management, Communication

Respond as if you are Prabhmehar's personal assistant. You can ONLY discuss information that appears in this resume.
If asked about anything not covered in this resume, politely explain that you don't have that information and
suggest contacting Prabhmehar directly through the contact form. Keep responses concise and professional.
`;
async function getAIResponse(userMessage) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: portfolioContext },
        { role: "user", content: userMessage }
      ]
    });
    return completion.choices[0].message.content || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}

// server/email-service.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
var EMAIL_USER = process.env.EMAIL_USER;
var EMAIL_PASS = process.env.EMAIL_PASS;
var EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
var EMAIL_PORT = parseInt(process.env.EMAIL_PORT || "587", 10);
var EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER;
var EMAIL_TO = process.env.EMAIL_TO || EMAIL_USER;
if (!EMAIL_USER || !EMAIL_PASS) {
  console.error("ERROR: Email configuration is missing. Please check your .env file.");
}
var transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465,
  // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});
async function sendContactEmail(name, email, subject, message) {
  try {
    const mailOptions = {
      from: `"Portfolio Contact" <${EMAIL_FROM}>`,
      to: EMAIL_TO,
      subject: `Portfolio - ${subject}`,
      text: `Name: ${name}
Email: ${email}

${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6C63FF;">New Contact Message from Portfolio</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="white-space: pre-line;">${message.replace(/\n/g, "<br>")}</p>
          </div>
          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>This email was sent from your portfolio contact form.</p>
          </div>
        </div>
      `
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log("Email server connection verified");
    return true;
  } catch (error) {
    console.error("Email server connection failed:", error);
    return false;
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  await verifyEmailConnection();
  app2.post("/api/contact", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
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
      }
      res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(400).json({ success: false, message: "Invalid message data" });
    }
  });
  app2.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = z.object({
        message: z.string(),
        sessionId: z.string()
      }).parse(req.body);
      await storage.createChatHistory({
        sessionId,
        message,
        isUser: true
      });
      try {
        const aiResponse = await getAIResponse(message);
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
        const fallbackResponse = "I'm currently experiencing some technical difficulties. Please try again later or use the contact form to get in touch directly.";
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
  app2.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const history = await storage.getChatHistoryBySessionId(sessionId);
      res.json({ success: true, history });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error retrieving chat history" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 3e3;
  server.listen(port, "localhost", () => {
    log(`serving on http://localhost:${port}`);
  });
})();
