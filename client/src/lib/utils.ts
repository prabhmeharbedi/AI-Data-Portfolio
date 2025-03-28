import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const userProfile = {
  name: "Prabhmehar Pal Singh Bedi",
  title: "Generative AI Engineer & ML Enthusiast",
  intro: "I develop advanced AI solutions with a focus on Retrieval-Augmented Generation (RAG) and practical machine learning applications. Specializing in LLMs, computer vision, and sentiment analysis.",
  email: "prabhmehar2509@gmail.com",
  location: "Bengaluru, India",
  availability: "Open to new opportunities",
  social: {
    github: "https://github.com/prabhmeharbedi",
    linkedin: "https://linkedin.com/in/prabhmeharbedi"
  }
};

export const timelineItems = [
  {
    year: "2025",
    title: "Generative AI Intern",
    organization: "TerraByte Technologies",
    description: "Implemented and customized LLMs through prompt engineering to build custom RAG code generation systems. Developed advanced RAG pipelines using LangChain with ChromaDB and Cohere embeddings. Designed evaluation framework using RAGAS to measure context relevance, answer faithfulness, and semantic similarity.",
    skills: ["LLMs", "RAG", "LangChain", "RAGAS", "Prompt Engineering"]
  },
  {
    year: "2023",
    title: "Finance Secretary",
    organization: "Environment Conservation Club",
    description: "Directed allocation of funds for club activities, ensuring optimal resource use for 200+ members. Organized society fair showcasing past projects and led development of six projects involving 50+ students. Enhanced financial acumen and effective collaboration with senior stakeholders.",
    skills: ["Leadership", "Financial Management", "Project Coordination", "Team Collaboration"]
  },
  {
    year: "2021",
    title: "Bachelor of Engineering",
    organization: "Thapar Institute of Engineering and Technology",
    description: "Pursuing Bachelor of Engineering in Electronics and Computer with Minor in Conversational AI by NVIDIA. Developing strong foundation in machine learning, computer science, and artificial intelligence applications.",
    skills: ["Machine Learning", "Conversational AI", "Deep Learning", "Python"]
  }
];

export const projects = [
  {
    id: 1,
    title: "Fracture Detection System",
    description: "A medical image analysis system using CNNs to detect bone fractures in X-ray images with 90% accuracy. Implemented with a web interface for seamless interaction.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Computer Vision",
    technologies: ["Keras", "TensorFlow", "OpenCV", "Python"],
    githubUrl: "https://github.com/prabhmeharbedi/fracture-detection",
    liveUrl: "https://fracture-detection-1.onrender.com/",
    details: {
      overview: "The Fracture Detection System is an advanced medical imaging tool that automatically identifies and highlights bone fractures in X-ray images. Designed to assist radiologists and emergency room physicians, it provides rapid preliminary analysis of X-ray images to help prioritize cases and reduce diagnostic errors.",
      technical: "Built using Convolutional Neural Networks (CNNs) with TensorFlow and Keras. The model was trained on a large dataset of annotated X-ray images with various fracture types. Data augmentation techniques were employed to improve model generalization across different imaging conditions.",
      codeSnippet: `# CNN Model Architecture for Fracture Detection
def create_fracture_detection_model(input_shape=(299, 299, 3)):
    base_model = applications.InceptionV3(
        weights='imagenet', 
        include_top=False, 
        input_shape=input_shape
    )
    
    # Fine-tuning the model
    for layer in base_model.layers:
        layer.trainable = False
    
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(1024, activation='relu')(x)
    x = Dropout(0.5)(x)
    x = Dense(512, activation='relu')(x)
    predictions = Dense(1, activation='sigmoid')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    return model`,
      impact: "The Fracture Detection System achieved 90% accuracy in clinical validation tests, significantly reducing the time required for preliminary diagnosis. The web interface allows medical professionals to upload X-ray images and receive instant analysis, helping to prioritize urgent cases in busy medical environments."
    }
  },
  {
    id: 2,
    title: "Helmet Rule Violation Detection",
    description: "Real-time motorcyclist helmet rule violation detection system using YOLO v8 with 86.8% accuracy. Integrated with Jetson Nano for edge computing applications.",
    image: "https://images.unsplash.com/photo-1556610961-2fecc5927173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    category: "Computer Vision",
    technologies: ["YOLO v8", "Jetson Nano", "ResNet50", "VGG19"],
    githubUrl: null,
    liveUrl: null,
    details: {
      overview: "The Helmet Rule Violation Detection system is a real-time monitoring solution designed to automatically identify motorcyclists who are not wearing helmets. This system helps traffic authorities enforce safety regulations more effectively, potentially reducing head injuries and fatalities in motorcycle accidents.",
      technical: "The system uses YOLO v8 for object detection, trained on a custom dataset of motorcyclists with and without helmets. The model was optimized for deployment on Jetson Nano for edge computing capabilities, allowing real-time processing without requiring cloud connectivity. Comparative analysis was performed with ResNet50 and VGG19 architectures to identify the most effective approach.",
      codeSnippet: `# YOLO v8 inference on Jetson Nano
from ultralytics import YOLO

# Load the trained YOLO model
model = YOLO('helmet_detection_model.pt')

# Process video stream
def process_stream(video_source=0):
    cap = cv2.VideoCapture(video_source)
    while cap.isOpened():
        success, frame = cap.read()
        if success:
            # Run YOLOv8 inference on the frame
            results = model(frame)
            
            # Process detections
            for result in results:
                boxes = result.boxes.cpu().numpy()
                for box in boxes:
                    # Process detected violations
                    if box.cls == 1:  # No helmet class
                        x1, y1, x2, y2 = box.xyxy[0].astype(int)
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                        cv2.putText(frame, "VIOLATION: No Helmet", 
                                   (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 
                                   0.5, (0, 0, 255), 2)
            
            # Display the frame
            cv2.imshow("Helmet Detection", frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        else:
            break
    
    cap.release()
    cv2.destroyAllWindows()`,
      impact: "The system achieved 86.8% accuracy in field tests, successfully identifying helmet violations in varying lighting and weather conditions. Integration with Jetson Nano allows for affordable deployment at traffic intersections, providing authorities with an efficient tool for enhancing road safety."
    }
  },
  {
    id: 3,
    title: "Article Sentiment Analysis",
    description: "A sentiment analysis system that extracts emotional tones from articles with 86% accuracy. Features a Tableau dashboard for visualizing sentiment patterns across publications.",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "NLP",
    technologies: ["Python", "NLTK", "BeautifulSoup", "Tableau"],
    githubUrl: "https://github.com/prabhmeharbedi/Article-Sentiment-Analysis",
    liveUrl: null,
    details: {
      overview: "The Article Sentiment Analysis tool performs emotional tone analysis on news articles and blog posts, helping content creators, marketers, and researchers understand the sentiment patterns in online publications. The system scrapes content from various sources, analyzes the emotional tone, and presents insights through an interactive Tableau dashboard.",
      technical: "The project utilizes web scraping with Python (requests, BeautifulSoup) for data collection from diverse online sources. Natural Language Processing techniques are applied using NLTK, including tokenization, stopword removal, and sentiment classification. The data is then visualized through a custom Tableau dashboard for trend analysis.",
      codeSnippet: `# Web scraping and sentiment analysis pipeline
import requests
from bs4 import BeautifulSoup
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import pandas as pd

# Initialize sentiment analyzer
nltk.download('vader_lexicon')
sia = SentimentIntensityAnalyzer()

# Scrape article content
def scrape_article(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract title and content (site-specific selectors)
    title = soup.select_one('h1.article-title').text.strip()
    content_elements = soup.select('div.article-content p')
    content = ' '.join([p.text for p in content_elements])
    
    return {
        'url': url,
        'title': title,
        'content': content
    }

# Analyze sentiment
def analyze_article_sentiment(article):
    # Get sentiment scores for title and content
    title_sentiment = sia.polarity_scores(article['title'])
    content_sentiment = sia.polarity_scores(article['content'])
    
    # Combine scores (weighted average)
    compound_score = title_sentiment['compound'] * 0.3 + content_sentiment['compound'] * 0.7
    
    # Classify sentiment
    if compound_score >= 0.05:
        sentiment = 'positive'
    elif compound_score <= -0.05:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
    
    return {
        'url': article['url'],
        'title': article['title'],
        'sentiment': sentiment,
        'compound_score': compound_score
    }`,
      impact: "The project achieved 86% accuracy in sentiment classification across various news domains and blog categories. The interactive visualization dashboard has been used to track sentiment trends in media coverage of specific topics, providing valuable insights for content strategy and public relations professionals."
    }
  }
];

