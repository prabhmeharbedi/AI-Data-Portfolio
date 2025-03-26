import { 
  users, type User, type InsertUser,
  messages, type Message, type InsertMessage,
  chatHistory, type ChatHistory, type InsertChatHistory
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
  
  // Chat history methods
  createChatHistory(chat: InsertChatHistory): Promise<ChatHistory>;
  getChatHistoryBySessionId(sessionId: string): Promise<ChatHistory[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, Message>;
  private chats: Map<number, ChatHistory>;
  private userCurrentId: number;
  private messageCurrentId: number;
  private chatCurrentId: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.chats = new Map();
    this.userCurrentId = 1;
    this.messageCurrentId = 1;
    this.chatCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Message methods
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const createdAt = new Date();
    const message: Message = { ...insertMessage, id, createdAt };
    this.messages.set(id, message);
    return message;
  }
  
  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }
  
  // Chat history methods
  async createChatHistory(insertChat: InsertChatHistory): Promise<ChatHistory> {
    const id = this.chatCurrentId++;
    const timestamp = new Date();
    const chat: ChatHistory = { ...insertChat, id, timestamp };
    this.chats.set(id, chat);
    return chat;
  }
  
  async getChatHistoryBySessionId(sessionId: string): Promise<ChatHistory[]> {
    return Array.from(this.chats.values())
      .filter(chat => chat.sessionId === sessionId)
      .sort((a, b) => a.id - b.id); // Sort by ID for chronological order
  }
}

export const storage = new MemStorage();
