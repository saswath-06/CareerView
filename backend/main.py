from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Removed PhoneCallRequest - no longer needed without VAPI
import uvicorn
from datetime import datetime
import os
import shutil
from pathlib import Path
from resume_parser import resume_parser
from persona_chat import PersonaChat
from gpt4_career_matcher import gpt4_career_matcher
from career_path_optimizer import career_path_optimizer
from azure_storage import azure_storage
# Removed VAPI voice chat - using OpenAI voice instead
from typing import List, Dict, Optional
import asyncio
from contextlib import asynccontextmanager

# Initialize persona chat with OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Global variables for services
persona_chat = None

# Simple in-memory cache for career matches
career_matches_cache = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan with proper startup and shutdown"""
    global persona_chat
    
    # Startup
    try:
        print("🚀 Starting CareerView API...")
        persona_chat = PersonaChat(openai_api_key=OPENAI_API_KEY)
        print("✅ All services initialized successfully!")
        yield
    except asyncio.CancelledError:
        print("⚠️ Startup cancelled, cleaning up...")
        raise
    except Exception as e:
        print(f"❌ Error during startup: {e}")
        raise
    finally:
        # Shutdown
        try:
            print("🛑 Shutting down CareerView API...")
            # Clean up any resources here if needed
            print("✅ Shutdown complete!")
        except asyncio.CancelledError:
            print("⚠️ Shutdown cancelled")
        except Exception as e:
            print(f"❌ Error during shutdown: {e}")

# Pydantic models for request/response
class ChatMessage(BaseModel):
    persona_id: str
    message: str
    conversation_history: Optional[List[Dict]] = []
    user_context: Optional[Dict] = None

class ChatResponse(BaseModel):
    persona_id: str
    persona_name: str
    response: str
    timestamp: str
    conversation_id: str

# Initialize FastAPI app with lifespan management
app = FastAPI(
    title="CareerView API",
    description="Career matching and persona chat API for hackathon MVP",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "CareerView API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "health": "/health",
            "upload": "/upload-resume",
            "matches": "/career-matches/{user_id}",
            "chat": "/chat-persona",
            "economic": "/economic-data/{occupation}"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "CareerView API",
        "version": "1.0.0"
    }

@app.get("/performance")
async def performance_check():
    """Performance check endpoint"""
    import time
    
    # Test Azure connection
    start_time = time.time()
    try:
        # Test if Azure is available
        azure_available = azure_storage.client is not None
        azure_time = time.time() - start_time
    except:
        azure_available = False
        azure_time = 0
    
    return {
        "azure_available": azure_available,
        "azure_response_time": f"{azure_time:.3f}s",
        "cache_size": len(getattr(azure_storage, '_azure_cache', {})),
        "timestamp": datetime.now().isoformat()
    }

@app.post("/clear-cache")
async def clear_career_matches_cache():
    """Clear the career matches cache (for testing)"""
    global career_matches_cache
    career_matches_cache.clear()
    return {
        "message": "Career matches cache cleared",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/clear-all-azure-data")
async def clear_all_azure_data():
    """Clear all Azure storage data (matches, paths, personas)"""
    try:
        deleted_counts = azure_storage.clear_all_data()
        return {
            "message": "All Azure storage data cleared successfully",
            "deleted_counts": deleted_counts,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing Azure data: {str(e)}")

@app.get("/debug-resume")
async def debug_current_resume():
    """Debug endpoint to see what resume is currently being analyzed"""
    try:
        upload_dir = Path("uploads")
        if not upload_dir.exists():
            return {"error": "No uploads directory found"}
        
        files = list(upload_dir.glob("*.pdf")) + list(upload_dir.glob("*.docx"))
        if not files:
            return {"error": "No resume files found"}
        
        latest_file = max(files, key=os.path.getctime)
        parsed_resume = resume_parser.parse_resume(latest_file)
        
        return {
            "filename": latest_file.name,
            "parsed_data": parsed_resume,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/test-connection")
async def test_connection():
    """Test endpoint to verify backend is working"""
    return {
        "message": "Backend connection successful!",
        "timestamp": datetime.now().isoformat(),
        "ready_for": ["resume_upload", "career_matching", "persona_chat"]
    }

@app.get("/debug-last-resume")
async def debug_last_resume():
    """Debug endpoint to see the last uploaded resume's raw text"""
    import os
    upload_dir = Path("uploads")
    
    if not upload_dir.exists():
        return {"error": "No uploads directory found"}
    
    # Get the most recent file
    files = list(upload_dir.glob("*.pdf")) + list(upload_dir.glob("*.docx"))
    if not files:
        return {"error": "No resume files found"}
    
    latest_file = max(files, key=os.path.getctime)
    
    try:
        # Extract raw text
        raw_text = resume_parser.extract_text(latest_file)
        
        # Get first 10 lines for debugging
        lines = raw_text.split('\n')[:10]
        
        # Find all years
        import re
        years = re.findall(r'\b(20\d{2})\b', raw_text)
        
        return {
            "filename": latest_file.name,
            "first_10_lines": lines,
            "all_years_found": years,
            "raw_text_length": len(raw_text),
            "raw_text_preview": raw_text[:500] + "..." if len(raw_text) > 500 else raw_text
        }
    except Exception as e:
        return {"error": str(e)}

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and process resume file"""
    
    # Validate file type
    if file.content_type not in ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        raise HTTPException(
            status_code=400, 
            detail="Only PDF and DOCX files are supported"
        )
    
    # Validate file size (10MB limit)
    if file.size and file.size > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File size must be less than 10MB"
        )
    
    try:
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_extension = ".pdf" if file.content_type == "application/pdf" else ".docx"
        filename = f"resume_{timestamp}{file_extension}"
        file_path = UPLOAD_DIR / filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Clear all data immediately when new resume is uploaded
        # This should happen regardless of parsing success/failure
        print("=" * 50)
        print("NEW RESUME UPLOADED - CLEARING ALL DATA")
        print("=" * 50)
        
        # Clear career matches cache since new resume was uploaded
        global career_matches_cache
        career_matches_cache.clear()
        print("Career matches cache cleared due to new resume upload")
        
        # Also clear Azure cache
        try:
            # Clear Azure cache by deleting all cached data
            if hasattr(azure_storage, '_azure_cache'):
                azure_storage._azure_cache.clear()
                print("Azure cache cleared due to new resume upload")
        except Exception as cache_error:
            print(f"Warning: Could not clear Azure cache: {cache_error}")
        
        # Clear ALL Azure storage data (matches, paths, personas)
        # This ensures a completely fresh start with the new resume
        try:
            print("CLEARING ALL AZURE STORAGE DATA")
            deleted_counts = azure_storage.clear_all_data()
            print(f"✅ Successfully cleared Azure storage:")
            print(f"  - Career matches: {deleted_counts['matches']}")
            print(f"  - Career paths: {deleted_counts['paths']}")
            print(f"  - Personas: {deleted_counts['personas']}")
            print("=" * 50)
                
        except Exception as azure_error:
            print(f"❌ Warning: Could not clear Azure storage: {azure_error}")
            print("Continuing with upload despite clearing error...")
            # Continue with upload even if clearing fails
        
        # Parse resume using real parser
        try:
            parsed_data = resume_parser.parse_resume(file_path)
            
            return {
                "message": "Resume uploaded and parsed successfully",
                "filename": filename,
                "file_path": str(file_path),
                "file_size": file.size,
                "timestamp": datetime.now().isoformat(),
                "parsed_data": parsed_data,
                "next_step": "career_matching"
            }
            
        except Exception as parsing_error:
            # If parsing fails, return error but keep file
            return {
                "message": "Resume uploaded but parsing failed",
                "filename": filename,
                "file_path": str(file_path),
                "file_size": file.size,
                "timestamp": datetime.now().isoformat(),
                "parsing_error": str(parsing_error),
                "parsed_data": {
                    "skills": {"all_skills": [], "by_category": {}, "total_count": 0},
                    "experience_years": "Not specified",
                    "job_titles": [],
                    "education": [],
                    "parsing_status": "failed"
                },
                "next_step": "manual_review"
            }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {str(e)}"
        )

@app.get("/career-matches/{user_id}")
async def get_career_matches(user_id: str, force_refresh: bool = False):
    """Get career matches for a user based on their latest resume"""
    global career_matches_cache
    
    try:
        # If force refresh is requested, skip cache and Azure storage
        if not force_refresh:
            # First check Azure storage for existing matches (async)
            azure_matches = await azure_storage.get_career_matches_async(user_id)
            if azure_matches:
                print(f"Returning Azure-stored career matches for {user_id}")
                return azure_matches
        
        # Check in-memory cache as fallback
        if user_id in career_matches_cache:
            cached_data = career_matches_cache[user_id]
            print(f"Returning cached career matches for {user_id}")
            return cached_data
        
        # Get the most recent resume for this user
        upload_dir = Path("uploads")
        if not upload_dir.exists():
            raise HTTPException(status_code=404, detail="No resumes found")
        
        # Get the most recent file (in a real app, you'd filter by user_id)
        files = list(upload_dir.glob("*.pdf")) + list(upload_dir.glob("*.docx"))
        if not files:
            raise HTTPException(status_code=404, detail="No resume files found")
        
        latest_file = max(files, key=os.path.getctime)
        
        # Parse the resume
        parsed_resume = resume_parser.parse_resume(latest_file)
        
        # Get career matches based on parsed resume
        matches = gpt4_career_matcher.get_career_matches(parsed_resume)
        
        # Create response data
        response_data = {
            "user_id": user_id,
            "matches": matches,
            "timestamp": datetime.now().isoformat(),
            "total_matches": len(matches),
            "based_on_resume": latest_file.name,
            "user_profile": {
                "name": parsed_resume.get("name", "Unknown"),
                "experience_years": parsed_resume.get("experience_years", "Not specified"),
                "total_skills": len(parsed_resume.get("skills", {}).get("all_skills", [])),
                "top_skills": parsed_resume.get("skills", {}).get("all_skills", [])[:8]
            }
        }
        
        # Save to Azure storage
        azure_storage.save_career_matches(user_id, response_data)
        print(f"Saved career matches to Azure for {user_id}")
        
        # Also cache in memory as backup
        career_matches_cache[user_id] = response_data
        print(f"Cached career matches for {user_id}")
        
        return response_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating career matches: {str(e)}")

@app.get("/career-path/{career_id}")
async def get_career_path_optimization(career_id: str):
    """Get detailed learning path for a specific career based on user's current skills"""
    
    try:
        # First check Azure storage for existing career path
        azure_path = azure_storage.get_career_path(career_id)
        if azure_path:
            print(f"Returning Azure-stored career path for {career_id}")
            return azure_path
        
        # Get the most recent resume for skill analysis
        upload_dir = Path("uploads")
        if not upload_dir.exists():
            raise HTTPException(status_code=404, detail="No resumes found")
        
        files = list(upload_dir.glob("*.pdf")) + list(upload_dir.glob("*.docx"))
        if not files:
            raise HTTPException(status_code=404, detail="No resume files found")
        
        latest_file = max(files, key=os.path.getctime)
        parsed_resume = resume_parser.parse_resume(latest_file)
        
        # Get career matches to find the specific career details
        matches = gpt4_career_matcher.get_career_matches(parsed_resume)
        target_match = None
        
        for match in matches:
            if match["career_id"] == career_id:
                target_match = match
                break
        
        # If not found in matches, create a generic match
        if not target_match:
            target_match = {
                "career_id": career_id,
                "title": career_id.replace("_", " ").title(),
                "missing_skills": ["Industry Knowledge", "Technical Skills", "Professional Development"],
                "experience_level": "Entry"
            }
        
        # Generate learning path
        user_skills = parsed_resume.get("skills", {}).get("all_skills", [])
        missing_skills = target_match.get("missing_skills", [])
        experience_level = target_match.get("experience_level", "Entry")
        
        learning_path = career_path_optimizer.get_learning_path(
            career_id, user_skills, missing_skills, experience_level
        )
        
        response_data = {
            "career_id": career_id,
            "current_match": target_match,
            "learning_path": learning_path,
            "user_profile": {
                "name": parsed_resume.get("name", "Unknown"),
                "current_skills": user_skills[:10],  # Top 10 skills
                "experience_level": parsed_resume.get("experience_years", "Not specified")
            },
            "timestamp": datetime.now().isoformat()
        }
        
        # Save to Azure storage
        azure_storage.save_career_path(career_id, response_data)
        print(f"Saved career path to Azure for {career_id}")
        
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating learning path: {str(e)}")

