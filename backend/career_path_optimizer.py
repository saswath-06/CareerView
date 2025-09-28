"""
Career Path Optimization System
Provides detailed roadmaps to bridge skill gaps for specific career transitions
"""

from typing import Dict, List, Optional
import json

class CareerPathOptimizer:
    def __init__(self):
        # Detailed learning paths for each career
        self.learning_paths = {
            "software_developer": {
                "foundation_skills": {
                    "programming": {
                        "courses": [
                            {"name": "CS50: Introduction to Computer Science", "provider": "Harvard University (edX)", "duration": "12 weeks", "cost": "Free", "url": "https://www.edx.org/course/cs50s-introduction-computer-science-harvardx-cs50x"},
                            {"name": "Python for Everybody", "provider": "University of Michigan (Coursera)", "duration": "7 months", "cost": "Free", "url": "https://www.coursera.org/specializations/python"},
                            {"name": "The Web Developer Bootcamp", "provider": "Colt Steele (Udemy)", "duration": "46 hours", "cost": "$89.99", "url": "https://www.udemy.com/course/the-web-developer-bootcamp/"}
                        ],
                        "projects": [
                            "Build a personal portfolio website",
                            "Create a web application with user authentication",
                            "Develop a mobile app using React Native"
                        ]
                    },
                    "data_structures": {
                        "courses": [
                            {"name": "Data Structures and Algorithms", "provider": "University of California San Diego (Coursera)", "duration": "6 months", "cost": "$49/month", "url": "https://www.coursera.org/specializations/data-structures-algorithms"},
                            {"name": "Algorithms Specialization", "provider": "Stanford University (Coursera)", "duration": "4 months", "cost": "$49/month", "url": "https://www.coursera.org/specializations/algorithms"}
                        ],
                        "projects": [
                            "Implement common data structures from scratch",
                            "Solve coding challenges on LeetCode",
                            "Build an algorithm visualization tool"
                        ]
                    }
                },
                "advanced_skills": {
                    "system_design": {
                        "courses": [
                            {"name": "System Design Interview", "provider": "Grokking the System Design Interview", "duration": "8 weeks", "cost": "$79", "url": "https://www.educative.io/courses/grokking-the-system-design-interview"},
                            {"name": "Microservices Architecture", "provider": "Udemy", "duration": "12 hours", "cost": "$89.99", "url": "https://www.udemy.com/course/microservices-architecture/"}
                        ],
                        "certifications": [
                            {"name": "AWS Certified Developer", "cost": "$150", "validity": "3 years"},
                            {"name": "Google Cloud Professional Developer", "cost": "$200", "validity": "3 years"}
                        ],
                        "projects": [
                            "Design a scalable chat application",
                            "Build a microservices-based e-commerce platform",
                            "Create a distributed system with load balancing"
                        ]
                    }
                }
            },
            "data_scientist": {
                "foundation_skills": {
                    "python": {
                        "courses": [
                            {"name": "Python for Data Science", "provider": "Coursera", "duration": "4 weeks", "cost": "Free"},
                            {"name": "Python Data Structures", "provider": "edX", "duration": "6 weeks", "cost": "$99"}
                        ],
                        "projects": [
                            "Build a data analysis tool using pandas",
                            "Create data visualizations with matplotlib/seaborn"
                        ]
                    },
                    "statistics": {
                        "courses": [
                            {"name": "Statistics for Data Science", "provider": "Udacity", "duration": "8 weeks", "cost": "$399"},
                            {"name": "Probability and Statistics", "provider": "Khan Academy", "duration": "Self-paced", "cost": "Free"}
                        ],
                        "projects": [
                            "Statistical analysis of real-world dataset",
                            "A/B testing project with hypothesis testing"
                        ]
                    },
                    "machine learning": {
                        "courses": [
                            {"name": "Machine Learning Specialization", "provider": "Coursera (Stanford)", "duration": "12 weeks", "cost": "$49/month"},
                            {"name": "Practical Machine Learning", "provider": "Fast.ai", "duration": "10 weeks", "cost": "Free"}
                        ],
                        "certifications": [
                            {"name": "Google Cloud ML Engineer", "cost": "$200", "validity": "2 years"},
                            {"name": "AWS ML Specialty", "cost": "$300", "validity": "3 years"}
                        ],
                        "projects": [
                            "End-to-end ML pipeline for prediction",
                            "Deploy ML model using Flask/FastAPI"
                        ]
                    }
                },
                "advanced_skills": {
                    "deep learning": {
                        "courses": [
                            {"name": "Deep Learning Specialization", "provider": "Coursera (deeplearning.ai)", "duration": "16 weeks", "cost": "$49/month"},
                            {"name": "PyTorch for Deep Learning", "provider": "Udemy", "duration": "12 weeks", "cost": "$89"}
                        ],
                        "projects": [
                            "Computer vision project with CNNs",
                            "NLP sentiment analysis with transformers"
                        ]
                    },
                    "big data": {
                        "courses": [
                            {"name": "Big Data with Spark", "provider": "Databricks Academy", "duration": "6 weeks", "cost": "$299"},
                            {"name": "Hadoop Ecosystem", "provider": "Cloudera", "duration": "8 weeks", "cost": "$399"}
                        ],
                        "certifications": [
                            {"name": "Databricks Certified Data Scientist", "cost": "$200", "validity": "2 years"}
                        ]
                    }
                },
                "timeline": {
                    "0-3 months": ["Python fundamentals", "Statistics basics", "First data project"],
                    "3-6 months": ["Machine learning fundamentals", "SQL proficiency", "Portfolio development"],
                    "6-12 months": ["Advanced ML techniques", "Cloud platforms", "Specialization area"],
                    "12+ months": ["Deep learning", "Big data tools", "Industry experience"]
                }
            },
            
            "software_engineer": {
                "foundation_skills": {
                    "programming": {
                        "courses": [
                            {"name": "Full Stack Web Development", "provider": "The Odin Project", "duration": "12 weeks", "cost": "Free"},
                            {"name": "JavaScript Algorithms", "provider": "freeCodeCamp", "duration": "8 weeks", "cost": "Free"}
                        ],
                        "projects": [
                            "Personal portfolio website",
                            "Todo app with CRUD operations"
                        ]
                    },
                    "version control": {
                        "courses": [
                            {"name": "Git and GitHub Mastery", "provider": "Udemy", "duration": "3 weeks", "cost": "$59"},
                            {"name": "Git Branching", "provider": "Learn Git Branching", "duration": "1 week", "cost": "Free"}
                        ],
                        "projects": [
                            "Contribute to open source project",
                            "Collaborative project with proper Git workflow"
                        ]
                    },
                    "databases": {
                        "courses": [
                            {"name": "Database Design", "provider": "Coursera", "duration": "6 weeks", "cost": "$49/month"},
                            {"name": "SQL Bootcamp", "provider": "Udemy", "duration": "4 weeks", "cost": "$79"}
                        ],
                        "projects": [
                            "Design and implement a relational database",
                            "Build REST API with database integration"
                        ]
                    }
                },
                "advanced_skills": {
                    "system design": {
                        "courses": [
                            {"name": "System Design Interview", "provider": "Educative", "duration": "8 weeks", "cost": "$79/month"},
                            {"name": "Designing Data-Intensive Applications", "provider": "Self-study", "duration": "12 weeks", "cost": "$45"}
                        ],
                        "projects": [
                            "Design a scalable chat application",
                            "Build a distributed system with microservices"
                        ]
                    },
                    "cloud platforms": {
                        "courses": [
                            {"name": "AWS Solutions Architect", "provider": "A Cloud Guru", "duration": "10 weeks", "cost": "$29/month"},
                            {"name": "Docker and Kubernetes", "provider": "Udemy", "duration": "8 weeks", "cost": "$99"}
                        ],
                        "certifications": [
                            {"name": "AWS Solutions Architect Associate", "cost": "$150", "validity": "3 years"},
                            {"name": "Certified Kubernetes Administrator", "cost": "$300", "validity": "3 years"}
                        ]
                    }
                },
                "timeline": {
                    "0-3 months": ["Programming fundamentals", "Git/GitHub", "First web project"],
                    "3-6 months": ["Framework mastery", "Database skills", "API development"],
                    "6-12 months": ["System design basics", "Cloud deployment", "Advanced projects"],
                    "12+ months": ["Distributed systems", "Performance optimization", "Leadership skills"]
                }
            },
            
            "product_manager": {
                "foundation_skills": {
                    "product strategy": {
                        "courses": [
                            {"name": "Product Management Fundamentals", "provider": "Product School", "duration": "8 weeks", "cost": "$1,999"},
                            {"name": "Lean Startup Methodology", "provider": "Udacity", "duration": "4 weeks", "cost": "$399"}
                        ],
                        "projects": [
                            "Product roadmap for a mobile app",
                            "Market research and competitive analysis"
                        ]
                    },
                    "user research": {
                        "courses": [
                            {"name": "User Experience Research", "provider": "Coursera (University of Michigan)", "duration": "6 weeks", "cost": "$49/month"},
                            {"name": "Customer Development", "provider": "Udemy", "duration": "4 weeks", "cost": "$89"}
                        ],
                        "projects": [
                            "Conduct user interviews and create personas",
                            "Design and run A/B tests"
                        ]
                    },
                    "data analysis": {
                        "courses": [
                            {"name": "SQL for Product Managers", "provider": "Mode Analytics", "duration": "4 weeks", "cost": "Free"},
                            {"name": "Analytics for Product Managers", "provider": "Mixpanel Academy", "duration": "3 weeks", "cost": "Free"}
                        ],
                        "projects": [
                            "Build product analytics dashboard",
                            "Analyze user funnel and identify improvements"
                        ]
                    }
                },
                "advanced_skills": {
                    "growth strategy": {
                        "courses": [
                            {"name": "Growth Product Management", "provider": "Reforge", "duration": "6 weeks", "cost": "$2,000"},
                            {"name": "Product-Led Growth", "provider": "ProductLed", "duration": "4 weeks", "cost": "$497"}
                        ],
                        "projects": [
                            "Design growth experiments",
                            "Optimize product onboarding flow"
                        ]
                    }
                },
                "timeline": {
                    "0-3 months": ["Product fundamentals", "User research basics", "First product analysis"],
                    "3-6 months": ["Data analysis skills", "Roadmap planning", "Stakeholder management"],
                    "6-12 months": ["Advanced analytics", "Growth strategies", "Leadership development"],
                    "12+ months": ["Strategic thinking", "Team leadership", "Industry expertise"]
                }
            },
            
            "ux_designer": {
                "foundation_skills": {
                    "design thinking": {
                        "courses": [
                            {"name": "Design Thinking Specialization", "provider": "Coursera (IDEO)", "duration": "8 weeks", "cost": "$49/month"},
                            {"name": "Human-Centered Design", "provider": "edX (MIT)", "duration": "6 weeks", "cost": "$99"}
                        ],
                        "projects": [
                            "Redesign a mobile app using design thinking",
                            "Create user journey maps for e-commerce site"
                        ]
                    },
                    "prototyping": {
                        "courses": [
                            {"name": "Figma Mastery", "provider": "Designcode", "duration": "4 weeks", "cost": "$199"},
                            {"name": "Sketch for UX Design", "provider": "Udemy", "duration": "3 weeks", "cost": "$79"}
                        ],
                        "projects": [
                            "High-fidelity mobile app prototype",
                            "Interactive web application mockup"
                        ]
                    },
                    "user research": {
                        "courses": [
                            {"name": "UX Research Methods", "provider": "Nielsen Norman Group", "duration": "2 days", "cost": "$1,395"},
                            {"name": "Usability Testing", "provider": "Coursera", "duration": "4 weeks", "cost": "$49/month"}
                        ],
                        "projects": [
                            "Conduct usability testing sessions",
                            "Create research-backed design recommendations"
                        ]
                    }
                },
                "timeline": {
                    "0-3 months": ["Design fundamentals", "Tool proficiency", "First design project"],
                    "3-6 months": ["User research skills", "Prototyping mastery", "Portfolio development"],
                    "6-12 months": ["Advanced interaction design", "Design systems", "Collaboration skills"],
                    "12+ months": ["Strategic design thinking", "Team leadership", "Industry specialization"]
                }
            },
            
            "devops_engineer": {
                "foundation_skills": {
                    "linux": {
                        "courses": [
                            {"name": "Linux Command Line Basics", "provider": "Linux Academy", "duration": "4 weeks", "cost": "$29/month"},
                            {"name": "Shell Scripting", "provider": "Udemy", "duration": "6 weeks", "cost": "$89"}
                        ],
                        "projects": [
                            "Automate server setup with bash scripts",
                            "Monitor system performance with custom tools"
                        ]
                    },
                    "containerization": {
                        "courses": [
                            {"name": "Docker Deep Dive", "provider": "A Cloud Guru", "duration": "6 weeks", "cost": "$29/month"},
                            {"name": "Kubernetes Fundamentals", "provider": "Linux Foundation", "duration": "8 weeks", "cost": "$299"}
                        ],
                        "certifications": [
                            {"name": "Docker Certified Associate", "cost": "$195", "validity": "2 years"},
                            {"name": "Certified Kubernetes Administrator", "cost": "$300", "validity": "3 years"}
                        ]
                    }
                },
                "timeline": {
                    "0-3 months": ["Linux fundamentals", "Basic scripting", "Version control"],
                    "3-6 months": ["Docker mastery", "CI/CD pipelines", "Cloud basics"],
                    "6-12 months": ["Kubernetes", "Infrastructure as Code", "Monitoring"],
                    "12+ months": ["Advanced orchestration", "Security", "Architecture design"]
                }
            }
        }
    
    def get_learning_path(self, career_id: str, user_skills: List[str], missing_skills: List[str], experience_level: str) -> Dict:
        """Generate a personalized learning path for a specific career using GPT"""
        
        # Always use GPT to generate dynamic learning paths
        return self._generate_gpt_learning_path(career_id, user_skills, missing_skills, experience_level)
    
    def _generate_gpt_learning_path(self, career_id: str, user_skills: List[str], missing_skills: List[str], experience_level: str) -> Dict:
        """Generate a personalized learning path using GPT-4"""
        
        import openai
        
        # Set up OpenAI API
        openai.api_key = os.getenv("OPENAI_API_KEY")
        
        career_title = career_id.replace("_", " ").title()
        
        # Create a comprehensive prompt for GPT
        prompt = f"""You are a career development expert. Create a detailed, personalized learning roadmap for someone transitioning to become a {career_title}.

USER PROFILE:
- Current Skills: {', '.join(user_skills[:10])}
- Missing Skills: {', '.join(missing_skills) if missing_skills else 'None identified'}
- Experience Level: {experience_level}
- Target Career: {career_title}

Please generate a comprehensive learning path with the following structure:

1. IMMEDIATE STEPS (0-3 months): Focus on foundational skills and quick wins
2. SHORT-TERM GOALS (3-6 months): Intermediate skills and practical projects  
3. LONG-TERM GOALS (6+ months): Advanced skills and professional development

For each phase, provide:
- Specific skills to learn
- Recommended courses (with real course names, providers, costs, and URLs when possible)
- Hands-on projects to build
- Timeline estimates
- Priority levels

Return your response as a JSON object with this exact structure:
{{
    "career_title": "{career_title}",
    "personalized_assessment": {{
        "foundation_gaps": ["list of missing foundational skills"],
        "advanced_opportunities": ["list of advanced skills to develop"],
        "estimated_timeline": "X-Y months to job-ready",
        "estimated_cost": "$X (plus Y free resources)"
    }},
    "market_insights": {{
        "growth_rate": "+X%",
        "avg_salary": "$XK",
        "top_companies": ["Company1", "Company2", "Company3", "Company4", "Company5"],
        "key_skills": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5"]
    }},
    "learning_roadmap": {{
        "immediate_steps": [
            {{
                "skill": "Skill Name",
                "priority": "High/Medium/Low",
                "courses": [
                    {{"name": "Course Name", "provider": "Provider", "duration": "X weeks", "cost": "$X", "url": "https://..."}},
                    {{"name": "Course Name", "provider": "Provider", "duration": "X weeks", "cost": "$X", "url": "https://..."}}
                ],
                "projects": ["Project 1", "Project 2"],
                "timeline": "0-3 months"
            }}
        ],
        "short_term_goals": [
            {{
                "skill": "Skill Name",
                "priority": "High/Medium/Low", 
                "courses": [
                    {{"name": "Course Name", "provider": "Provider", "duration": "X weeks", "cost": "$X", "url": "https://..."}}
                ],
                "projects": ["Project 1", "Project 2"],
                "timeline": "3-6 months"
            }}
        ],
        "long_term_goals": [
            {{
                "skill": "Skill Name",
                "priority": "High/Medium/Low",
                "courses": [
                    {{"name": "Course Name", "provider": "Provider", "duration": "X weeks", "cost": "$X", "url": "https://..."}}
                ],
                "projects": ["Project 1", "Project 2"],
                "timeline": "6+ months"
            }}
        ]
    }},
    "timeline_overview": {{
        "0-3 months": ["Foundation skills", "Basic projects", "Portfolio building"],
        "3-6 months": ["Intermediate skills", "Advanced projects", "Networking"],
        "6-12 months": ["Expert skills", "Professional projects", "Job applications"]
    }},
    "success_metrics": [
        "Complete 2-3 portfolio projects",
        "Earn 1-2 relevant certifications", 
        "Build professional network in the field",
        "Apply to 5-10 relevant positions"
    ],
    "next_actions": [
        "Start with foundation skills",
        "Set up learning schedule (10-15 hours/week)",
        "Join relevant online communities",
        "Begin building portfolio projects"
    ]
}}

Make sure to:
- Use real, current courses and resources
- Provide specific URLs when possible
- Focus on practical, hands-on learning
- Consider the user's current skill level
- Make recommendations actionable and time-bound
- Include both free and paid resources
- Emphasize project-based learning

Respond with ONLY the JSON object, no additional text."""

        try:
            response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=4000,
                temperature=0.7
            )
            
            # Parse the JSON response
            import json
            gpt_response = response.choices[0].message.content.strip()
            
            # Clean up the response (remove any markdown formatting)
            if gpt_response.startswith("```json"):
                gpt_response = gpt_response[7:]
            if gpt_response.endswith("```"):
                gpt_response = gpt_response[:-3]
            
            learning_path = json.loads(gpt_response)
            
            return learning_path
            
        except Exception as e:
            print(f"Error generating GPT learning path: {e}")
            # Fallback to generic path if GPT fails
            return self._generate_generic_learning_path(career_id, user_skills, missing_skills, experience_level)

    def _generate_generic_learning_path(self, career_id: str, user_skills: List[str], missing_skills: List[str], experience_level: str) -> Dict:
        """Generate a generic learning path for unknown careers"""
        
        career_title = career_id.replace("_", " ").title()
        
        # Create immediate steps based on missing skills
        immediate_steps = []
        for i, skill in enumerate(missing_skills[:3]):  # Top 3 missing skills
                # Get real courses based on skill type
                real_courses = self._get_real_courses_for_skill(skill)
                
                immediate_steps.append({
                    "skill": skill,
                    "priority": "High" if i == 0 else "Medium",
                    "courses": real_courses,
                    "projects": [
                        f"Build a project using {skill}",
                        f"Create a portfolio piece showcasing {skill}"
                    ],
                    "timeline": "0-3 months"
                })
        
        # Create short-term goals
        short_term_goals = []
        for i, skill in enumerate(missing_skills[3:6]):  # Next 3 missing skills
            real_courses = self._get_real_courses_for_skill(skill)
            short_term_goals.append({
                "skill": skill,
                "priority": "Medium",
                "courses": real_courses,
                "projects": [
                    f"Advanced project using {skill}",
                    f"Collaborative project with {skill}"
                ],
                "timeline": "3-6 months"
            })
        
        # Create long-term goals
        long_term_goals = []
        for i, skill in enumerate(missing_skills[6:9]):  # Remaining skills
            real_courses = self._get_real_courses_for_skill(skill)
            long_term_goals.append({
                "skill": skill,
                "priority": "Low",
                "courses": real_courses,
                "projects": [
                    f"Expert-level project with {skill}",
                    f"Lead a project using {skill}"
                ],
                "timeline": "6+ months"
            })
        
        # Calculate costs
        total_cost = len(missing_skills) * 200  # Rough estimate
        free_resources = len(missing_skills) * 2  # Assume 2 free resources per skill
        
        return {
            "career_title": career_title,
            "personalized_assessment": {
                "foundation_gaps": len(missing_skills),
                "advanced_opportunities": max(1, len(missing_skills) - 2),  # Always show at least 1
                "estimated_timeline": "6-12 months to job-ready",
                "estimated_cost": f"${total_cost} (plus {free_resources} free resources)"
            },
            "market_insights": self._get_market_insights(career_id),
            "learning_roadmap": {
                "immediate_steps": immediate_steps,
                "short_term_goals": short_term_goals,
                "long_term_goals": long_term_goals
            },
            "timeline_overview": {
                "0-3 months": ["Foundation skills", "Basic projects", "Portfolio building"],
                "3-6 months": ["Intermediate skills", "Advanced projects", "Networking"],
                "6-12 months": ["Expert skills", "Professional projects", "Job applications"]
            },
            "success_metrics": [
                "Complete 2-3 portfolio projects",
                "Earn 1-2 relevant certifications",
                "Build professional network in the field",
                "Apply to 5-10 relevant positions"
            ],
            "next_actions": [
                f"Start with {missing_skills[0] if missing_skills else 'foundation skills'}",
                "Set up learning schedule (10-15 hours/week)",
                "Join relevant online communities",
                "Begin building portfolio projects"
            ]
        }
    
    def _get_market_insights(self, career_id: str) -> Dict:
        """Get market insights for a specific career"""
        
        market_data = {
            "software_developer": {
                "growth_rate": "+22%",
                "avg_salary": "$105K",
                "top_companies": ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Tesla", "Uber"],
                "key_skills": ["Python", "JavaScript", "React", "Node.js", "SQL", "Git", "Docker", "AWS"]
            },
            "data_scientist": {
                "growth_rate": "+35%",
                "avg_salary": "$120K",
                "top_companies": ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Tesla", "Uber"],
                "key_skills": ["Python", "R", "SQL", "Machine Learning", "Statistics", "Pandas", "TensorFlow", "Jupyter"]
            },
            "product_manager": {
                "growth_rate": "+18%",
                "avg_salary": "$125K",
                "top_companies": ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Tesla", "Uber"],
                "key_skills": ["Product Strategy", "Data Analysis", "User Research", "Agile", "SQL", "Figma", "Jira", "Analytics"]
            },
            "ux_designer": {
                "growth_rate": "+15%",
                "avg_salary": "$95K",
                "top_companies": ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Tesla", "Uber"],
                "key_skills": ["User Research", "Figma", "Prototyping", "Design Thinking", "Usability Testing", "Sketch", "Adobe XD", "InVision"]
            },
            "devops_engineer": {
                "growth_rate": "+25%",
                "avg_salary": "$115K",
                "top_companies": ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Tesla", "Uber"],
                "key_skills": ["Docker", "Kubernetes", "AWS", "Linux", "CI/CD", "Terraform", "Jenkins", "Monitoring"]
            }
        }
        
        return market_data.get(career_id, {
            "growth_rate": "+15%",
            "avg_salary": "$85K",
            "top_companies": ["Google", "Microsoft", "Amazon", "Meta", "Apple"],
            "key_skills": ["Communication", "Problem Solving", "Leadership", "Analytics", "Project Management"]
        })

    def _get_real_courses_for_skill(self, skill: str) -> List[Dict]:
        """Get real courses based on skill type"""
        
        skill_lower = skill.lower()
        
        # Programming/Technical Skills
        if any(tech in skill_lower for tech in ["programming", "coding", "python", "javascript", "java", "web development", "software"]):
            return [
                {"name": "CS50: Introduction to Computer Science", "provider": "Harvard University (edX)", "duration": "12 weeks", "cost": "Free", "url": "https://www.edx.org/course/cs50s-introduction-computer-science-harvardx-cs50x"},
                {"name": "Python for Everybody", "provider": "University of Michigan (Coursera)", "duration": "7 months", "cost": "Free", "url": "https://www.coursera.org/specializations/python"},
                {"name": "The Web Developer Bootcamp", "provider": "Colt Steele (Udemy)", "duration": "46 hours", "cost": "$89.99", "url": "https://www.udemy.com/course/the-web-developer-bootcamp/"}
            ]
        
        # Data Science/Analytics
        elif any(data in skill_lower for data in ["data", "analytics", "statistics", "machine learning", "ai"]):
            return [
                {"name": "Machine Learning", "provider": "Stanford University (Coursera)", "duration": "11 weeks", "cost": "Free", "url": "https://www.coursera.org/learn/machine-learning"},
                {"name": "Data Science Specialization", "provider": "Johns Hopkins (Coursera)", "duration": "10 months", "cost": "$49/month", "url": "https://www.coursera.org/specializations/jhu-data-science"},
                {"name": "Introduction to Data Science", "provider": "IBM (Coursera)", "duration": "4 months", "cost": "Free", "url": "https://www.coursera.org/learn/introduction-data-science"}
            ]
        
        # Design/Creative Skills
        elif any(design in skill_lower for design in ["design", "ui", "ux", "graphic", "visual", "creative", "adobe", "photoshop", "illustrator"]):
            return [
                {"name": "Google UX Design Certificate", "provider": "Google (Coursera)", "duration": "6 months", "cost": "$39/month", "url": "https://www.coursera.org/professional-certificates/google-ux-design"},
                {"name": "Graphic Design Specialization", "provider": "CalArts (Coursera)", "duration": "6 months", "cost": "$49/month", "url": "https://www.coursera.org/specializations/graphic-design"},
                {"name": "Adobe Creative Suite", "provider": "Adobe", "duration": "Self-paced", "cost": "$20.99/month", "url": "https://www.adobe.com/creativecloud.html"}
            ]
        
        # Business/Management Skills
        elif any(business in skill_lower for business in ["business", "management", "leadership", "project", "marketing", "sales", "finance"]):
            return [
                {"name": "Business Foundations", "provider": "University of Pennsylvania (Coursera)", "duration": "4 months", "cost": "Free", "url": "https://www.coursera.org/specializations/wharton-business-foundations"},
                {"name": "Project Management Professional (PMP)", "provider": "PMI", "duration": "35 hours", "cost": "$405", "url": "https://www.pmi.org/certifications/project-management-pmp"},
                {"name": "Digital Marketing", "provider": "Google (Coursera)", "duration": "6 months", "cost": "$39/month", "url": "https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce"}
            ]
        
        # Architecture/Engineering
        elif any(arch in skill_lower for arch in ["architecture", "construction", "engineering", "autocad", "revit", "building"]):
            return [
                {"name": "Architecture and Design", "provider": "MIT OpenCourseWare", "duration": "Self-paced", "cost": "Free", "url": "https://ocw.mit.edu/courses/architecture/"},
                {"name": "AutoCAD Certification", "provider": "Autodesk", "duration": "40 hours", "cost": "$99", "url": "https://www.autodesk.com/certification"},
                {"name": "Sustainable Design", "provider": "Harvard Graduate School of Design", "duration": "8 weeks", "cost": "$1,500", "url": "https://www.gsd.harvard.edu/"}
            ]
        
        # Communication/Soft Skills
        elif any(comm in skill_lower for comm in ["communication", "presentation", "writing", "public speaking", "leadership"]):
            return [
                {"name": "Communication Skills", "provider": "University of London (Coursera)", "duration": "4 weeks", "cost": "Free", "url": "https://www.coursera.org/learn/communication-skills"},
                {"name": "Public Speaking", "provider": "University of Washington (Coursera)", "duration": "4 weeks", "cost": "Free", "url": "https://www.coursera.org/learn/public-speaking"},
                {"name": "Business Writing", "provider": "University of Colorado (Coursera)", "duration": "4 weeks", "cost": "Free", "url": "https://www.coursera.org/learn/business-writing"}
            ]
        
        # Default fallback for unknown skills
        else:
            return [
                {"name": f"Introduction to {skill}", "provider": "Coursera", "duration": "4-6 weeks", "cost": "Free-$99", "url": "https://www.coursera.org"},
                {"name": f"Advanced {skill}", "provider": "Udemy", "duration": "8-12 weeks", "cost": "$200-$500", "url": "https://www.udemy.com"},
                {"name": f"{skill} Fundamentals", "provider": "edX", "duration": "6-8 weeks", "cost": "Free-$150", "url": "https://www.edx.org"}
            ]

# Global instance
career_path_optimizer = CareerPathOptimizer()
