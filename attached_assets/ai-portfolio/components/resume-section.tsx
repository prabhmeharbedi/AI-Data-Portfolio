"use client"

import { forwardRef, useState } from "react"
import { motion } from "framer-motion"
import { Download, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ResumeSection = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <section id="resume" ref={ref} className="relative min-h-screen py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Resume</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">My professional experience and qualifications.</p>
        </motion.div>

        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Resume
          </Button>
          <ResumeChat />
        </div>

        <Tabs defaultValue="experience" className="w-full">
          <TabsList className="mx-auto grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="experience" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <ResumeItem
                    title="Lead Data Scientist"
                    organization="AI Solutions Inc."
                    period="2023 - Present"
                    description="Leading a team of data scientists on cutting-edge AI projects. Developed machine learning models for predictive analytics and computer vision applications."
                  />
                  <ResumeItem
                    title="AI Engineer"
                    organization="TechCorp"
                    period="2021 - 2023"
                    description="Implemented deep learning models for natural language processing and recommendation systems. Collaborated with product teams to integrate AI features into the company's platform."
                  />
                  <ResumeItem
                    title="Data Analyst"
                    organization="DataViz Co."
                    period="2019 - 2021"
                    description="Analyzed large datasets to extract insights and create visualizations. Built dashboards for business intelligence and reporting."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <ResumeItem
                    title="M.S. in Data Science"
                    organization="Tech University"
                    period="2018 - 2020"
                    description="Graduated with honors. Specialized in machine learning and computer vision. Thesis on 'Neural Networks for Image Generation'."
                  />
                  <ResumeItem
                    title="B.S. in Computer Science"
                    organization="State University"
                    period="2014 - 2018"
                    description="Minor in Mathematics. Dean's List all semesters. Participated in programming competitions and AI research projects."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <SkillCategory title="Programming Languages" skills={["Python", "JavaScript", "R", "SQL", "C++"]} />
                  <SkillCategory
                    title="Machine Learning"
                    skills={["TensorFlow", "PyTorch", "Scikit-learn", "Computer Vision", "NLP"]}
                  />
                  <SkillCategory
                    title="Data Engineering"
                    skills={["Pandas", "Spark", "Hadoop", "ETL Pipelines", "Data Warehousing"]}
                  />
                  <SkillCategory title="Web Development" skills={["React", "Next.js", "Node.js", "D3.js", "Flask"]} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
})

ResumeSection.displayName = "ResumeSection"

function ResumeItem({
  title,
  organization,
  period,
  description,
}: {
  title: string
  organization: string
  period: string
  description: string
}) {
  return (
    <div className="border-l-2 border-primary/50 pl-4">
      <h3 className="text-xl font-bold">{title}</h3>
      <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
        <p className="font-medium">{organization}</p>
        <p className="text-sm text-muted-foreground">{period}</p>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function SkillCategory({ title, skills }: { title: string; skills: string[] }) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-bold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <div key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {skill}
          </div>
        ))}
      </div>
    </div>
  )
}

function ResumeChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const [conversation, setConversation] = useState([
    {
      role: "assistant",
      content: "Hello! I can answer questions about my resume. What would you like to know?",
    },
  ])

  const handleSend = () => {
    if (!question.trim()) return

    // Add user question
    setConversation([...conversation, { role: "user", content: question }])

    // Simulate AI response
    setTimeout(() => {
      let response = "I don't have information about that yet."

      if (question.toLowerCase().includes("experience")) {
        response =
          "I have over 4 years of experience in data science and AI, including roles as a Lead Data Scientist and AI Engineer."
      } else if (question.toLowerCase().includes("education")) {
        response =
          "I have a Master's degree in Data Science from Tech University and a Bachelor's in Computer Science from State University."
      } else if (question.toLowerCase().includes("skill")) {
        response =
          "My skills include Python, TensorFlow, PyTorch, React, and data visualization. I specialize in machine learning and computer vision."
      }

      setConversation((prev) => [...prev, { role: "assistant", content: response }])
    }, 1000)

    setQuestion("")
  }

  if (!isOpen) {
    return (
      <Button variant="outline" onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        Ask About My Resume
      </Button>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium">Resume Q&A</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 px-2">
            Close
          </Button>
        </div>

        <div className="mb-4 h-60 overflow-y-auto rounded-md border bg-muted/30 p-3">
          {conversation.map((message, index) => (
            <div key={index} className={`mb-2 ${message.role === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask a question about my resume..."
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          />
          <Button size="sm" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ResumeSection

