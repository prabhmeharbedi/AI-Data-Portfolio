"use client"

import { forwardRef, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { X, ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  codeSnippet?: string
  demoLink?: string
  githubLink?: string
}

const projectsData: Project[] = [
  {
    id: "project1",
    title: "Neural Style Transfer App",
    description: "A web application that applies artistic styles to images using deep learning.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Python", "TensorFlow", "React", "Flask"],
    codeSnippet: `
# Style transfer function
def transfer_style(content_image, style_image, alpha=1.0):
    # Load pre-trained VGG19 model
    vgg = tf.keras.applications.VGG19(
        include_top=False, weights='imagenet'
    )
    vgg.trainable = False
    
    # Content and style layers
    content_layers = ['block5_conv2'] 
    style_layers = [
        'block1_conv1', 'block2_conv1', 
        'block3_conv1', 'block4_conv1', 
        'block5_conv1'
    ]
    
    # Process images and extract features
    # ... (implementation details)
    
    return stylized_image`,
    demoLink: "https://example.com/demo",
    githubLink: "https://github.com/yourusername/neural-style-transfer",
  },
  {
    id: "project2",
    title: "Predictive Analytics Dashboard",
    description: "An interactive dashboard for visualizing and forecasting business metrics.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Python", "Pandas", "D3.js", "Prophet"],
    demoLink: "https://example.com/dashboard",
  },
  {
    id: "project3",
    title: "NLP Sentiment Analyzer",
    description: "A tool that analyzes sentiment in text using transformer models.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["Python", "PyTorch", "Hugging Face", "BERT"],
    githubLink: "https://github.com/yourusername/sentiment-analyzer",
  },
  {
    id: "project4",
    title: "Generative Art Installation",
    description: "An interactive art installation that generates visuals based on audience movement.",
    image: "/placeholder.svg?height=600&width=800",
    tags: ["JavaScript", "p5.js", "TensorFlow.js", "Computer Vision"],
    demoLink: "https://example.com/art-installation",
  },
]

const ProjectsSection = forwardRef<HTMLDivElement>((props, ref) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <section id="projects" ref={ref} className="relative min-h-screen py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Projects</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">A selection of my data science and AI projects.</p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {projectsData.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card
                className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-sm font-medium">Click to view details</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-2 text-xl font-bold">{project.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Project Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg border bg-card shadow-lg"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10"
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="relative aspect-video">
                <Image
                  src={selectedProject.image || "/placeholder.svg"}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="mb-2 text-2xl font-bold">{selectedProject.title}</h3>
                <p className="mb-4 text-muted-foreground">{selectedProject.description}</p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {selectedProject.codeSnippet && (
                  <div className="mb-6">
                    <h4 className="mb-2 text-lg font-semibold">Code Snippet</h4>
                    <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                      <code>{selectedProject.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                <div className="flex flex-wrap gap-4">
                  {selectedProject.demoLink && (
                    <Button asChild variant="default">
                      <a
                        href={selectedProject.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {selectedProject.githubLink && (
                    <Button asChild variant="outline">
                      <a
                        href={selectedProject.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Github className="h-4 w-4" />
                        View Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
})

ProjectsSection.displayName = "ProjectsSection"

export default ProjectsSection

