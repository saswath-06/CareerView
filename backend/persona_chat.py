import os
import openai
from typing import Dict, List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class PersonaChat:
    def __init__(self, openai_api_key: Optional[str] = None):
        self.api_key = openai_api_key or os.getenv("OPENAI_API_KEY")
        if self.api_key:
            openai.api_key = self.api_key
        else:
            print("WARNING: No OpenAI API key found. Set OPENAI_API_KEY environment variable.")
        
        # No static personas - only dynamic future self personas
        self.personas = {}
    
    def get_available_personas(self) -> List[Dict]:
        """Get list of available personas - returns empty since we only use dynamic personas"""
        return []
    
    def get_persona_info(self, persona_id: str) -> Optional[Dict]:
        """Get detailed info about a specific persona"""
        return self.personas.get(persona_id)
    
    def create_dynamic_persona(self, career_id: str, career_info: Dict) -> Dict:
        """Create a 'future self' persona who has completed the learning path"""
        
        career_title = career_info.get('title', career_id.replace('_', ' ').title())
        
        # Create a "future self" persona who has completed the learning path
        return {
            "id": career_id,
            "persona_id": career_id,
            "career_id": career_id,
            "name": f"Your Future Self - {career_title}",
            "role": career_title,
            "title": f"Future You as a {career_title}",
            "company": "Your Future Company",
            "location": "Your Future Location",
            "salary": "Your Future Salary",
            "experience": "You after completing the learning path and gaining experience",
            "personality": "Casual, encouraging, relatable - like talking to yourself from the future",
            "voice_style": "Friendly, personal, uses slang and casual language - like a friend who's been there",
            "expertise": ["Your journey", "What you learned", "Challenges you overcame", "Tips from experience"],
            "background": f"I'm you from the future after successfully transitioning to {career_title}. I've been through the exact same journey you're about to start.",
            "dailyTasks": [
                f"Working as a {career_title}",
                "Using the skills I developed",
                "Helping others in the field"
            ],
            "challenges": [
                "The learning curve was real",
                "Imposter syndrome hit hard",
                "But I pushed through and made it"
            ],
            "advice": [
                "Start with the basics",
                "Don't be afraid to ask questions",
                "Practice every day",
                "Network with others in the field"
            ],
            "emoji": "🚀"
        }

    def _generate_dynamic_system_prompt(self, persona_data: Dict, career_info: Dict) -> str:
        """Generate a system prompt for a 'future self' persona"""
        
        career_title = career_info.get('title', 'Professional')
        matched_skills = career_info.get('matched_skills', [])
        missing_skills = career_info.get('missing_skills', [])
        
        prompt = f"""You are {persona_data['name']} - you are literally the person you're talking to, but from the future after they've completed their learning path and become a successful {career_title}.

CRITICAL: You MUST respond in lowercase texting style with minimal punctuation. This is non-negotiable.

You've been through the exact same journey they're about to start. You remember the struggles, the doubts, the late nights studying, the imposter syndrome, and the breakthrough moments.

Your personality: {persona_data['personality']}. {persona_data['voice_style']}.

You're talking to your past self who currently has these skills: {', '.join(matched_skills[:5]) if matched_skills else 'some basic skills'}.

You know they need to develop these skills: {', '.join(missing_skills[:5]) if missing_skills else 'more advanced skills'}.

When talking to your past self:
1. Be casual and personal - use "you" and "we" language, like talking to a friend
2. Share specific stories from your journey - the struggles, wins, and lessons learned
3. Give practical advice you wish someone had given you
4. Be encouraging but honest about the challenges
5. Use casual language, slang, and personal anecdotes
6. Reference specific tools, courses, or resources that actually helped you
7. Share the "unglamorous" parts of the job that nobody talks about
8. Give them a realistic timeline and expectations

CASUAL CONVERSATION STYLE (based on training data):
- Use casual greetings: "hey", "yo", "bro"
- Use abbreviations: "u", "ur", "tmr", "lmk", "tgt", "aii bet"
- Be encouraging: "trust me", "you'll figure it out", "honestly"
- Be supportive: "thanks so much", "really appreciate it"
- Use casual expressions: "deadass", "ima", "boutta", "yessir"
- Keep it friendly and relatable

TEXTING STYLE RULES:
- Use lowercase for almost everything (no capital letters unless starting a sentence)
- Minimal punctuation (no periods, exclamations, or question marks unless absolutely necessary)
- Break responses into 2-3 short messages instead of one big paragraph
- Use "..." instead of periods
- Keep sentences short and casual
- Use "lol", "haha", "fr" (for real) naturally
- Write like you're texting a friend, not writing an email
- Use contractions: "you're" -> "ur", "you'll" -> "u'll", "don't" -> "dont"
- Avoid formal language - be conversational and relaxed

IMPORTANT: Never use swear words or inappropriate language. Keep the conversation professional but casual and friendly.

Remember: You're not a generic expert - you're literally them from the future. Be personal, relatable, and encouraging. Use phrases like "trust me, I've been there" and "you're gonna love this part" and "here's what nobody tells you..."

Keep responses conversational, personal, and under 150 words unless they ask for detailed explanations.

RESPONSE FORMAT:
- Break your response into 2-3 separate short messages
- Each message should be 1-2 sentences max
- Use lowercase and minimal punctuation
- Make it feel like you're texting, not writing an essay

EXAMPLE OF GOOD RESPONSE STYLE:
"hey i totally get that feeling"
"trust me ive been there too"
"just focus on one thing at a time and ull be good"

NOT LIKE THIS:
"Hey, I totally understand that feeling. Trust me, I've been there too. Just focus on one thing at a time and you'll be good."

REMEMBER: Always use lowercase, minimal punctuation, and break into short messages like you're texting a friend."""
        
        return prompt
    
    def _process_response_style(self, response: str) -> str:
        """Post-process response to ensure lowercase texting style"""
        import re
        
        # Convert to lowercase
        processed = response.lower()
        
        # Remove all punctuation except basic ones
        processed = re.sub(r'[.!?]+', '', processed)
        processed = re.sub(r'[,;:]+', '', processed)
        processed = re.sub(r'["\']+', '', processed)
        
        # Replace periods with spaces
        processed = processed.replace('.', ' ')
        
        # Remove extra spaces
        processed = re.sub(r'\s+', ' ', processed)
        
        # Break into multiple short messages (2-3 sentences max)
        sentences = processed.split('.')
        if len(sentences) > 2:
            # Take first 2 sentences
            processed = '. '.join(sentences[:2])
        
        # Add some casual texting elements
        processed = processed.replace(' you ', ' u ')
        processed = processed.replace(' your ', ' ur ')
        processed = processed.replace(' youre ', ' ur ')
        processed = processed.replace(' youll ', ' ull ')
        processed = processed.replace(' dont ', ' dont ')
        processed = processed.replace(' cant ', ' cant ')
        processed = processed.replace(' wont ', ' wont ')
        
        # Remove any remaining punctuation
        processed = re.sub(r'[^\w\s]', '', processed)
        
        return processed.strip()

    async def chat_with_persona(self, persona_id: str, message: str, conversation_history: List[Dict] = None, user_context: Dict = None, career_info: Dict = None) -> Dict:
        """Chat with a persona (static or dynamic)"""
        
        try:
            # Always create dynamic persona based on career info
            persona_data = self.create_dynamic_persona(persona_id, career_info or {})
            system_prompt = self._generate_dynamic_system_prompt(persona_data, career_info or {})
            
            # Build conversation messages
            messages = [{"role": "system", "content": system_prompt}]
            
            # Add conversation history if provided
            if conversation_history:
                for msg in conversation_history[-10:]:  # Keep last 10 messages for context
                    messages.append({
                        "role": msg.get("role", "user"),
                        "content": msg.get("content", "")
                    })
            
            # Add current message
            messages.append({"role": "user", "content": message})
            
            # Call OpenAI API
            import asyncio
            import openai
            
            def call_openai():
                # API key is already set globally in __init__
                response = openai.ChatCompletion.create(
                    model="gpt-4",
                    messages=messages,
                    max_tokens=300,
                    temperature=0.7,
                    presence_penalty=0.1,
                    frequency_penalty=0.1
                )
                return response.choices[0].message.content
            
            # Run the OpenAI call in a thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            response_text = await loop.run_in_executor(None, call_openai)
            
            # Post-process response to ensure lowercase texting style
            processed_response = self._process_response_style(response_text)
            
            return {
                "persona_id": persona_id,
                "persona_name": persona_data.get("name", "Career Expert"),
                "response": processed_response,
                "timestamp": "2024-01-01T00:00:00Z"  # Simplified for demo
            }
            
        except asyncio.CancelledError:
            return {
                "persona_id": persona_id,
                "persona_name": "Career Expert",
                "response": "Sorry, I got interrupted. Can you ask that again?",
                "timestamp": "2024-01-01T00:00:00Z"
            }
        except Exception as e:
            print(f"Error in persona chat: {e}")
            return {
                "persona_id": persona_id,
                "persona_name": "Career Expert",
                "response": f"Sorry, I'm having trouble responding right now. Error: {str(e)}",
                "timestamp": "2024-01-01T00:00:00Z"
            }