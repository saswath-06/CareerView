# CareerView MVP 🎯

A hackathon MVP for career transition platform that analyzes resumes, matches users to potential career paths, and provides AI-powered persona interactions.

## 🚀 Quick Start

### Option 1: Automatic Startup (Recommended)
```bash
python start_dev.py
```

### Option 2: Manual Startup
```bash
# Terminal 1: Backend
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000

# Terminal 2: Frontend  
cd frontend
npm run dev
```

### Option 3: Test Everything
```bash
python test_app.py
```

## 📍 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🎯 Current Features (Working)

✅ **Resume Upload**
- Drag & drop PDF/DOCX files
- File validation and size limits
- Connected to backend API

✅ **Backend API**
- FastAPI with CORS enabled
- Resume upload endpoint
- Mock career matching data
- Health check endpoints

✅ **Frontend UI**
- Modern React/Next.js interface
- Tailwind CSS styling
- Responsive design
- File upload with progress

## 🔄 Demo Flow

1. **Visit** http://localhost:3000
2. **Upload** a PDF or DOCX resume
3. **See** mock parsing results (skills extraction)
4. **Next**: Career matching dashboard (coming next)

## 🏗️ MVP Progress

| Feature | Status | Description |
|---------|--------|-------------|
| Project Setup | ✅ Complete | Directory structure, configs |
| Backend API | ✅ Complete | FastAPI with upload endpoint |
| Frontend UI | ✅ Complete | Next.js with Tailwind |
| Resume Upload | ✅ Complete | File upload with validation |
| Resume Parsing | 🔄 Mock Data | spaCy + PyPDF2 integration next |
| Career Matching | ⏳ Pending | Vector embeddings + O*NET |
| Dashboard UI | ⏳ Pending | Career matches display |
| AI Personas | ⏳ Pending | GPT-4 chat integration |
| Deployment | ⏳ Pending | Vercel + Render setup |

## 🛠️ Tech Stack

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (icons)

**Backend**
- FastAPI (Python)
- Uvicorn (ASGI server)
- File upload handling
- CORS middleware

**Planned Integrations**
- spaCy (NLP)
- PyPDF2 (PDF parsing)
- OpenAI GPT-4 (AI personas)
- O*NET API (job data)

## 📋 Next Development Steps

1. **Resume Parsing Engine** (2-3 hours)
   - Install spaCy + PyPDF2
   - Extract skills, experience, job titles
   - Replace mock data with real parsing

2. **Career Matching System** (3-4 hours)
   - O*NET job taxonomy integration
   - Vector embeddings for skills
   - Similarity matching algorithm

3. **Dashboard UI** (2-3 hours)
   - Career matches display
   - Skills breakdown visualization
   - Salary and growth data

4. **AI Persona Chat** (3-4 hours)
   - OpenAI API integration
   - Role-specific personas
   - Chat interface

## 🎯 Hackathon Demo Script

1. **Show landing page** - Clean, professional UI
2. **Upload resume** - Drag & drop functionality
3. **Display parsing** - Skills and experience extraction
4. **Career matches** - Top 5 recommendations with %
5. **Chat with persona** - AI Product Manager conversation
6. **Salary insights** - Economic data visualization

## 🔧 Development Commands

```bash
# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd frontend
npm install

# Run tests
python test_app.py

# Check API docs
# Visit http://localhost:8000/docs
```

## 📁 Project Structure

```
CareerSim/
├── backend/           # FastAPI backend
│   ├── main.py       # API endpoints
│   ├── requirements.txt
│   └── uploads/      # Resume storage
├── frontend/         # Next.js frontend
│   ├── src/app/      # App router pages
│   ├── package.json
│   └── tailwind.config.js
├── data/            # O*NET and salary data
├── spec.md          # Detailed specification
├── start_dev.py     # Development server
└── test_app.py      # System tests
```

## 🎉 Success Metrics

- [x] Resume upload works end-to-end
- [x] Frontend/backend integration
- [x] Professional UI/UX
- [ ] Real resume parsing
- [ ] Career matching accuracy >70%
- [ ] AI personas respond coherently
- [ ] Full demo flow <3 minutes

---

**Built for Hackathon** | **Target: 24-36 hours** | **Status: Foundation Complete** ✅
