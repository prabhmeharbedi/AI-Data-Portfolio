"use client"

import { forwardRef, useState } from "react"
import { motion } from "framer-motion"
import { Briefcase, GraduationCap, Code, Brain, Network } from "lucide-react"
import type { JSX } from "react"

interface TimelineItem {
  id: string
  year: string
  title: string
  description: string
  icon: JSX.Element
}

const timelineData: TimelineItem[] = [
  {
    id: "education",
    year: "2020",
    title: "M.S. in Data Science",
    description: "Graduated with honors, focusing on deep learning and computer vision.",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    id: "job1",
    year: "2021",
    title: "AI Engineer at TechCorp",
    description: "Developed machine learning models for predictive analytics.",
    icon: <Briefcase className="h-5 w-5" />,
  },
  {
    id: "project",
    year: "2022",
    title: "Open Source Contribution",
    description: "Core contributor to a popular NLP library.",
    icon: <Code className="h-5 w-5" />,
  },
  {
    id: "job2",
    year: "2023",
    title: "Lead Data Scientist",
    description: "Leading a team of data scientists on cutting-edge AI projects.",
    icon: <Brain className="h-5 w-5" />,
  },
  {
    id: "present",
    year: "Present",
    title: "AI Research & Art",
    description: "Exploring the intersection of AI and generative art.",
    icon: <Network className="h-5 w-5" />,
  },
]

const AboutSection = forwardRef<HTMLDivElement>((props, ref) => {
  const [activeItem, setActiveItem] = useState<string | null>(null)

  return (
    <section id="about" ref={ref} className="relative min-h-screen py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">About Me</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            My journey through data science, AI research, and creative technology.
          </p>
        </motion.div>

        <div className="relative mx-auto mt-20">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 h-full w-0.5 bg-border md:left-1/2 md:-ml-0.5"></div>

          {/* Timeline Items */}
          {timelineData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative mb-16 md:mb-8"
              onMouseEnter={() => setActiveItem(item.id)}
              onMouseLeave={() => setActiveItem(null)}
            >
              <div className={`flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                {/* Timeline Dot */}
                <div className="absolute left-4 top-5 h-4 w-4 rounded-full bg-primary md:left-1/2 md:-ml-2"></div>

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                  <div
                    className={`rounded-lg border bg-card p-6 shadow-sm transition-all duration-300 ${
                      activeItem === item.id ? "scale-105 border-primary" : ""
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {item.icon}
                      </div>
                      <span className="text-sm font-semibold text-primary">{item.year}</span>
                    </div>
                    <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})

AboutSection.displayName = "AboutSection"

export default AboutSection

