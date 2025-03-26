"use client"

import { forwardRef, useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Brain, ImageIcon, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AiTool {
  id: string
  name: string
  description: string
  icon: JSX.Element
  demoComponent: JSX.Element
  techStack: string[]
}

const AiToolsSection = forwardRef<HTMLDivElement>((props, ref) => {
  const [activeTab, setActiveTab] = useState("chatbot")

  const aiTools: AiTool[] = [
    {
      id: "chatbot",
      name: "Chatbot Framework",
      description: "A custom NLP engine for enterprise support with context-aware responses.",
      icon: <MessageSquare className="h-5 w-5" />,
      demoComponent: <ChatbotDemo />,
      techStack: ["Python", "PyTorch", "FastAPI", "React"],
    },
    {
      id: "image-gen",
      name: "Image Generator",
      description: "A diffusion model for generating custom artwork from text prompts.",
      icon: <ImageIcon className="h-5 w-5" />,
      demoComponent: <ImageGenDemo />,
      techStack: ["Python", "PyTorch", "Diffusers", "Transformers"],
    },
    {
      id: "sentiment",
      name: "Sentiment Analyzer",
      description: "Real-time sentiment analysis for social media monitoring.",
      icon: <Brain className="h-5 w-5" />,
      demoComponent: <SentimentDemo />,
      techStack: ["Python", "Hugging Face", "Streamlit", "MongoDB"],
    },
  ]

  return (
    <section id="tools" ref={ref} className="relative min-h-screen py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">AI Tools</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Custom AI tools I've developed for various applications.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-3">
            {aiTools.map((tool) => (
              <TabsTrigger key={tool.id} value={tool.id} className="flex items-center gap-2">
                {tool.icon}
                <span className="hidden sm:inline">{tool.name.split(" ")[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {aiTools.map((tool) => (
            <TabsContent key={tool.id} value={tool.id} className="mt-0">
              <Card className="overflow-hidden border-2 shadow-lg">
                <CardHeader className="bg-muted/50 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {tool.icon}
                    </div>
                    <div>
                      <CardTitle>{tool.name}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">{tool.demoComponent}</CardContent>
                <CardFooter className="flex flex-wrap gap-2 border-t bg-muted/30 px-6 py-4">
                  <div className="mr-auto text-sm text-muted-foreground">Tech stack:</div>
                  {tool.techStack.map((tech) => (
                    <div key={tech} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {tech}
                    </div>
                  ))}
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
})

AiToolsSection.displayName = "AiToolsSection"

function ChatbotDemo() {
  const [messages, setMessages] = useState([{ role: "bot", content: "Hello! How can I help you today?" }])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    setMessages([...messages, { role: "user", content: input }])

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Thanks for your message! This is a simulated response from the chatbot framework.",
        },
      ])
    }, 1000)

    setInput("")
  }

  return (
    <div className="flex h-[300px] flex-col rounded-lg border">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  )
}

function ImageGenDemo() {
  const [prompt, setPrompt] = useState("")
  const [image, setImage] = useState("/placeholder.svg?height=300&width=400")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    // Simulate image generation
    setTimeout(() => {
      setImage("/placeholder.svg?height=300&width=400")
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="prompt" className="text-sm font-medium">
          Enter a prompt:
        </label>
        <div className="flex gap-2">
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A surreal landscape with floating islands..."
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          />
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-lg border">
        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="h-8 w-8 animate-pulse text-primary" />
              <p className="text-sm font-medium">Generating image...</p>
            </div>
          </div>
        )}
        <img src={image || "/placeholder.svg"} alt="Generated image" className="h-full w-full object-cover" />
      </div>
    </div>
  )
}

function SentimentDemo() {
  const [text, setText] = useState("")
  const [sentiment, setSentiment] = useState<number | null>(null)

  const handleAnalyze = () => {
    if (!text.trim()) return

    // Simulate sentiment analysis
    const randomSentiment = Math.random() * 2 - 1 // Between -1 and 1
    setSentiment(randomSentiment)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="text" className="text-sm font-medium">
          Enter text to analyze:
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter some text to analyze the sentiment..."
          className="min-h-[100px] rounded-md border border-input bg-background p-3 text-sm ring-offset-background"
        />
        <Button onClick={handleAnalyze} className="self-end">
          Analyze Sentiment
        </Button>
      </div>

      {sentiment !== null && (
        <div className="rounded-lg border bg-card p-4">
          <h4 className="mb-2 text-sm font-medium">Sentiment Analysis Result:</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Negative</span>
              <span className="text-sm text-muted-foreground">Positive</span>
            </div>
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`absolute inset-y-0 left-0 ${sentiment > 0 ? "bg-green-500" : "bg-red-500"}`}
                style={{ width: `${Math.abs(sentiment) * 100}%`, left: sentiment < 0 ? 0 : "50%" }}
              ></div>
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-muted-foreground"></div>
            </div>
            <p className="text-center text-sm font-medium">Score: {sentiment.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AiToolsSection

