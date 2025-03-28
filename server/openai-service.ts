import OpenAI from "openai";
import 'dotenv/config';

// Initialize OpenAI API client
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

// Portfolio context for AI responses - focusing only on resume data
const portfolioContext = `
You are an AI assistant for a Generative AI and Machine Learning portfolio website. Your ONLY purpose is to answer questions 
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

/**
 * Get AI response from OpenAI API
 * @param userMessage The message from the user
 * @returns AI-generated response
 */
export async function getAIResponse(userMessage: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: portfolioContext },
        { role: "user", content: userMessage }
      ],
    });

    return completion.choices[0].message.content || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}

/**
 * Get AI analysis of user-uploaded content (for future functionality)
 * @param content The content to analyze
 * @param prompt Specific analysis instructions
 * @returns AI analysis
 */
export async function getContentAnalysis(content: string, prompt: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are an AI assistant that analyzes data or content provided by users and gives professional insights."
        },
        { 
          role: "user", 
          content: `${prompt}\n\nContent for analysis:\n${content}`
        }
      ],
    });

    return completion.choices[0].message.content || "Analysis could not be completed.";
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    throw error;
  }
}