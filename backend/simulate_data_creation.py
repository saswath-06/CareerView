#!/usr/bin/env python3
"""
Simulate data creation to test clearing functionality
"""
import requests
import json
import time

def simulate_data_creation():
    """Simulate creating data that would normally be created by the app"""
    try:
        print("🔧 Simulating data creation...")
        
        # Simulate creating a career path by calling the career path endpoint
        print("\n📁 Creating a test career path...")
        response = requests.get("http://localhost:8000/career-path/software_developer")
        if response.status_code == 200:
            print("✅ Career path created/retrieved")
        else:
            print(f"❌ Career path creation failed: {response.status_code}")
        
        # Simulate creating a persona
        print("\n👤 Creating a test persona...")
        persona_data = {
            "persona_id": "test_persona_123",
            "name": "Test Future Self",
            "role": "Senior Software Developer",
            "company": "Tech Corp",
            "experience": "5 years",
            "location": "San Francisco, CA",
            "salary": "$120,000",
            "background": "I'm a test persona for clearing functionality",
            "dailyTasks": ["Code review", "Team meetings", "Feature development"],
            "challenges": ["Technical debt", "Deadline pressure"],
            "advice": ["Focus on fundamentals", "Build side projects"]
        }
        
        response = requests.post("http://localhost:8000/personas", json=persona_data)
        if response.status_code == 200:
            print("✅ Persona created")
        else:
            print(f"❌ Persona creation failed: {response.status_code}")
            print(response.text)
        
        # Wait a moment
        time.sleep(2)
        
        # Check what we created
        print("\n🔍 Checking created data...")
        
        # Check career paths
        response = requests.get("http://localhost:8000/stored-career-paths")
        if response.status_code == 200:
            data = response.json()
            paths = data.get('career_paths', [])
            print(f"📁 Found {len(paths)} career paths")
        
        # Check personas
        response = requests.get("http://localhost:8000/personas")
        if response.status_code == 200:
            data = response.json()
            personas = data.get('personas', [])
            print(f"👤 Found {len(personas)} personas")
        
        print("\n✅ Data creation simulation complete!")
        print("Now you can test the clearing by uploading a new resume!")
        
    except Exception as e:
        print(f"❌ Error during simulation: {e}")

if __name__ == "__main__":
    simulate_data_creation()

