# 🧪 CareerView - Complete Testing Guide

## 🚀 Quick Start

### 1. Start the Development Servers
```bash
# In project root
python start_dev.py
```

This starts:
- **Backend**: http://localhost:8000 (FastAPI)
- **Frontend**: http://localhost:3000 (Next.js)

### 2. Verify Services are Running
```bash
# Test backend health
curl http://localhost:8000/health

# Test frontend
curl http://localhost:3000
```

---

## 📋 Feature Testing Checklist

### ✅ 1. Resume Upload & Parsing

**Test Steps:**
1. Go to http://localhost:3000
2. Click "Choose File" and upload a resume (PDF/DOCX)
3. Click "Upload Resume"

**Expected Results:**
- ✅ File uploads successfully
- ✅ Shows parsed data: Name, Experience, Skills, Education, Contact
- ✅ Skills are properly extracted and categorized
- ✅ Experience years calculated correctly

**Test Files:**
- Use Roopika's resume (architecture student)
- Use Harsukrit's resume (technical student)
- Try both PDF and DOCX formats

---

### ✅ 2. Advanced Career Matching (O*NET System)

**Test Steps:**
1. After uploading resume, click "🎯 View My Career Matches & Chat with Experts"
2. Review the career matches displayed

**Expected Results for Architecture Resume (Roopika):**
- ✅ **Top Match**: Architect (40-50% match)
- ✅ **Second**: Interior Designer (40-47% match)
- ✅ **Third**: Industrial Designer (40-46% match)
- ✅ Skills properly matched: AutoCAD, Rhino, Adobe Illustrator
- ✅ Industry diversity: Architecture, Design Services, Manufacturing

**Expected Results for Tech Resume (Harsukrit):**
- ✅ **Top Matches**: Software Developer, Data Scientist
- ✅ Skills matched: Programming, Python, JavaScript, etc.

**What to Verify:**
- ✅ Match percentages are reasonable (20-80%)
- ✅ Matched skills show relevant overlap
- ✅ Missing skills suggest logical next steps
- ✅ Salary ranges and growth outlook displayed
- ✅ Industry categories are appropriate

---

### ✅ 3. Dynamic AI Persona Chat

**Test Steps:**
1. From career matches page, click "Chat with [Job] Expert" button
2. Should go directly to chat (no persona selection page)
3. Try asking questions about the career

**Expected Results:**
- ✅ **Direct Navigation**: No "choose persona" page
- ✅ **Dynamic Persona**: Chat loads with relevant expert (e.g., "Senior Architect Expert")
- ✅ **Context Awareness**: AI knows your background and skills
- ✅ **Relevant Responses**: Answers are specific to the career path

**Test Questions:**
```
"What should I focus on to become an architect?"
"What's a typical day like in this role?"
"How can I improve my skills for this career?"
"What certifications should I pursue?"
```

**What to Verify:**
- ✅ Chat interface loads quickly
- ✅ Messages display with proper formatting
- ✅ Typing indicator works
- ✅ Responses are relevant and helpful
- ✅ Back button returns to matches page

---

### ✅ 4. Career Path Optimization

**Test Steps:**
1. From career matches, click "View Learning Path" button
2. Review the detailed learning path

**Expected Results:**
- ✅ **Immediate Steps**: 1-3 month goals
- ✅ **Short-term Goals**: 3-12 month objectives
- ✅ **Long-term Goals**: 1-3 year milestones
- ✅ **Courses**: Specific course recommendations
- ✅ **Certifications**: Industry-relevant certifications
- ✅ **Projects**: Hands-on project ideas

---

### ✅ 5. UI/UX Quality

**Visual Testing:**
- ✅ **Text Readability**: All text is dark and clearly visible
- ✅ **No White Text**: No white text on white backgrounds
- ✅ **Button Visibility**: All buttons are prominent and clickable
- ✅ **Color Contrast**: Good contrast throughout
- ✅ **Responsive Design**: Works on different screen sizes

