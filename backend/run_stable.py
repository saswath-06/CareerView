#!/usr/bin/env python3
"""
Stable server runner for CareerView API
Runs without auto-reload to prevent asyncio cancellation errors
"""

import uvicorn
import sys
import os

def main():
    """Run the FastAPI server in stable mode"""
    print("🚀 Starting CareerView API (Stable Mode)")
    print("📍 Server will run on http://localhost:8000")
    print("🔄 Auto-reload is DISABLED for stability")
    print("🛑 Press Ctrl+C to stop")
    print("=" * 50)
    
    try:
        uvicorn.run(
            "main:app",
            host="127.0.0.1",
            port=8000,
            reload=False,  # Disable auto-reload for stability
            log_level="info",
            access_log=True
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
