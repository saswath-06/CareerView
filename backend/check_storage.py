#!/usr/bin/env python3
"""
Check what data is currently stored in Azure
"""
import requests
import json

def check_storage():
    """Check what's currently stored in Azure"""
    try:
        print("🔍 Checking Azure storage...")
        
        # Check career paths
        print("\n📁 Career Paths:")
        response = requests.get("http://localhost:8000/stored-career-paths")
        if response.status_code == 200:
            data = response.json()
            paths = data.get('career_paths', [])
            print(f"  Found {len(paths)} career paths")
            for i, path in enumerate(paths):
                print(f"    {i+1}. {path.get('title', 'Unknown')} (ID: {path.get('career_id', 'Unknown')})")
        else:
            print(f"  ❌ Error: {response.status_code}")
        
        # Check personas
        print("\n👤 Personas:")
        response = requests.get("http://localhost:8000/personas")
        if response.status_code == 200:
            data = response.json()
            personas = data.get('personas', [])
            print(f"  Found {len(personas)} personas")
            for i, persona in enumerate(personas):
                print(f"    {i+1}. {persona.get('name', 'Unknown')} (ID: {persona.get('id', 'Unknown')})")
        else:
            print(f"  ❌ Error: {response.status_code}")
        
        # Check career matches (we can't list all, but we can check if any exist)
        print("\n🎯 Career Matches:")
        print("  (Career matches are stored per user - we can't list all)")
        print("  To check matches, visit: http://localhost:8000/career-matches/[user_id]")
        
        print("\n✅ Storage check complete!")
        
    except Exception as e:
        print(f"❌ Error checking storage: {e}")

if __name__ == "__main__":
    check_storage()

