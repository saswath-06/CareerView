# CareerView MVP - Hackathon Specification

## 🎯 Project Overview
CareerView is a career transition platform that analyzes resumes, matches users to potential career paths, and provides AI-powered persona interactions for career exploration.

## 🏗️ Architecture

### Frontend (Next.js + TailwindCSS)
- **Landing Page**: Resume upload interface
- **Dashboard**: Career matches display with match percentages and salary data
- **Chat Interface**: AI persona interactions
- **Career Path View**: Step-by-step transition guidance

### Backend (FastAPI + Python)
- **Resume Parsing Service**: Extract skills, experience, and roles
- **Career Matching Engine**: Vector-based job matching using O*NET taxonomy
- **AI Persona Generator**: GPT-4/Claude integration for role-specific conversations
- **Economic Data Service**: Salary and growth projections

### Data Layer
- **File Storage**: Resume storage (local for MVP, S3 for production)
- **Vector Database**: Skill embeddings (Pinecone/local vector store)
- **Job Taxonomy**: O*NET occupation data
- **Economic Data**: BLS/StatCan salary datasets

## 🎯 MVP Features (24-36 hours)

### Core Features ✅ COMPLETED
1. **Resume Upload & Parsing**
   - ✅ PDF/DOCX support
   - ✅ Extract skills, job titles, experience
   - ✅ Store parsed data

2. **Career Matching**
   - ✅ Top 5 career path recommendations
   - ✅ Match percentage calculation
   - ✅ Skills gap analysis (matched vs missing skills)

3. **Career Dashboard**
   - ✅ Display matched careers with percentages
   - ✅ Show salary ranges and growth outlook
   - ✅ Skills breakdown (matched/missing)

### Enhanced Features 🚀 NEW REQUIREMENTS
4. **OAuth Authentication System**
   - User registration and login
   - Google/GitHub/LinkedIn OAuth integration
   - User profile management
   - Session management

5. **Voice AI Integration (VAPI)**
   - Voice communication with job personas
   - Real-time speech-to-text
   - Natural conversation flow
   - Voice synthesis for persona responses

6. **AI Persona Chat (Enhanced)**
   - Role-specific AI personas (PM, Data Analyst, UX Designer, etc.)
   - Interactive Q&A about career paths
   - Day-in-the-life insights
   - **NEW**: Voice conversation capability

7. **Economic Insights**
   - Salary projections
   - Job market demand data
   - Growth outlook

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS
- **UI Components**: Headless UI / shadcn/ui
- **File Upload**: react-dropzone
- **State Management**: React hooks + Context API
- **Deployment**: Vercel

### Backend
- **Framework**: FastAPI
- **Resume Parsing**: PyPDF2, python-docx, spaCy
- **AI Integration**: OpenAI GPT-4 API
- **Vector Operations**: sentence-transformers, numpy
- **Data Processing**: pandas, numpy
- **Background Tasks**: asyncio (Celery for production)
- **Deployment**: Render/Railway

### Data & ML
- **Text Processing**: spaCy (en_core_web_sm)
- **Embeddings**: OpenAI text-embedding-ada-002
- **Vector Search**: FAISS (local) or Pinecone (production)
- **Job Data**: O*NET Interest Profiler taxonomy
- **Economic Data**: Bureau of Labor Statistics (BLS) API

## 📊 Data Sources

### O*NET Database
- 900+ occupation profiles
- Required skills and knowledge areas
- Work activities and context
- Education and training requirements

### Economic Data
- BLS Occupational Employment Statistics
- Salary ranges by occupation and location
- Job growth projections
- Industry demand trends

## 🔄 User Flow

```
Landing Page → Upload Resume → Processing → Career Dashboard → Persona Chat
     ↑                                           ↓
     └─────────── Career Path Details ←─────────┘
```

### Detailed Flow
1. **Landing**: User uploads PDF/DOCX resume
2. **Processing**: Backend extracts skills, experience, job titles
3. **Matching**: Vector similarity against O*NET job profiles
4. **Dashboard**: Display top 5 matches with:
   - Match percentage
   - Salary range
   - Required vs. current skills
   - Growth outlook
5. **Interaction**: 
   - Chat with AI personas for each role
   - View detailed career transition paths
   - Get specific advice and next steps

## 📋 Development Phases

### Phase 1: Foundation (Hours 1-8)
- [x] Project setup and structure
- [x] Basic FastAPI backend with health check
- [x] Next.js frontend with landing page
- [x] Resume upload functionality
- [x] Basic file processing pipeline

### Phase 2: Core Engine (Hours 9-16)
- [ ] Resume parsing (PDF/DOCX → structured data)
- [ ] O*NET data integration
- [ ] Vector embedding generation
- [ ] Career matching algorithm
- [ ] Basic dashboard UI

### Phase 3: AI Integration (Hours 17-24)
- [ ] OpenAI API integration
- [ ] Persona generation system
- [ ] Chat interface implementation
- [ ] Economic data integration

### Phase 4: Polish & Deploy (Hours 25-36)
- [ ] UI/UX improvements
- [ ] Error handling and validation
- [ ] Performance optimization
- [ ] Deployment setup
- [ ] Demo preparation

## 🚀 Quick Start Commands

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:3000
```

### Full Stack Development
```bash
# Terminal 1: Backend
cd backend && uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend && npm run dev
```

## 🎯 Success Metrics

### Technical
- [ ] Resume upload and parsing works for PDF/DOCX
- [ ] Career matching returns relevant results (>70% accuracy)
- [ ] AI personas provide coherent, role-specific responses
- [ ] Full user flow works end-to-end
- [ ] Application loads in <3 seconds

### Demo
- [ ] Live resume upload demonstration
- [ ] Real-time career matching display
- [ ] Interactive persona chat
- [ ] Economic insights visualization
- [ ] Smooth, professional presentation

## 🔧 Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_key  # Optional
PINECONE_ENVIRONMENT=your_env       # Optional
BLS_API_KEY=your_bls_key           # Optional
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📝 API Endpoints

### Core Endpoints
- `POST /upload-resume` - Upload and parse resume
- `GET /career-matches/{user_id}` - Get career recommendations
- `POST /chat-persona` - Interact with AI personas
- `GET /economic-data/{occupation}` - Get salary and growth data
- `GET /health` - Health check

## 🎨 UI Components

### Key Components
- **FileUpload**: Drag-and-drop resume upload
- **CareerCard**: Individual career match display
- **ChatInterface**: AI persona conversation
- **SkillsBreakdown**: Matched vs missing skills
- **SalaryChart**: Economic data visualization
- **LoadingStates**: Processing indicators

## 🚨 Known Limitations (MVP)

1. **Local Storage**: Files stored locally (not S3)
2. **Simple Vector Search**: FAISS instead of Pinecone
3. **Limited Personas**: 5-10 predefined role types
4. **Static Economic Data**: Preloaded datasets vs. live APIs
5. **Basic Error Handling**: Minimal validation and error recovery
6. **No User Authentication**: Single-session usage

## 🎯 Post-Hackathon Roadmap

### Immediate (Week 1-2)
- User authentication and profiles
- Cloud storage integration
- Enhanced error handling
- More persona types

### Medium-term (Month 1-3)
- LinkedIn integration
- Advanced skill extraction
- Personalized learning paths
- Mobile responsiveness

### Long-term (3+ months)
- Industry-specific matching
- Networking recommendations
- Progress tracking
- Enterprise features

---

**Last Updated**: September 26, 2025
**Target Completion**: 24-36 hours
**Demo Ready**: All core features functional with smooth user flow