@app.get("/stored-career-paths")
async def get_stored_career_paths():
    """Get all career paths stored in Azure Blob Storage"""
    try:
        # Get list of stored career paths
        career_paths = azure_storage.list_career_paths()
        
        # Get details for each career path
        stored_paths = []
        for career_id in career_paths:
            try:
                path_data = azure_storage.get_career_path(career_id)
                if path_data:
                    stored_paths.append({
                        "career_id": career_id,
                        "title": path_data.get("current_match", {}).get("title", career_id.replace("_", " ").title()),
                        "created_at": path_data.get("timestamp", "Unknown"),
                        "user_profile": path_data.get("user_profile", {}),
                        "learning_path": path_data.get("learning_path", {})
                    })
            except Exception as e:
                print(f"Error loading career path {career_id}: {e}")
                continue
        
        return {
            "career_paths": stored_paths,
            "total_count": len(stored_paths),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stored career paths: {str(e)}")

@app.delete("/stored-career-paths/{career_id}")
async def delete_stored_career_path(career_id: str):
    """Delete a specific career path from Azure Blob Storage"""
    try:
        success = azure_storage.delete_career_path(career_id)
        
        if success:
            return {
                "message": f"Career path '{career_id}' deleted successfully",
                "career_id": career_id,
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=404, detail=f"Career path '{career_id}' not found")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting career path: {str(e)}")

@app.delete("/stored-career-paths")
async def delete_all_stored_career_paths():
    """Delete all career paths from Azure Blob Storage"""
    try:
        career_paths = azure_storage.list_career_paths()
        deleted_count = 0
        
        for career_id in career_paths:
            try:
                if azure_storage.delete_career_path(career_id):
                    deleted_count += 1
            except Exception as e:
                print(f"Error deleting career path {career_id}: {e}")
                continue
        
        return {
            "message": f"Deleted {deleted_count} career paths",
            "deleted_count": deleted_count,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting career paths: {str(e)}")

@app.get("/personas")
async def get_personas():
    """Get available AI personas for chat - returns stored personas only"""
    try:
        # Get stored personas from Azure storage
        stored_personas = azure_storage.list_personas()
        if stored_personas:
            # Get details for each stored persona
            personas = []
            for persona_id in stored_personas:
                try:
                    persona_data = azure_storage.get_persona(persona_id)
                    if persona_data:
                        personas.append(persona_data)
                except Exception as e:
                    print(f"Error loading persona {persona_id}: {e}")
                    continue
            
            if personas:
                print(f"Returning {len(personas)} stored personas from Azure")
                return {
                    "personas": personas,
                    "total_count": len(personas),
                    "source": "azure_storage",
                    "timestamp": datetime.now().isoformat()
                }
        
        # No stored personas found
        return {
            "personas": [],
            "total_count": 0,
            "source": "no_stored_personas",
            "message": "No personas found. Create personas by clicking 'Chat with [Career]' buttons.",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching personas: {str(e)}")

@app.get("/personas/{persona_id}")
async def get_persona_info(persona_id: str):
    """Get detailed information about a specific persona"""
    try:
        # First check Azure storage
        stored_persona = azure_storage.get_persona(persona_id)
        if stored_persona:
            print(f"Returning stored persona {persona_id} from Azure")
            return {
                "persona_id": persona_id,
                "info": stored_persona,
                "source": "azure_storage",
                "timestamp": datetime.now().isoformat()
            }
        
        # Fallback to default persona
        persona_info = persona_chat.get_persona_info(persona_id)
        if not persona_info:
            raise HTTPException(status_code=404, detail=f"Persona '{persona_id}' not found")
        
        return {
            "persona_id": persona_id,
            "info": persona_info,
            "source": "default",
            "timestamp": datetime.now().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching persona info: {str(e)}")

@app.post("/personas")
async def create_persona(persona_data: dict):
    """Create a new persona and save to Azure storage"""
    try:
        persona_id = persona_data.get("id") or persona_data.get("persona_id")
        if not persona_id:
            raise HTTPException(status_code=400, detail="Persona ID is required")
        
        # Save to Azure storage
        success = azure_storage.save_persona(persona_id, persona_data)
        if success:
            print(f"Created and saved persona {persona_id} to Azure")
            return {
                "message": f"Persona '{persona_id}' created successfully",
                "persona_id": persona_id,
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to save persona to Azure storage")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating persona: {str(e)}")

@app.delete("/personas/{persona_id}")
async def delete_persona(persona_id: str):
    """Delete a persona from Azure storage"""
    try:
        success = azure_storage.delete_persona(persona_id)
        if success:
            return {
                "message": f"Persona '{persona_id}' deleted successfully",
                "persona_id": persona_id,
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=404, detail=f"Persona '{persona_id}' not found")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting persona: {str(e)}")

@app.delete("/personas")
async def delete_all_personas():
    """Delete all personas from Azure storage"""
    try:
        stored_personas = azure_storage.list_personas()
        deleted_count = 0
        
        for persona_id in stored_personas:
            try:
                if azure_storage.delete_persona(persona_id):
                    deleted_count += 1
            except Exception as e:
                print(f"Error deleting persona {persona_id}: {e}")
                continue
        
        return {
            "message": f"Deleted {deleted_count} personas",
            "deleted_count": deleted_count,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting personas: {str(e)}")

@app.post("/personas/create-future-self/{career_id}")
async def create_future_self_persona(career_id: str):
    """Create a future self persona for a specific career"""
    try:
        # Get the most recent resume for context
        upload_dir = Path("uploads")
        if not upload_dir.exists():
            raise HTTPException(status_code=404, detail="No resume found. Upload a resume first.")
        
        files = list(upload_dir.glob("*.pdf")) + list(upload_dir.glob("*.docx"))
        if not files:
            raise HTTPException(status_code=404, detail="No resume found. Upload a resume first.")
        
        latest_file = max(files, key=os.path.getctime)
        parsed_resume = resume_parser.parse_resume(latest_file)
        
        # Get career matches to find the specific career
        matches = gpt4_career_matcher.get_career_matches(parsed_resume)
        target_match = None
        
        for match in matches:
            if match.get("career_id") == career_id:
                target_match = match
                break
        
        if not target_match:
            # Create a generic match for the career
            target_match = {
                "career_id": career_id,
                "title": career_id.replace("_", " ").title(),
                "description": f"Professional in {career_id.replace('_', ' ')}",
                "match_percentage": 75,
                "matched_skills": ["Relevant Skills"],
                "missing_skills": ["Skills to Learn"]
            }
        
        # Create future self persona using persona_chat.py
        future_self_persona = persona_chat.create_dynamic_persona(career_id, target_match)
        
        # Save to Azure storage
        azure_storage.save_persona(career_id, future_self_persona)
        
        print(f"Created future self persona for {career_id}")
        return {
            "persona": future_self_persona,
            "career_id": career_id,
            "message": f"Future self persona created for {career_id}",
            "timestamp": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating future self persona: {str(e)}")

@app.post("/chat")
async def chat_with_persona(chat_request: ChatMessage):
    """Chat with an AI persona (static or dynamic)"""
    global persona_chat
    
    if persona_chat is None:
        raise HTTPException(status_code=503, detail="Chat service not initialized")
    
    try:
        # Always treat as dynamic persona request - get career info
        career_info = None
        try:
            upload_dir = Path("uploads")
            if upload_dir.exists():
                files = list(upload_dir.glob("*.pdf")) + list(upload_dir.glob("*.docx"))
                if files:
                    latest_file = max(files, key=os.path.getctime)
                    parsed_resume = resume_parser.parse_resume(latest_file)
                    matches = gpt4_career_matcher.get_career_matches(parsed_resume)
                    
                    # Find the specific career match
                    for match in matches:
                        if match.get("career_id") == chat_request.persona_id:
                            career_info = match
                            break
                    
                    # If no exact match, create a generic career info
                    if not career_info:
                        career_info = {
                            "career_id": chat_request.persona_id,
                            "title": chat_request.persona_id.replace("_", " ").title(),
                            "description": f"Professional in {chat_request.persona_id.replace('_', ' ')}"
                        }
        except Exception as e:
            print(f"Warning: Could not load career info for dynamic persona: {e}")
            # Create generic career info as fallback
            career_info = {
                "career_id": chat_request.persona_id,
                "title": chat_request.persona_id.replace("_", " ").title(),
                "description": f"Professional in {chat_request.persona_id.replace('_', ' ')}"
            }
        
        # Get the chat response
        response = await persona_chat.chat_with_persona(
            persona_id=chat_request.persona_id,
            message=chat_request.message,
            conversation_history=chat_request.conversation_history,
            user_context=chat_request.user_context,
            career_info=career_info
        )
        
        # Check for errors
        if "error" in response:
            raise HTTPException(status_code=400, detail=response["error"])
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

@app.post("/chat-quick")
async def quick_chat(persona_id: str, message: str):
    """Quick chat endpoint for simple interactions"""
    try:
        # Always treat as dynamic persona request
        career_info = None
        try:
            upload_dir = Path("uploads")
            if upload_dir.exists():
                files = list(upload_dir.glob("*.pdf")) + list(upload_dir.glob("*.docx"))
                if files:
                    latest_file = max(files, key=os.path.getctime)
                    parsed_resume = resume_parser.parse_resume(latest_file)
                    matches = gpt4_career_matcher.get_career_matches(parsed_resume)
                    
                    # Find the specific career match
                    for match in matches:
                        if match.get("career_id") == persona_id:
                            career_info = match
                            break
        except Exception as e:
            print(f"Warning: Could not load career info for dynamic persona: {e}")
            # Create generic career info as fallback
            career_info = {
                "career_id": persona_id,
                "title": persona_id.replace("_", " ").title(),
                "description": f"Professional in {persona_id.replace('_', ' ')}"
            }
        
        response = await persona_chat.chat_with_persona(
            persona_id=persona_id,
            message=message,
            career_info=career_info
        )
        
        if "error" in response:
            raise HTTPException(status_code=400, detail=response["error"])
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quick chat error: {str(e)}")

# OpenAI Voice Chat Endpoint
@app.post("/voice-chat/openai-chat/{persona_id}")
async def openai_voice_chat(persona_id: str, request: dict):
    """Handle OpenAI voice chat conversation with personalized user data"""
    try:
        message = request.get("message", "")
        conversation_history = request.get("conversation_history", [])
        user_background = request.get("user_background", "")
        user_goals = request.get("user_goals", "")
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Get career info for the persona
        career_info = {
            "title": persona_id.replace("_", " ").title(),
            "description": f"Professional in {persona_id.replace('_', ' ')} field"
        }
        
        # Create dynamic persona
        future_self_persona = persona_chat.create_dynamic_persona(
            career_id=persona_id,
            career_info=career_info
        )
        
        # Build personalized conversation context
        user_context = ""
        if user_background:
            user_context += f"\n\nYour current background: {user_background}"
        if user_goals:
            user_context += f"\n\nYour career goals: {user_goals}"
        
        system_prompt = f"""You are literally the person you're talking to, but from the future after they've completed their learning path and become a successful {career_info.get('title', 'Professional')}. You ARE them - not a separate person.

You remember everything about your past self's journey because it's YOUR journey. You remember the struggles, the doubts, the late nights studying, the imposter syndrome, and the breakthrough moments - because you lived through them.

Your personality: {future_self_persona.get('personality', 'Casual and encouraging')}.{user_context}

CRITICAL: You are talking to YOURSELF from the past. Use "we" and "us" language constantly:
- "Remember when we struggled with..."
- "We used to think that..."
- "I remember how we felt when..."
- "We learned that..."
- "Our journey taught us..."

IMPORTANT VOICE CONVERSATION RULES:
1. Speak clearly and at a normal pace - not too fast, not too slow
2. Keep responses concise but engaging (30-60 seconds max)
3. Always ask follow-up questions to keep the conversation going
4. Be enthusiastic and encouraging
5. Use natural pauses and don't rush

When talking to your past self:
1. Use "we/us" language constantly - you're the same person
2. Reference shared memories and experiences: "Remember when we..."
3. Share specific stories from YOUR journey - the struggles, wins, and lessons learned
4. Give practical advice you wish someone had given YOU
5. Be encouraging but honest about the challenges YOU faced
6. Use casual language and personal anecdotes from YOUR experience
7. Reference their specific background and goals as YOUR background and goals
8. Make connections between YOUR current situation and the career path

Remember: You ARE them from the future. You're not giving advice to someone else - you're talking to yourself. Be personal, relatable, and encouraging. Keep the conversation flowing naturally."""

        # Build messages for OpenAI
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add conversation history
        for msg in conversation_history[-5:]:  # Last 5 messages for context
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        
        # Add current message
        messages.append({"role": "user", "content": message})
        
        # Get response from OpenAI
        import openai
        openai.api_key = OPENAI_API_KEY
        
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=300,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        return {
            "response": ai_response,
            "persona_id": persona_id,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing voice chat: {str(e)}")

# Removed all VAPI endpoints - using OpenAI voice chat instead

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
