"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatAssistantProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatAssistant({ isOpen, onClose }: ChatAssistantProps) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm the AI assistant for this portfolio. I can answer questions about the projects, skills, and experience showcased here. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    setMessages([...messages, { role: "user", content: input }])
    setInput("")
    setIsTyping(true)

    // Simulate AI thinking and response
    setTimeout(() => {
      let response = "I'm not sure about that. Can you ask something about the portfolio, projects, or skills?"

      // Simple pattern matching for demo purposes
      const query = input.toLowerCase()
      if (query.includes("project") || query.includes("work")) {
        response =
          "The portfolio showcases several projects including a Neural Style Transfer App, Predictive Analytics Dashboard, NLP Sentiment Analyzer, and a Generative Art Installation. Each demonstrates different aspects of data science and AI expertise."
      } else if (query.includes("skill") || query.includes("technology")) {
        response =
          "The skills demonstrated in this portfolio include machine learning (TensorFlow, PyTorch), data analysis (Pandas, R), web development (React, Next.js), and creative coding for generative art."
      } else if (query.includes("experience") || query.includes("background")) {
        response =
          "The portfolio owner has experience as a Lead Data Scientist at AI Solutions Inc., an AI Engineer at TechCorp, and started as a Data Analyst at DataViz Co. They have a strong background in both practical applications and research."
      } else if (query.includes("contact") || query.includes("hire")) {
        response =
          "You can reach out through the contact information provided in the resume section. They're currently open to collaboration opportunities and consulting work in AI and data science."
      } else if (query.includes("hello") || query.includes("hi")) {
        response =
          "Hello! Welcome to this AI-integrated portfolio. Feel free to ask about any projects, skills, or experiences you see here."
      }

      setIsTyping(false)
      setMessages((prev) => [...prev, { role: "assistant", content: response }])
    }, 1500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-20 right-6 z-50 w-full max-w-sm rounded-lg border bg-card shadow-lg"
        >
          <div className="flex items-center justify-between border-b p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-medium">Portfolio Assistant</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8" aria-label="Close chat">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-80 overflow-y-auto p-3">
            {messages.map((message, index) => (
              <div key={index} className={`mb-3 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="mb-3 flex justify-start">
                <div className="flex max-w-[85%] items-center gap-1 rounded-lg bg-muted px-3 py-2">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></span>
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
              <Button size="sm" onClick={handleSend} disabled={isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

