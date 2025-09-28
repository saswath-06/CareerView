"""
Resume parsing module using PyPDF2, python-docx, and spaCy
Extracts skills, experience, education, and job titles from resumes
"""

import PyPDF2
import docx
import spacy
import re
from typing import Dict, List, Optional
from pathlib import Path
import logging

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    logging.error("spaCy model 'en_core_web_sm' not found. Run: python -m spacy download en_core_web_sm")
    nlp = None

class ResumeParser:
    def __init__(self):
        self.skills_keywords = {
            # Programming Languages
            "programming_languages": [
                "python", "javascript", "typescript", "java", "c++", "c#", "c", "go", "rust", 
                "php", "ruby", "swift", "kotlin", "scala", "r", "matlab", "sql", "html", 
                "css", "bash", "shell", "powershell", "perl", "lua", "dart", "objective-c"
            ],
            # Web Technologies
            "web_technologies": [
                "react", "vue", "angular", "node.js", "express", "next.js", "nuxt.js",
                "django", "flask", "fastapi", "spring", "laravel", "rails", "asp.net",
                "jquery", "bootstrap", "tailwind", "sass", "less", "webpack", "vite"
            ],
            # AI/ML/Data Science
            "ai_ml_data": [
                "machine learning", "deep learning", "artificial intelligence", "data science",
                "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy", "matplotlib",
                "seaborn", "plotly", "jupyter", "anaconda", "opencv", "nltk", "spacy",
                "transformers", "bert", "gpt", "llm", "neural networks", "cnn", "rnn", "lstm"
            ],
            # Cloud & DevOps
            "cloud_devops": [
                "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "jenkins",
                "ci/cd", "terraform", "ansible", "chef", "puppet", "gitlab", "github actions",
                "circleci", "travis ci", "helm", "istio", "prometheus", "grafana", "elk stack"
            ],
            # Databases
            "databases": [
                "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "cassandra",
                "dynamodb", "sqlite", "oracle", "sql server", "neo4j", "influxdb",
                "clickhouse", "snowflake", "bigquery", "redshift"
            ],
            # Mobile Development
            "mobile": [
                "ios", "android", "react native", "flutter", "xamarin", "ionic",
                "swift", "objective-c", "kotlin", "java", "cordova", "phonegap"
            ],
            # Tools & Platforms
            "tools_platforms": [
                "git", "github", "gitlab", "bitbucket", "jira", "confluence", "slack",
                "figma", "sketch", "adobe", "photoshop", "illustrator", "vs code",
                "intellij", "eclipse", "xcode", "postman", "insomnia", "swagger"
            ],
            # Frameworks & Libraries
            "frameworks_libraries": [
                "spring boot", "hibernate", "junit", "mockito", "selenium", "cypress",
                "jest", "mocha", "chai", "pytest", "unittest", "rspec", "cucumber"
            ],
            # Architecture & Patterns
            "architecture": [
                "microservices", "api", "rest", "graphql", "grpc", "soap", "mvc", "mvp",
                "clean architecture", "domain driven design", "event sourcing", "cqrs",
                "serverless", "lambda", "azure functions", "cloud functions"
            ],
            # Business & Soft Skills
            "business_soft": [
                "agile", "scrum", "kanban", "project management", "product management",
                "business analysis", "stakeholder management", "team leadership",
                "communication", "problem solving", "critical thinking", "mentoring"
            ]
        }
        
        self.job_titles = [
            # Software Engineering
            "software engineer", "software developer", "full stack developer", "frontend developer", 
            "backend developer", "mobile developer", "ios developer", "android developer",
            "web developer", "application developer", "systems engineer", "platform engineer",
            
            # AI/ML/Data
            "data scientist", "machine learning engineer", "ai engineer", "data engineer",
            "data analyst", "research scientist", "ml engineer", "deep learning engineer",
            "computer vision engineer", "nlp engineer", "ai researcher",
            
            # DevOps/Infrastructure
            "devops engineer", "site reliability engineer", "sre", "cloud engineer",
            "infrastructure engineer", "platform engineer", "build engineer", "release engineer",
            
            # Specialized Engineering
            "embedded systems engineer", "firmware engineer", "hardware engineer",
            "security engineer", "cybersecurity engineer", "network engineer",
            "database administrator", "dba", "systems administrator",
            
            # Leadership/Management
            "engineering manager", "technical lead", "team lead", "staff engineer",
            "principal engineer", "senior engineer", "lead developer", "architect",
            "solutions architect", "technical architect", "software architect",
            
            # Internships/Entry Level
            "intern", "software engineering intern", "ai intern", "data science intern",
            "software development intern", "engineering intern", "co-op", "trainee",
            
            # Product/Design
            "product manager", "ux designer", "ui designer", "product designer",
            "technical product manager", "growth engineer", "qa engineer", "test engineer",
            
            # Other Technical
            "technical writer", "developer advocate", "solutions engineer",
            "field engineer", "support engineer", "integration engineer"
        ]
        
        self.education_keywords = [
            "bachelor", "master", "phd", "doctorate", "degree", "university", "college",
            "computer science", "engineering", "business", "marketing", "design", "mathematics",
            "statistics", "economics", "psychology", "mba", "certification", "certified",
            "applied sciences", "computer engineering", "software engineering", "data science",
            "artificial intelligence", "machine learning", "information technology", "it",
            "electrical engineering", "mechanical engineering", "civil engineering",
            "biomedical engineering", "chemical engineering", "aerospace engineering"
        ]

    def extract_text_from_pdf(self, file_path: Path) -> str:
        """Extract text from PDF file"""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                return text
        except Exception as e:
            logging.error(f"Error extracting text from PDF: {e}")
            return ""

    def extract_text_from_docx(self, file_path: Path) -> str:
        """Extract text from DOCX file"""
        try:
            doc = docx.Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            logging.error(f"Error extracting text from DOCX: {e}")
            return ""

    def extract_text(self, file_path: Path) -> str:
        """Extract text from resume file (PDF or DOCX)"""
        file_extension = file_path.suffix.lower()
        
        if file_extension == '.pdf':
            return self.extract_text_from_pdf(file_path)
        elif file_extension == '.docx':
            return self.extract_text_from_docx(file_path)
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")

    def extract_skills(self, text: str) -> Dict[str, List[str]]:
        """Extract skills from resume text"""
        text_lower = text.lower()
        found_skills = {}
        
        for category, skills in self.skills_keywords.items():
            found_skills[category] = []
            for skill in skills:
                if skill.lower() in text_lower:
                    found_skills[category].append(skill.title())
        
        # Remove empty categories
        found_skills = {k: v for k, v in found_skills.items() if v}
        
        return found_skills

    def extract_experience_years(self, text: str) -> Optional[str]:
        """Extract years of experience from resume text - only consider work-relevant years"""
        import datetime
        current_year = datetime.datetime.now().year
        
        # Find all 4-digit years in the text
        years = re.findall(r'\b(20\d{2})\b', text)
        
        if not years:
            # Check for internships or entry-level indicators
            if re.search(r'\bintern\b|\binternship\b|\bco-op\b|\btrainee\b', text.lower()):
                return "0-1 years (Internship/Entry Level)"
            return "Not specified"
        
        # Convert to integers and filter out future years and very old years
        # Only consider years from 2015 onwards (reasonable for work experience)
        # and not future years
        year_ints = [int(year) for year in years if 2015 <= int(year) <= current_year]
        
        # Remove duplicates and sort
        unique_years = sorted(list(set(year_ints)))
        
        if not unique_years:
            # No reasonable work years found, check for student indicators
            if re.search(r'\bintern\b|\binternship\b|\bco-op\b|\btrainee\b|\bcandidate\b', text.lower()):
                return "0-1 years (Student/Internship)"
            return "0-1 years"
        
        # Find the oldest reasonable work year
        oldest_year = min(unique_years)
        
        # Calculate experience as current year minus oldest work year
        experience_years = current_year - oldest_year
        
        # Debug info (remove this later)
        print(f"DEBUG: Work years found: {unique_years}, Oldest work year: {oldest_year}, Experience: {experience_years}")
        
        # Handle edge cases
        if experience_years < 0:
            experience_years = 0
        
        # For very recent years, check if it's internship level
        if experience_years <= 1 and re.search(r'\bintern\b|\binternship\b|\bco-op\b|\btrainee\b', text.lower()):
            return "0-1 years (Internship/Entry Level)"
        
        # Categorize experience level
        if experience_years <= 1:
            return "0-1 years"
        elif experience_years <= 2:
            return "1-2 years"
        elif experience_years <= 3:
            return "2-3 years"
        elif experience_years <= 5:
            return "3-5 years"
        elif experience_years <= 10:
            return "5-10 years"
        else:
            return "10+ years"
    
    def _parse_month(self, month_str: str) -> int:
        """Convert month string to number"""
        month_map = {
            'jan': 1, 'january': 1, 'feb': 2, 'february': 2, 'mar': 3, 'march': 3,
            'apr': 4, 'april': 4, 'may': 5, 'jun': 6, 'june': 6, 'jul': 7, 'july': 7,
            'aug': 8, 'august': 8, 'sep': 9, 'sept': 9, 'september': 9, 'oct': 10,
            'october': 10, 'nov': 11, 'november': 11, 'dec': 12, 'december': 12
        }
        return month_map.get(month_str.lower(), 1)

    def extract_job_titles(self, text: str) -> List[str]:
        """Extract job titles from resume text"""
        found_titles = []
        
        # Look for job titles in common resume sections
        lines = text.split('\n')
        
        # Pattern to identify job title lines (often standalone or followed by company)
        for i, line in enumerate(lines):
            line_clean = line.strip()
            if not line_clean:
                continue
                
            # Skip section headers
            if line_clean.lower() in ['experience', 'education', 'projects', 'skills', 'technical skills']:
                continue
            
            # Check if line contains a job title
            line_lower = line_clean.lower()
            for title in self.job_titles:
                if title.lower() in line_lower:
                    # Additional context check - make sure it's likely a job title
                    # Look for company names, dates, or position indicators
                    context_lines = []
                    if i > 0:
                        context_lines.append(lines[i-1])
                    context_lines.append(line_clean)
                    if i < len(lines) - 1:
                        context_lines.append(lines[i+1])
                    
                    context = ' '.join(context_lines).lower()
                    
                    # Indicators that this is likely a job title
                    job_indicators = [
                        'intern', 'developer', 'engineer', 'manager', 'analyst', 'specialist',
                        'coordinator', 'consultant', 'architect', 'lead', 'senior', 'junior',
                        'associate', 'principal', 'staff', 'director'
                    ]
                    
                    # Check if it's in a job context (has dates, company, etc.)
                    has_dates = bool(re.search(r'\d{4}|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b', context))
                    has_job_indicator = any(indicator in line_lower for indicator in job_indicators)
                    
                    if has_dates or has_job_indicator:
                        # Extract the actual title from the line
                        title_match = re.search(rf'\b{re.escape(title)}\b[^.]*', line_clean, re.IGNORECASE)
                        if title_match:
                            extracted_title = title_match.group().strip()
                            found_titles.append(extracted_title)
                        else:
                            found_titles.append(title.title())
        
        # Also check for exact matches in the full text
        text_lower = text.lower()
        for title in self.job_titles:
            if title.lower() in text_lower and title.title() not in found_titles:
                found_titles.append(title.title())
        
        return list(set(found_titles))  # Remove duplicates

    def extract_education(self, text: str) -> List[str]:
        """Extract education information from resume text"""
        found_education = []
        lines = text.split('\n')
        
        # Look for education section and extract detailed info
        in_education_section = False
        for line in lines:
            line_clean = line.strip()
            if not line_clean:
                continue
                
            # Check if we're entering education section
            if line_clean.lower() in ['education', 'academic background', 'qualifications']:
                in_education_section = True
                continue
            
            # Check if we're leaving education section
            if in_education_section and line_clean.lower() in ['experience', 'projects', 'skills', 'technical skills', 'work experience']:
                in_education_section = False
                continue
            
            # Extract education information
            line_lower = line_clean.lower()
            
            # Look for degree patterns
            degree_patterns = [
                r'bachelor\s+of\s+[\w\s]+',
                r'master\s+of\s+[\w\s]+',
                r'b\.?s\.?\s+in\s+[\w\s]+',
                r'm\.?s\.?\s+in\s+[\w\s]+',
                r'phd\s+in\s+[\w\s]+',
                r'doctorate\s+in\s+[\w\s]+',
                r'candidate\s+for\s+[\w\s]+',
            ]
            
            for pattern in degree_patterns:
                matches = re.findall(pattern, line_lower)
                for match in matches:
                    found_education.append(match.title())
            
            # Look for university names
            university_patterns = [
                r'university\s+of\s+[\w\s]+',
                r'[\w\s]+\s+university',
                r'[\w\s]+\s+college',
                r'[\w\s]+\s+institute',
            ]
            
            for pattern in university_patterns:
                matches = re.findall(pattern, line_lower)
                for match in matches:
                    # Clean up the match
                    clean_match = re.sub(r'\s+', ' ', match).strip()
                    if len(clean_match) > 3:  # Avoid short false matches
                        found_education.append(clean_match.title())
            
            # Look for specific fields of study
            for edu in self.education_keywords:
                if edu.lower() in line_lower:
                    found_education.append(edu.title())
        
        return list(set(found_education))  # Remove duplicates

    def extract_contact_info(self, text: str) -> Dict[str, Optional[str]]:
        """Extract contact information from resume text"""
        contact_info = {
            "email": None,
            "phone": None,
            "linkedin": None,
            "github": None
        }
        
        # Email pattern
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, text)
        if email_match:
            contact_info["email"] = email_match.group()
        
        # Phone pattern
        phone_pattern = r'(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
        phone_match = re.search(phone_pattern, text)
        if phone_match:
            contact_info["phone"] = phone_match.group()
        
        # LinkedIn pattern
        linkedin_pattern = r'linkedin\.com/in/([A-Za-z0-9-]+)'
        linkedin_match = re.search(linkedin_pattern, text.lower())
        if linkedin_match:
            contact_info["linkedin"] = f"linkedin.com/in/{linkedin_match.group(1)}"
        
        # GitHub pattern
        github_pattern = r'github\.com/([A-Za-z0-9-]+)'
        github_match = re.search(github_pattern, text.lower())
        if github_match:
            contact_info["github"] = f"github.com/{github_match.group(1)}"
        
        return contact_info

    def parse_resume(self, file_path: Path) -> Dict:
        """Main method to parse resume and extract all information"""
        if not nlp:
            raise RuntimeError("spaCy model not loaded. Cannot parse resume.")
        
        # Extract text
        text = self.extract_text(file_path)
        if not text.strip():
            raise ValueError("No text could be extracted from the resume")
        
        # Process with spaCy for named entity recognition
        doc = nlp(text)
        
        # Extract information
        skills = self.extract_skills(text)
        experience_years = self.extract_experience_years(text)
        job_titles = self.extract_job_titles(text)
        education = self.extract_education(text)
        contact_info = self.extract_contact_info(text)
        
        # Extract names (persons) using multiple methods
        names = []
        
        # Method 1: spaCy NER (but filter out common false positives)
        spacy_names = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
        for name in spacy_names:
            # Filter out common false positives
            if not any(word.lower() in ['waterloo', 'university', 'college', 'toronto', 'ontario', 'canada'] 
                      for word in name.split()):
                names.append(name)
        
        # Method 2: Look for name patterns at the top of the resume
        lines = text.split('\n')
        for i, line in enumerate(lines[:5]):  # Check first 5 lines only
            line_clean = line.strip()
            if not line_clean:
                continue
            
            # Skip lines that are clearly not names
            skip_patterns = [
                r'@', r'\.com', r'\.edu', r'\.org', r'http', r'www',
                r'\d{3}[-.\s]?\d{3}[-.\s]?\d{4}',  # phone numbers
                r'university', r'college', r'school', r'institute',
                r'linkedin', r'github', r'email', r'phone', r'waterloo',
                r'candidate', r'bachelor', r'master', r'degree',
                r'engineering', r'sciences', r'computer', r'applied'
            ]
            
            if any(re.search(pattern, line_clean.lower()) for pattern in skip_patterns):
                continue
            
            # Look for name-like patterns (2-3 words, proper case)
            words = line_clean.split()
            if 2 <= len(words) <= 3:
                # Check if words start with capital letters and are reasonable length
                valid_words = []
                for word in words:
                    if word.isalpha() and word[0].isupper() and 2 <= len(word) <= 15:
                        # Avoid common non-name words
                        non_name_words = [
                            'university', 'college', 'waterloo', 'toronto', 'ontario', 
                            'canada', 'experience', 'education', 'skills', 'projects',
                            'summary', 'objective', 'candidate', 'bachelor', 'master',
                            'engineering', 'sciences', 'computer', 'applied', 'sept',
                            'april', 'may', 'august', 'january', 'february', 'march'
                        ]
                        if word.lower() not in non_name_words:
                            valid_words.append(word)
                
                # If we have 2-3 valid words, it's likely a name
                if 2 <= len(valid_words) <= 3:
                    potential_name = ' '.join(valid_words)
                    names.append(potential_name)
        
        # Method 3: Look for email addresses and extract name from them
        email_pattern = r'\b([A-Za-z0-9._%+-]+)@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_matches = re.findall(email_pattern, text)
        for email_user in email_matches:
            # Try to extract name from email (e.g., "john.doe" -> "John Doe")
            if '.' in email_user:
                parts = email_user.split('.')
                if len(parts) == 2 and all(part.isalpha() for part in parts):
                    potential_name = ' '.join(part.capitalize() for part in parts)
                    names.append(potential_name)
        
        # Choose the best name with priority system
        first_line = text.split('\n')[0].strip() if text.split('\n') else ""
        print(f"DEBUG NAME: First line: '{first_line}'")
        print(f"DEBUG NAME: All names found: {names}")
        
        if names:
            # Priority 1: Names from the very first line (most likely to be correct)
            first_line_names = []
            for name in names:
                if name in first_line:
                    first_line_names.append(name)
            
            print(f"DEBUG NAME: Names in first line: {first_line_names}")
            
            if first_line_names:
                # Prefer the longest name from the first line (more complete)
                name = max(first_line_names, key=len)
                print(f"DEBUG NAME: Selected from first line: '{name}'")
            else:
                # Priority 2: Names that look like real names (2-3 words, reasonable length)
                valid_names = []
                for candidate_name in names:
                    words = candidate_name.split()
                    if 2 <= len(words) <= 3 and len(candidate_name) <= 30:
                        # Additional check: avoid names with common non-name words
                        non_name_indicators = ['university', 'college', 'waterloo', 'inc', 'ltd', 'corp']
                        if not any(indicator in candidate_name.lower() for indicator in non_name_indicators):
                            valid_names.append(candidate_name)
                
                print(f"DEBUG NAME: Valid names: {valid_names}")
                if valid_names:
                    # Return the first valid name
                    name = valid_names[0]
                    print(f"DEBUG NAME: Selected valid name: '{name}'")
                else:
                    name = names[0] if names else "Not found"
                    print(f"DEBUG NAME: Fallback to first name: '{name}'")
        else:
            name = "Not found"
            print(f"DEBUG NAME: No names found")
        
        print(f"DEBUG NAME: Final selected name: '{name}'")
        
        # Flatten skills for easier processing
        all_skills = []
        for category_skills in skills.values():
            all_skills.extend(category_skills)
        
        return {
            "name": name,
            "contact_info": contact_info,
            "skills": {
                "by_category": skills,
                "all_skills": all_skills,
                "total_count": len(all_skills)
            },
            "experience_years": experience_years,
            "job_titles": job_titles,
            "education": education,
            "raw_text_length": len(text),
            "parsing_status": "success"
        }

# Create global parser instance
resume_parser = ResumeParser()
