"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ArrowDown, MessageSquare, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import GenerativeBackground from "@/components/generative-background"
import Navigation from "@/components/navigation"
import AboutSection from "@/components/about-section"
import ProjectsSection from "@/components/projects-section"
import AiToolsSection from "@/components/ai-tools-section"
import ResumeSection from "@/components/resume-section"
import ChatAssistant from "@/components/chat-assistant"
import { useTheme } from "next-themes"

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const { theme, setTheme } = useTheme()
  const homeRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const toolsRef = useRef<HTMLDivElement>(null)
  const resumeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 },
    )

    const sections = [homeRef, aboutRef, projectsRef, toolsRef, resumeRef]
    sections.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => {
      sections.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      })
    }
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <GenerativeBackground />

      <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full bg-background/50 backdrop-blur-sm"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <Navigation activeSection={activeSection} />

      <section
        id="home"
        ref={homeRef}
        className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 max-w-3xl"
        >
          <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">Your Name</h1>
          <p className="mb-8 text-xl text-muted-foreground md:text-2xl">Data Scientist & AI Artist</p>
          <div className="mt-12 animate-bounce">
            <ArrowDown className="mx-auto h-8 w-8 text-primary" />
          </div>
        </motion.div>
      </section>

      <AboutSection ref={aboutRef} />
      <ProjectsSection ref={projectsRef} />
      <AiToolsSection ref={toolsRef} />
      <ResumeSection ref={resumeRef} />

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="rounded-full h-14 w-14 bg-primary/80 backdrop-blur-sm hover:bg-primary"
          aria-label="Open AI assistant"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>

      <ChatAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </main>
  )
}

