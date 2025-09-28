#!/usr/bin/env python3
"""
Debug the upload clearing process
"""
import requests
import json
import time

def debug_upload_clearing():
    """Debug the upload clearing process"""
    try:
        print("🔍 Debugging upload clearing process...")
        
        # First, create some data
        print("\n📁 Creating test data...")
        response = requests.get("http://localhost:8000/career-path/software_developer")
        if response.status_code == 200:
            print("✅ Career path created")
        
        # Create a persona
        persona_data = {
            "persona_id": "debug_persona_123",
            "name": "Debug Future Self",
            "role": "Senior Software Developer",
            "company": "Tech Corp",
            "experience": "5 years",
            "location": "San Francisco, CA",
            "salary": "$120,000",
            "background": "I'm a debug persona",
            "dailyTasks": ["Code review", "Team meetings"],
            "challenges": ["Technical debt"],
            "advice": ["Focus on fundamentals"]
        }
        
        response = requests.post("http://localhost:8000/personas", json=persona_data)
        if response.status_code == 200:
            print("✅ Persona created")
        
        # Wait a moment
        time.sleep(2)
        
        # Check data before upload
        print("\n🔍 Data before upload:")
        response = requests.get("http://localhost:8000/stored-career-paths")
        if response.status_code == 200:
            data = response.json()
            paths = data.get('career_paths', [])
            print(f"📁 Career paths: {len(paths)}")
        
        response = requests.get("http://localhost:8000/personas")
        if response.status_code == 200:
            data = response.json()
            personas = data.get('personas', [])
            print(f"👤 Personas: {len(personas)}")
        
        # Now test manual clearing to see if it works
        print("\n🧹 Testing manual clearing...")
        response = requests.post("http://localhost:8000/clear-all-azure-data")
        if response.status_code == 200:
            result = response.json()
            print("✅ Manual clearing successful:")
            print(f"  - Career matches: {result['deleted_counts']['matches']}")
            print(f"  - Career paths: {result['deleted_counts']['paths']}")
            print(f"  - Personas: {result['deleted_counts']['personas']}")
        else:
            print(f"❌ Manual clearing failed: {response.status_code}")
            print(response.text)
        
        # Check data after manual clearing
        print("\n🔍 Data after manual clearing:")
        response = requests.get("http://localhost:8000/stored-career-paths")
        if response.status_code == 200:
            data = response.json()
            paths = data.get('career_paths', [])
            print(f"📁 Career paths: {len(paths)}")
        
        response = requests.get("http://localhost:8000/personas")
        if response.status_code == 200:
            data = response.json()
            personas = data.get('personas', [])
            print(f"👤 Personas: {len(personas)}")
        
        print("\n✅ Debug complete!")
        
    except Exception as e:
        print(f"❌ Error during debug: {e}")

if __name__ == "__main__":
    debug_upload_clearing()