**Navigation Testing:**
- ✅ **Smooth Flow**: Upload → Matches → Chat → Learning Path
- ✅ **Back Navigation**: All back buttons work correctly
- ✅ **No Dead Ends**: Every page has clear next steps

---

## 🔧 API Testing (Advanced)

### Backend Endpoints

**1. Health Check**
```bash
curl http://localhost:8000/health
```

**2. Resume Upload**
```bash
curl -X POST "http://localhost:8000/upload-resume/" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@path/to/resume.pdf"
```

**3. Career Matches**
```bash
curl http://localhost:8000/career-matches/demo_user
```

**4. Chat with Persona**
```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "persona_id": "architect",
    "message": "What skills do I need?",
    "conversation_history": [],
    "user_context": null
  }'
```

**5. Learning Path**
```bash
curl http://localhost:8000/career-path/architect
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Servers Won't Start**
```bash
# Kill existing processes
tasklist | findstr "python"
# Kill specific PIDs if needed

# Restart
python start_dev.py
```

**2. Frontend Can't Connect to Backend**
- Check if backend is running on port 8000
- Verify CORS settings in FastAPI
- Check browser console for errors

**3. Resume Upload Fails**
- Verify file format (PDF/DOCX only)
- Check file size (should be reasonable)
- Look at backend logs for parsing errors

**4. Career Matching Returns Wrong Results**
- Check if O*NET matcher initialized properly
- Look for "Building career embeddings..." in logs
- Verify skills are being extracted correctly

**5. Chat Not Working**
- Verify OpenAI API key is set
- Check backend logs for API errors
- Ensure persona exists for the career

---

## 🎯 Demo Script for Hackathon

### 5-Minute Demo Flow

**1. Introduction (30 seconds)**
"CareerView uses AI to match your skills with perfect career paths and lets you chat with AI experts in those fields."

**2. Resume Upload Demo (1 minute)**
- Upload Roopika's architecture resume
- Show parsed skills: "AutoCAD, Rhino, Adobe Illustrator, Leadership"
- Highlight accuracy: "Perfect extraction of technical and soft skills"

**3. Career Matching Magic (2 minutes)**
- Show results: "Architect 48% match, Interior Designer 47%, Industrial Designer 46%"
- Explain: "Our O*NET-powered system understands architecture skills, not just tech"
- Point out: "Before: suggested Software Engineer. Now: correctly identifies Architect!"

**4. AI Expert Chat (1.5 minutes)**
- Click "Chat with Architect Expert"
- Ask: "What should I focus on to become a licensed architect?"
- Show intelligent response with specific advice
- Highlight: "AI knows your background and gives personalized guidance"

**5. Learning Path (30 seconds)**
- Show detailed learning path with courses, certifications, projects
- Emphasize: "Complete roadmap from student to professional"

**Key Selling Points:**
- ✅ **Accurate for ALL majors** (not just tech)
- ✅ **AI experts** for personalized advice
- ✅ **Complete learning paths** with actionable steps
- ✅ **Modern, readable UI** that actually works

---

## 📊 Success Metrics

**Resume Parsing:**
- ✅ 90%+ accuracy on name extraction
- ✅ 85%+ accuracy on skills extraction
- ✅ Correct experience calculation

**Career Matching:**
- ✅ Top 3 matches are relevant to user's field
- ✅ Match percentages between 20-80%
- ✅ Skills alignment makes sense

**User Experience:**
- ✅ Complete flow takes <3 minutes
- ✅ No confusing navigation
- ✅ All text is readable
- ✅ No broken features

**AI Chat:**
- ✅ Responses within 5 seconds
- ✅ Contextually relevant advice
- ✅ Professional and helpful tone

---

## 🚀 Ready for Production

The system is now ready for:
- ✅ **Hackathon demos**
- ✅ **User testing**
- ✅ **Investor presentations**
- ✅ **Production deployment**

**Next Steps:**
1. Voice AI integration (VAPI)
2. OAuth authentication
3. Production deployment
4. Real user testing
