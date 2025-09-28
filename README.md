# 🚀 CareerView - AI-Powered Career Transition Platform

<div align="center">

![CareerView Logo](https://img.shields.io/badge/CareerView-AI%20Career%20Platform-blue?style=for-the-badge&logo=rocket)

**Transform your career with AI-powered insights, personalized matches, and intelligent guidance.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)](https://fastapi.tiangolo.com/)

</div>

## 🌟 Overview

CareerView is an innovative AI-powered platform that helps professionals discover their next career path through intelligent resume analysis, personalized career matching, and interactive AI personas. Built with cutting-edge technologies, it provides comprehensive career guidance tailored to your unique skills and aspirations.

## ✨ Key Features

### 🎯 **Intelligent Career Matching**
- **AI-Powered Analysis**: Advanced resume parsing using spaCy and NLP
- **Personalized Matches**: GPT-4 powered career recommendations
- **Skill Gap Analysis**: Identify missing skills for your target roles
- **Match Scoring**: Detailed compatibility scores for each career path

### 🤖 **Interactive AI Personas**
- **Future Self Chat**: Talk to AI personas representing your target careers
- **Voice Conversations**: Web-based voice chat using OpenAI's speech APIs
- **Personalized Guidance**: AI trained on your background and goals
- **Real-time Insights**: Get instant career advice and industry knowledge

### 📈 **Dynamic Career Paths**
- **Learning Roadmaps**: GPT-generated personalized learning paths
- **Skill Development**: Step-by-step skill acquisition plans
- **Progress Tracking**: Monitor your career transition journey
- **Resource Recommendations**: Curated learning materials and courses

### 💾 **Persistent Data Storage**
- **Azure Blob Storage**: Secure cloud storage for all user data
- **Career Matches**: Save and revisit your personalized matches
- **Learning Paths**: Access your customized roadmaps anytime
- **Chat History**: Preserve conversations with AI personas

## 🏗️ Architecture

### **Frontend (Next.js 14)**
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS with modern UI components
- **State Management**: React hooks and context
- **Voice Integration**: Web Speech API for voice interactions

### **Backend (FastAPI)**
- **API Framework**: FastAPI with async support
- **AI Integration**: OpenAI GPT-4 for intelligent analysis
- **Document Processing**: PyPDF2, python-docx for resume parsing
- **Storage**: Azure Blob Storage for persistent data

### **AI & ML Stack**
- **Language Processing**: spaCy for NLP and text analysis
- **Vector Search**: FAISS for semantic similarity matching
- **AI Models**: OpenAI GPT-4o for career matching and persona generation
- **Voice AI**: OpenAI Speech Recognition and Synthesis

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- Azure Storage Account (optional)
- OpenAI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/saswath-06/CareerView.git
   cd CareerView
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   ```bash
   # Backend (.env)
   OPENAI_API_KEY=your_openai_api_key_here
   AZURE_STORAGE_CONNECTION_STRING=your_azure_connection_string
   AZURE_STORAGE_ACCOUNT_NAME=your_storage_account_name
   ```

5. **Run the Application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   python main.py
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 📱 User Journey

### 1. **Upload Resume**
- Upload your resume (PDF/DOCX)
- AI analyzes your skills, experience, and background
- Get instant feedback on your profile

### 2. **Discover Matches**
- View personalized career recommendations
- See compatibility scores and skill gaps
- Explore detailed career descriptions

### 3. **Chat with AI Personas**
- Select a career path to explore
- Chat with an AI persona representing that role
- Get personalized advice and insights
- Use voice chat for natural conversations

### 4. **Follow Learning Paths**
- Access customized learning roadmaps
- Track your skill development progress
- Get recommended resources and courses

## 🔧 API Endpoints

### **Core Endpoints**
- `POST /upload-resume` - Upload and analyze resume
- `GET /career-matches/{user_id}` - Get personalized career matches
- `GET /career-path/{career_id}` - Get learning roadmap
- `POST /voice-chat/openai-chat/{persona_id}` - AI voice chat

### **AI Persona Endpoints**
- `GET /personas` - List available AI personas
- `POST /chat/{persona_id}` - Text chat with persona
- `POST /voice-chat/{persona_id}` - Voice chat with persona

## 🛠️ Development

### **Project Structure**
```
CareerView/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main application
│   ├── resume_parser.py    # Resume analysis
│   ├── gpt4_career_matcher.py # AI matching
│   ├── persona_chat.py     # AI personas
│   ├── azure_storage.py    # Data persistence
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Pages and routing
│   │   ├── components/    # React components
│   │   └── lib/          # Utilities
│   └── package.json      # Node dependencies
└── README.md             # This file
```

### **Key Technologies**
- **Backend**: FastAPI, OpenAI API, Azure Blob Storage, spaCy
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Web Speech API
- **AI/ML**: GPT-4, FAISS, sentence-transformers, NLP processing

## 🔒 Security & Privacy

- **Environment Variables**: All sensitive data stored in environment variables
- **Secure Storage**: Azure Blob Storage with proper access controls
- **API Security**: FastAPI with proper validation and error handling
- **No Hardcoded Secrets**: All API keys and credentials externalized

## 🚀 Deployment

### **Backend Deployment**
- Deploy to Azure App Service, AWS Lambda, or similar
- Configure environment variables
- Set up Azure Blob Storage connection

### **Frontend Deployment**
- Deploy to Vercel, Netlify, or similar
- Configure API endpoints
- Set up environment variables

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 and speech APIs
- **FastAPI** for the excellent web framework
- **Next.js** for the React framework
- **Azure** for cloud storage services
- **spaCy** for natural language processing

## 🌟 Star the Repository

If you find CareerView helpful, please give it a ⭐ on GitHub!

---