export const aiTools = [
  {
    id: 1,
    title: "RAG Code Generation System",
    description: "A custom RAG system that enables highly accurate code generation by retrieving relevant code patterns and documentation from a specialized vector database.",
    category: "LLMs + Information Retrieval",
    technologies: ["LangChain", "ChromaDB", "Cohere Embeddings", "LLMs"],
    docUrl: "#",
    details: "The RAG Code Generation System uses a retrieval-augmented generation approach to produce accurate and context-aware code snippets across multiple programming languages. The system maintains a vector database of code examples, documentation, and best practices, which is queried during generation to provide relevant context to the LLM. This dramatically improves output quality compared to traditional prompt-based code generation."
  },
  {
    id: 2,
    title: "RAGAS Evaluation Framework",
    description: "A comprehensive evaluation framework for measuring context relevance, answer faithfulness, and semantic similarity in RAG systems.",
    category: "AI Evaluation",
    technologies: ["RAGAS", "LangChain", "Python", "Hugging Face"],
    docUrl: "#",
    details: "The RAGAS Evaluation Framework provides a systematic approach to measuring the performance of Retrieval-Augmented Generation systems. Unlike traditional metrics that focus solely on output quality, this framework evaluates the entire RAG pipeline, measuring how effectively the system retrieves relevant context, how faithfully it uses that context in its answers, and the semantic similarity between generated responses and ground truth. This multi-dimensional evaluation enables data-driven optimization of RAG components."
  },
  {
    id: 3,
    title: "AI Memory System",
    description: "A dual short-term and long-term memory system for AI chat applications that enhances context retention across conversations.",
    category: "Conversational AI",
    technologies: ["Vector Databases", "LLMs", "Prompt Engineering", "Python"],
    docUrl: "#",
    details: "The AI Memory System implements both short-term and long-term memory capabilities for conversational AI applications. Short-term memory maintains context within individual sessions, while long-term memory stores important information across multiple interactions. The system uses semantic search to retrieve relevant past conversations, summarization techniques to distill key information, and specialized prompt engineering to incorporate this context naturally into new responses."
  }
];

export const skills = {
  languages: ["Python", "SQL", "C/C++"],
  "ML / AI": ["NLP", "RAG", "Deep Learning", "Prompt Engineering", "Vector Databases", "Computer Vision"],
  frameworks: ["PyTorch", "TensorFlow", "Keras", "LangChain", "Hugging Face", "scikit-learn"],
  tools: ["Git", "VS Code", "Jupyter", "SQL Workbench", "Tableau", "MS Excel"]
};
