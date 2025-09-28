"""
GPT-4 based career matching system
Uses OpenAI GPT-4 to analyze resume data and suggest relevant career paths
"""

import openai
import json
from typing import Dict, List
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

class GPT4CareerMatcher:
    def __init__(self, openai_api_key: str = None):
        """Initialize the GPT-4 career matcher"""
        self.api_key = openai_api_key or os.getenv("OPENAI_API_KEY")
        if self.api_key:
            openai.api_key = self.api_key
        else:
            print("WARNING: No OpenAI API key found. Set OPENAI_API_KEY environment variable.")
    
    def get_career_matches(self, parsed_resume: Dict) -> List[Dict]:
        """
        Get career matches using GPT-4 analysis
        
        Args:
            parsed_resume: Dictionary containing parsed resume data
            
        Returns:
            List of career match dictionaries
        """
        try:
            # Extract resume information
            name = parsed_resume.get('name', 'Unknown')
            skills = parsed_resume.get('skills', {})
            all_skills = skills.get('all_skills', []) if isinstance(skills, dict) else skills or []
            
            # Safely convert experience_years (handle string formats like "3-5 years")
            raw_experience = parsed_resume.get('experience_years', 0)
            try:
                if isinstance(raw_experience, str):
                    # Handle formats like "3-5 years", "5+ years", "2-3 years"
                    import re
                    # Extract numbers from string
                    numbers = re.findall(r'\d+', raw_experience)
                    if numbers:
                        # Take the first number as minimum experience
                        experience_years = int(numbers[0])
                    else:
                        experience_years = 0
                else:
                    experience_years = int(raw_experience) if raw_experience is not None else 0
            except (ValueError, TypeError):
                experience_years = 0
            
            education = parsed_resume.get('education', [])
            job_titles = parsed_resume.get('job_titles', [])
            
            # Create a comprehensive resume summary
            resume_summary = self._create_resume_summary(name, all_skills, experience_years, education, job_titles)
            
            # DEBUG: Print what we're sending to GPT-4
            print(f"DEBUG: Sending to GPT-4:")
            print(f"Name: {name}")
            print(f"Job Titles: {job_titles}")
            print(f"Education: {education}")
            print(f"Original Skills: {all_skills}")
            print(f"Resume Summary: {resume_summary}")
            print("=" * 50)
            
            # Create the GPT-4 prompt
            prompt = self._create_career_analysis_prompt(resume_summary)
            
            # Call GPT-4 (compatible with v0.28.1)
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a professional career counselor and expert in career transitions. You analyze resumes and suggest the most suitable career paths based on skills, experience, and background. Always respond with valid JSON format."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1500,
                temperature=0.3  # Lower temperature for more consistent results
            )
            
            # Parse the response
            career_suggestions = json.loads(response.choices[0].message.content)
            
            # Convert to our expected format
            career_matches = self._format_career_matches(career_suggestions, parsed_resume)
            
            return career_matches
            
        except Exception as e:
            print(f"Error in GPT-4 career matching: {e}")
            # Fallback to simple matching
            return self._get_fallback_matches(parsed_resume)
    
    def _create_resume_summary(self, name: str, skills: List[str], experience_years: int, education: List[str], job_titles: List[str]) -> str:
        """Create a comprehensive resume summary for GPT-4 analysis"""
        
        summary_parts = []
        
        if name and name != 'Unknown':
            summary_parts.append(f"Candidate: {name}")
        
        if experience_years > 0:
            summary_parts.append(f"Experience: {experience_years} years")
        
        if skills:
            # Filter out programming languages for non-tech fields
            filtered_skills = self._filter_skills_for_field(skills, job_titles, education)
            if filtered_skills:
                skills_text = ", ".join(filtered_skills[:15])  # Limit to top 15 skills
                summary_parts.append(f"Skills: {skills_text}")
        
        if job_titles:
            titles_text = ", ".join(job_titles[:5])  # Limit to top 5 job titles
            summary_parts.append(f"Previous roles: {titles_text}")
        
        if education:
            education_text = ", ".join(education[:3])  # Limit to top 3 education entries
            summary_parts.append(f"Education: {education_text}")
        
        return "\n".join(summary_parts)
    
    def _filter_skills_for_field(self, skills: List[str], job_titles: List[str], education: List[str]) -> List[str]:
        """Filter out programming languages for non-tech fields"""
        
        # Check if this is clearly a non-tech field
        is_non_tech = self._is_non_tech_field(job_titles, education)
        
        if is_non_tech:
            # Filter out programming languages
            programming_langs = ["C", "C++", "Java", "Python", "JavaScript", "Go", "R", "Lua", "Ruby", "PHP", "Swift", "Kotlin", "Rust", "TypeScript", "C#", "Scala", "Haskell", "Clojure", "Erlang", "F#", "OCaml", "Prolog", "Lisp", "Assembly", "MATLAB", "SAS", "Stata", "SPSS", "Rspec"]
            return [skill for skill in skills if skill not in programming_langs]
        else:
            return skills
    
    def _is_non_tech_field(self, job_titles: List[str], education: List[str]) -> bool:
        """Check if this is clearly a non-tech field"""
        
        # Check job titles for non-tech indicators
        non_tech_titles = ["architect", "designer", "manager", "analyst", "consultant", "coordinator", "specialist", "director", "supervisor", "teacher", "professor", "researcher", "scientist", "doctor", "nurse", "lawyer", "accountant", "marketing", "sales", "hr", "operations"]
        
        for title in job_titles:
            title_lower = title.lower()
            if any(non_tech in title_lower for non_tech in non_tech_titles):
                return True
        
        # Check education for non-tech degrees
        education_text = " ".join(education).lower()
        non_tech_degrees = ["architecture", "design", "business", "marketing", "education", "psychology", "sociology", "political", "history", "english", "art", "music", "theater", "medicine", "nursing", "law", "accounting", "finance", "economics"]
        
        if any(degree in education_text for degree in non_tech_degrees):
            return True
        
        return False
    
    def _create_career_analysis_prompt(self, resume_summary: str) -> str:
        """Create the GPT-4 prompt for career analysis"""
        
        return f"""
You are an expert career counselor with access to comprehensive occupational data. Your task is to analyze this resume and recommend 5 career paths that are actually relevant to the person's real background, skills, and work history.

⚠️ CRITICAL RULES:

DO NOT default to tech/software jobs unless the resume shows actual evidence of being in that field.

Evidence includes:

Computer science/IT degree

Software/IT job titles (Developer, Engineer, Programmer, IT Specialist)

Substantial work experience in coding/software/IT systems

Mere mentions of programming languages are NOT enough.

IGNORE programming languages if the person has a clear non-tech field (Architecture, Design, Business, etc.)

If someone has "Architect" job title + "Bachelor of Architecture" degree → they are in ARCHITECTURE field, NOT tech!

If no strong tech evidence → stick to their real field (architecture, design, business, healthcare, education, etc.).

FIELD ANALYSIS PROCESS

Identify Primary Field

Look at education (degrees, certifications).

Look at job titles.

Look at recurring industry-specific skills.

Decide the dominant field (Architecture, Business, Design, Education, Healthcare, etc.).

Generate Career Matches

Suggest 5 careers that are either:

Directly within that field, or

Closely related & realistic transitions (based on skill overlap).

Use skills overlap and common transitions (e.g., Architect → Urban Planner, or Business Analyst → Project Manager).

Enhance Each Suggestion
For each career, provide:

Title

Match % (based on overlap with resume skills/experience)

Description of the role

Why this person is a good fit

Matched vs. missing skills

Salary range (reasonable market avg)

Growth outlook

Next steps (certifications, courses, networking tips)

RESPONSE FORMAT (JSON)
{{
  "career_suggestions": [
    {{
      "title": "Job Title",
        "career_id": "software_developer",  // Use descriptive names like: architect, software_developer, data_scientist, etc.
      "match_percentage": 85,
      "description": "Brief description of this career path",
      "why_good_fit": "Why this person would be good at this job based on their actual background",
      "matched_skills": ["skill1", "skill2", "skill3"],
      "missing_skills": ["skill1", "skill2"],
      "salary_range": "$60,000 - $90,000",
      "growth_outlook": "Strong growth expected",
      "next_steps": ["Action 1", "Action 2"]
    }}
  ]
}}

FIELD-SPECIFIC CHECKLIST

Architecture/Engineering → Architect, Interior Designer, Urban Planner, Construction Manager, Landscape Architect

Design/Creative → Graphic Designer, UX Designer, Industrial Designer, Art Director, Creative Director

Business/Marketing → Business Analyst, Marketing Manager, Project Manager, Operations Manager, Sales Manager

Healthcare/Science → Healthcare roles, Research Scientist, Lab Technician, Public Health Specialist

Education/Training → Teacher, Curriculum Developer, Educational Technologist, Training Specialist

Tech/Software/IT → ONLY if proven → Software Developer, Data Analyst, IT Specialist, Systems Engineer

FINAL SANITY CHECK

Before producing output, verify:

Are all 5 suggestions in line with the resume's primary field?

Are you avoiding software/data/AI unless it's clearly supported?

Are you grounding matches in actual career transitions, not generic buzzwords?

Resume Summary:
{resume_summary}

SPECIFIC EXAMPLE TO FOLLOW:
If the resume shows:
- Name: "Roopika Rayala" 
- Job Title: "Architect"
- Education: "Bachelor Of Architecture May 2030"
- Skills: "Ios, Adobe, Illustrator, Communication, Mentoring" (NO programming languages)

Then suggest: Architect, Interior Designer, Urban Planner, Construction Manager, Landscape Architect
DO NOT suggest: Software Developer, Software Architect, Data Scientist, or any tech roles

This person is clearly in the ARCHITECTURE field, not tech!

CRITICAL: If you see "Architect" job title + "Bachelor Of Architecture" education, you MUST suggest architecture-related careers only!

IMPORTANT: Use descriptive career_id format like:
- "architect" for Architect
- "interior_designer" for Interior Designer  
- "software_developer" for Software Developer
- "data_scientist" for Data Scientist
- "graphic_designer" for Graphic Designer
- "business_analyst" for Business Analyst

DO NOT use numbers like "1", "2", "3" for career_id!
"""
    
    def _format_career_matches(self, gpt_response: Dict, parsed_resume: Dict) -> List[Dict]:
        """Format GPT-4 response into our expected career match format"""
        
        career_matches = []
        suggestions = gpt_response.get("career_suggestions", [])
        
        for i, suggestion in enumerate(suggestions[:5]):  # Limit to 5 suggestions
            # Safely convert match_percentage to float
            try:
                match_percentage = float(suggestion.get("match_percentage", 75))
            except (ValueError, TypeError):
                match_percentage = 75.0
            
            # Safely get experience years
            try:
                experience_years = int(parsed_resume.get('experience_years', 0))
            except (ValueError, TypeError):
                experience_years = 0
            
            match = {
                "career_id": suggestion.get("career_id", f"career_{i+1}"),
                "title": suggestion.get("title", "Career Opportunity"),
                "match_percentage": match_percentage,
                "description": suggestion.get("description", "Exciting career opportunity"),
                "why_good_fit": suggestion.get("why_good_fit", "Good match for your skills"),
                "matched_skills": suggestion.get("matched_skills", [])[:5],
                "missing_skills": suggestion.get("missing_skills", [])[:3],
                "salary_range": suggestion.get("salary_range", "$50,000 - $80,000"),
                "growth_outlook": suggestion.get("growth_outlook", "Positive growth expected"),
                "next_steps": suggestion.get("next_steps", ["Continue learning", "Build portfolio"]),
                "vector_similarity": match_percentage / 100.0,  # Convert to 0-1 scale
                "skill_overlap": len(suggestion.get("matched_skills", [])),
                "experience_alignment": min(experience_years / 5.0, 1.0) if experience_years > 0 else 0.0 if experience_years > 0 else 0.0
            }
            career_matches.append(match)
        
        return career_matches
    
    def _get_fallback_matches(self, parsed_resume: Dict) -> List[Dict]:
        """Fallback career matches if GPT-4 fails"""
        
        skills = parsed_resume.get('skills', {})
        all_skills = skills.get('all_skills', []) if isinstance(skills, dict) else skills or []
        
        # Safely get experience years
        try:
            experience_years = int(parsed_resume.get('experience_years', 0))
        except (ValueError, TypeError):
            experience_years = 0
        
        # Simple fallback based on common skills
        fallback_careers = [
            {
                "career_id": "software_developer",
                "title": "Software Developer",
                "match_percentage": 70.0,
                "description": "Develop software applications and systems",
                "why_good_fit": "Based on your technical skills and experience",
                "matched_skills": [skill for skill in all_skills if any(tech in skill.lower() for tech in ['python', 'java', 'javascript', 'programming', 'software', 'code'])][:5],
                "missing_skills": ["Advanced algorithms", "System design"],
                "salary_range": "$60,000 - $100,000",
                "growth_outlook": "Strong growth in tech sector",
                "next_steps": ["Build coding portfolio", "Practice algorithms"],
                "vector_similarity": 0.7,
                "skill_overlap": 3,
                "experience_alignment": min(experience_years / 5.0, 1.0) if experience_years > 0 else 0.0
            },
            {
                "career_id": "data_analyst",
                "title": "Data Analyst",
                "match_percentage": 65.0,
                "description": "Analyze data to help businesses make decisions",
                "why_good_fit": "Your analytical skills would be valuable",
                "matched_skills": [skill for skill in all_skills if any(data in skill.lower() for data in ['excel', 'sql', 'data', 'analysis', 'statistics'])][:5],
                "missing_skills": ["SQL", "Data visualization"],
                "salary_range": "$50,000 - $80,000",
                "growth_outlook": "High demand for data skills",
                "next_steps": ["Learn SQL", "Practice with datasets"],
                "vector_similarity": 0.65,
                "skill_overlap": 2,
                "experience_alignment": min(experience_years / 5.0, 1.0) if experience_years > 0 else 0.0
            },
            {
                "career_id": "project_manager",
                "title": "Project Manager",
                "match_percentage": 60.0,
                "description": "Lead and coordinate projects from start to finish",
                "why_good_fit": "Your experience shows leadership potential",
                "matched_skills": [skill for skill in all_skills if any(pm in skill.lower() for pm in ['management', 'leadership', 'project', 'coordination'])][:5],
                "missing_skills": ["PMP certification", "Agile methodology"],
                "salary_range": "$55,000 - $90,000",
                "growth_outlook": "Consistent demand across industries",
                "next_steps": ["Get PMP certification", "Learn Agile/Scrum"],
                "vector_similarity": 0.6,
                "skill_overlap": 2,
                "experience_alignment": min(experience_years / 5.0, 1.0) if experience_years > 0 else 0.0
            }
        ]
        
        return fallback_careers[:3]  # Return top 3 fallback matches

# Create global instance
gpt4_career_matcher = GPT4CareerMatcher()
