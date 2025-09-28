#!/usr/bin/env python3
"""
Development startup script for CareerView MVP
Starts both backend and frontend services
"""

import subprocess
import sys
import time
import os
from pathlib import Path

def start_backend():
    """Start the FastAPI backend"""
    print("🚀 Starting Backend (FastAPI)...")
    backend_dir = Path("backend")
    
    if not backend_dir.exists():
        print("❌ Backend directory not found!")
        return None
        
    try:
        # Start backend in stable mode (no auto-reload)
        process = subprocess.Popen([
            sys.executable, "run_stable.py"
        ], cwd=backend_dir, shell=True)
        
        print("✅ Backend starting on http://localhost:8000")
        return process
        
    except Exception as e:
        print(f"❌ Failed to start backend: {e}")
        return None

def start_frontend():
    """Start the Next.js frontend"""
    print("🌐 Starting Frontend (Next.js)...")
    frontend_dir = Path("frontend")
    
    if not frontend_dir.exists():
        print("❌ Frontend directory not found!")
        return None
        
    try:
        # Start frontend in background
        process = subprocess.Popen([
            "npm", "run", "dev"
        ], cwd=frontend_dir, shell=True)
        
        print("✅ Frontend starting on http://localhost:3000")
        return process
        
    except Exception as e:
        print(f"❌ Failed to start frontend: {e}")
        return None

def main():
    """Start both services"""
    print("🏗️  CareerView MVP - Development Server")
    print("=" * 50)
    
    # Start backend
    backend_process = start_backend()
    if not backend_process:
        print("❌ Cannot start without backend")
        return
        
    time.sleep(2)  # Give backend time to start
    
    # Start frontend
    frontend_process = start_frontend()
    if not frontend_process:
        print("❌ Backend started but frontend failed")
        backend_process.terminate()
        return
    
    print("\n🎉 Both services starting!")
    print("=" * 50)
    print("📍 URLs:")
    print("   Frontend: http://localhost:3000")
    print("   Backend:  http://localhost:8000")
    print("   API Docs: http://localhost:8000/docs")
    print("\n⏳ Waiting for services to be ready...")
    print("   (This may take 30-60 seconds)")
    print("\n🛑 Press Ctrl+C to stop both services")
    
    try:
        # Keep script running
        while True:
            time.sleep(1)
            
            # Check if processes are still running
            if backend_process.poll() is not None:
                print("❌ Backend process stopped")
                break
            if frontend_process.poll() is not None:
                print("❌ Frontend process stopped")
                break
                
    except KeyboardInterrupt:
        print("\n🛑 Stopping services...")
        
        if backend_process:
            backend_process.terminate()
            print("✅ Backend stopped")
            
        if frontend_process:
            frontend_process.terminate()
            print("✅ Frontend stopped")
            
        print("👋 Development server stopped")

if __name__ == "__main__":
    main()
