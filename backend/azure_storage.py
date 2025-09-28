"""
Azure Blob Storage service for persistent career matches and career paths
"""
import json
import os
from datetime import datetime
from typing import Optional, Dict, Any
from azure.storage.blob import BlobServiceClient
from azure.identity import DefaultAzureCredential
import logging
from dotenv import load_dotenv
import asyncio
from concurrent.futures import ThreadPoolExecutor

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Thread pool for async operations
executor = ThreadPoolExecutor(max_workers=4)

# Simple in-memory cache for Azure data
_azure_cache = {}
_cache_timeout = 300  # 5 minutes

class AzureStorageService:
    def __init__(self):
        # Get Azure connection string from environment
        self.connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
        self.account_name = os.getenv("AZURE_STORAGE_ACCOUNT_NAME", "vthacksproj")
        self.container_name = "career-data"
        self._client = None
        self._container_client = None
        
        if not self.connection_string:
            logger.warning("AZURE_STORAGE_CONNECTION_STRING not set, using local storage fallback")
            return
            
        try:
            # Use connection string for authentication with connection pooling
            self._client = BlobServiceClient.from_connection_string(
                self.connection_string,
                # Add connection pooling settings
                connection_timeout=30,
                read_timeout=30
            )
            
            # Pre-create container client for better performance
            self._container_client = self._client.get_container_client(self.container_name)
            
            # Create container if it doesn't exist (sync for now)
            self._ensure_container_exists()
            
        except Exception as e:
            logger.error(f"Failed to initialize Azure storage: {e}")
            self._client = None
            self._container_client = None
    
    @property
    def client(self):
        return self._client
    
    @property
    def container_client(self):
        return self._container_client
    
    def _ensure_container_exists(self):
        """Create the container if it doesn't exist"""
        if not self.client:
            return
            
        try:
            # Create container with private access (no public access parameter)
            self.client.create_container(self.container_name)
            logger.info(f"Created container: {self.container_name}")
        except Exception as e:
            if "ContainerAlreadyExists" in str(e):
                logger.info(f"Container {self.container_name} already exists")
            else:
                logger.error(f"Error creating container: {e}")
    
    async def _ensure_container_exists_async(self):
        """Create the container if it doesn't exist (async)"""
        if not self.client:
            return
            
        try:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(executor, self._ensure_container_exists)
        except Exception as e:
            logger.error(f"Error creating container async: {e}")
    
    def _get_blob_name(self, data_type: str, identifier: str) -> str:
        """Generate blob name for storage"""
        return f"{data_type}/{identifier}.json"
    
    def save_career_matches(self, user_id: str, matches_data: Dict[Any, Any]) -> bool:
        """Save career matches to Azure Blob Storage or local fallback"""
        if not self.client:
            logger.warning("Azure client not available, using local storage fallback")
            return self._save_local("matches", user_id, matches_data)
            
        try:
            blob_name = self._get_blob_name("matches", user_id)
            blob_data = {
                "user_id": user_id,
                "matches": matches_data,
                "created_at": datetime.utcnow().isoformat(),
                "data_type": "career_matches"
            }
            
            blob_client = self.container_client.get_blob_client(blob_name)
            
            blob_client.upload_blob(
                json.dumps(blob_data, indent=2),
                overwrite=True
            )
            
            # Clear cache for this user
            cache_key = f"matches_{user_id}"
            if cache_key in _azure_cache:
                del _azure_cache[cache_key]
            
            logger.info(f"Saved career matches for user {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error saving career matches: {e}")
            return False
    
    def get_career_matches(self, user_id: str) -> Optional[Dict[Any, Any]]:
        """Retrieve career matches from Azure Blob Storage or local fallback"""
        # Check cache first
        cache_key = f"matches_{user_id}"
        if cache_key in _azure_cache:
            cached_data, timestamp = _azure_cache[cache_key]
            if (datetime.utcnow().timestamp() - timestamp) < _cache_timeout:
                logger.info(f"Returning cached career matches for {user_id}")
                return cached_data
        
        if not self.client or not self.container_client:
            logger.warning("Azure client not available, using local storage fallback")
            return self._get_local("matches", user_id)
            
        try:
            blob_name = self._get_blob_name("matches", user_id)
            blob_client = self.container_client.get_blob_client(blob_name)
            
            if not blob_client.exists():
                logger.info(f"No career matches found for user {user_id}")
                return None
            
            # Use streaming download for better performance
            blob_data = blob_client.download_blob().readall()
            data = json.loads(blob_data.decode('utf-8'))
            
            # Cache the result
            matches = data.get("matches")
            _azure_cache[cache_key] = (matches, datetime.utcnow().timestamp())
            
            logger.info(f"Retrieved career matches for user {user_id}")
            return matches
            
        except Exception as e:
            logger.error(f"Error retrieving career matches: {e}")
            return None
    
    async def get_career_matches_async(self, user_id: str) -> Optional[Dict[Any, Any]]:
        """Retrieve career matches from Azure Blob Storage (async)"""
        if not self.client or not self.container_client:
            logger.warning("Azure client not available, cannot retrieve data")
            return None
            
        try:
            loop = asyncio.get_event_loop()
            return await loop.run_in_executor(executor, self.get_career_matches, user_id)
        except Exception as e:
            logger.error(f"Error retrieving career matches async: {e}")
            return None
    
    def save_career_path(self, career_id: str, path_data: Dict[Any, Any]) -> bool:
        """Save career path to Azure Blob Storage"""
        if not self.client:
            logger.warning("Azure client not available, skipping save")
            return False
            
        try:
            blob_name = self._get_blob_name("paths", career_id)
            blob_data = {
                "career_id": career_id,
                "path_data": path_data,
                "created_at": datetime.utcnow().isoformat(),
                "data_type": "career_path"
            }
            
            blob_client = self.client.get_blob_client(
                container=self.container_name, 
                blob=blob_name
            )
            
            blob_client.upload_blob(
                json.dumps(blob_data, indent=2),
                overwrite=True
            )
            
            logger.info(f"Saved career path for career {career_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error saving career path: {e}")
            return False
    
    def get_career_path(self, career_id: str) -> Optional[Dict[Any, Any]]:
        """Retrieve career path from Azure Blob Storage"""
        if not self.client:
            logger.warning("Azure client not available, cannot retrieve data")
            return None
            
        try:
            blob_name = self._get_blob_name("paths", career_id)
            blob_client = self.client.get_blob_client(
                container=self.container_name, 
                blob=blob_name
            )
            
            if not blob_client.exists():
                logger.info(f"No career path found for career {career_id}")
                return None
            
            blob_data = blob_client.download_blob().readall()
            data = json.loads(blob_data.decode('utf-8'))
            
            logger.info(f"Retrieved career path for career {career_id}")
            return data.get("path_data")
            
        except Exception as e:
            logger.error(f"Error retrieving career path: {e}")
            return None
    
    def delete_career_matches(self, user_id: str) -> bool:
        """Delete career matches from Azure Blob Storage"""
        if not self.client:
            logger.warning("Azure client not available, cannot delete data")
            return False
            
        try:
            blob_name = self._get_blob_name("matches", user_id)
            blob_client = self.client.get_blob_client(
                container=self.container_name, 
                blob=blob_name
            )
            
            if blob_client.exists():
                blob_client.delete_blob()
                logger.info(f"Deleted career matches for user {user_id}")
                return True
            else:
                logger.info(f"No career matches found to delete for user {user_id}")
                return True
                
        except Exception as e:
            logger.error(f"Error deleting career matches: {e}")
            return False
    
    def delete_career_path(self, career_id: str) -> bool:
        """Delete career path from Azure Blob Storage"""
        if not self.client:
            logger.warning("Azure client not available, cannot delete data")
            return False
            
        try:
            blob_name = self._get_blob_name("paths", career_id)
            blob_client = self.client.get_blob_client(
                container=self.container_name, 
                blob=blob_name
            )
            
            if blob_client.exists():
                blob_client.delete_blob()
                logger.info(f"Deleted career path for career {career_id}")
                return True
            else:
                logger.info(f"No career path found to delete for career {career_id}")
                return True
                
        except Exception as e:
            logger.error(f"Error deleting career path: {e}")
            return False
    
    def list_user_matches(self) -> list:
        """List all stored career matches"""
        if not self.client:
            return []
            
        try:
            matches = []
            blobs = self.client.get_container_client(self.container_name).list_blobs(
                name_starts_with="matches/"
            )
            
            for blob in blobs:
                if blob.name.endswith('.json'):
                    user_id = blob.name.replace('matches/', '').replace('.json', '')
                    matches.append(user_id)
            
            return matches
            
        except Exception as e:
            logger.error(f"Error listing matches: {e}")
            return []
    
    def list_career_paths(self) -> list:
        """List all stored career paths"""
        if not self.client:
            return []
            
        try:
            paths = []
            blobs = self.client.get_container_client(self.container_name).list_blobs(
                name_starts_with="paths/"
            )
            
            for blob in blobs:
                if blob.name.endswith('.json'):
                    career_id = blob.name.replace('paths/', '').replace('.json', '')
                    paths.append(career_id)
            
            return paths
            
        except Exception as e:
            logger.error(f"Error listing career paths: {e}")
            return []
    
    def save_persona(self, persona_id: str, persona_data: Dict[Any, Any]) -> bool:
        """Save persona to Azure Blob Storage"""
        if not self.client:
            logger.warning("Azure client not available, skipping save")
            return False
            
        try:
            blob_name = self._get_blob_name("personas", persona_id)
            blob_data = {
                "persona_id": persona_id,
                "persona_data": persona_data,
                "created_at": datetime.utcnow().isoformat(),
                "data_type": "persona"
            }
            
            blob_client = self.client.get_blob_client(
                container=self.container_name, 
                blob=blob_name
            )
            
            blob_client.upload_blob(
                json.dumps(blob_data, indent=2),
                overwrite=True
            )
            
            logger.info(f"Saved persona for {persona_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error saving persona: {e}")
            return False
    
    def get_persona(self, persona_id: str) -> Optional[Dict[Any, Any]]:
        """Retrieve persona from Azure Blob Storage"""
        if not self.client:
            logger.warning("Azure client not available, cannot retrieve data")
            return None
            
        try:
            blob_name = self._get_blob_name("personas", persona_id)
            blob_client = self.client.get_blob_client(
                container=self.container_name, 
                blob=blob_name
            )
            
            if not blob_client.exists():
                logger.info(f"No persona found for {persona_id}")
                return None
            
            blob_data = blob_client.download_blob().readall()
            data = json.loads(blob_data.decode('utf-8'))
            
            logger.info(f"Retrieved persona for {persona_id}")
            return data.get("persona_data")
            
        except Exception as e:
            logger.error(f"Error retrieving persona: {e}")
            return None
    
    def delete_persona(self, persona_id: str) -> bool:
        """Delete persona from Azure Blob Storage"""
        if not self.client:
            logger.warning("Azure client not available, cannot delete data")
            return False
            
        try:
            blob_name = self._get_blob_name("personas", persona_id)
            blob_client = self.client.get_blob_client(
                container=self.container_name, 
                blob=blob_name
            )
            
            if blob_client.exists():
                blob_client.delete_blob()
                logger.info(f"Deleted persona for {persona_id}")
                return True
            else:
                logger.info(f"No persona found to delete for {persona_id}")
                return True
                
        except Exception as e:
            logger.error(f"Error deleting persona: {e}")
            return False
    
    def list_personas(self) -> list:
        """List all stored personas"""
        if not self.client:
            return []
            
        try:
            personas = []
            blobs = self.client.get_container_client(self.container_name).list_blobs(
                name_starts_with="personas/"
            )
            
            for blob in blobs:
                if blob.name.endswith('.json'):
                    persona_id = blob.name.replace('personas/', '').replace('.json', '')
                    personas.append(persona_id)
            
            return personas
            
        except Exception as e:
            logger.error(f"Error listing personas: {e}")
            return []
    
    def clear_all_data(self) -> Dict[str, int]:
        """Clear all stored data (matches, paths, personas) from Azure storage"""
        if not self.client:
            logger.warning("Azure client not available, cannot clear data")
            return {"matches": 0, "paths": 0, "personas": 0}
        
        deleted_counts = {"matches": 0, "paths": 0, "personas": 0}
        
        try:
            print("🔍 Listing all stored data...")
            
            # Clear all matches
            user_matches = self.list_user_matches()
            print(f"Found {len(user_matches)} user matches to delete: {user_matches}")
            for user_id in user_matches:
                if self.delete_career_matches(user_id):
                    deleted_counts["matches"] += 1
                    print(f"✅ Deleted career matches for user {user_id}")
                else:
                    print(f"❌ Failed to delete career matches for user {user_id}")
            
            # Clear all career paths
            career_paths = self.list_career_paths()
            print(f"Found {len(career_paths)} career paths to delete: {career_paths}")
            for career_id in career_paths:
                if self.delete_career_path(career_id):
                    deleted_counts["paths"] += 1
                    print(f"✅ Deleted career path for career {career_id}")
                else:
                    print(f"❌ Failed to delete career path for career {career_id}")
            
            # Clear all personas
            personas = self.list_personas()
            print(f"Found {len(personas)} personas to delete: {personas}")
            for persona_id in personas:
                if self.delete_persona(persona_id):
                    deleted_counts["personas"] += 1
                    print(f"✅ Deleted persona for {persona_id}")
                else:
                    print(f"❌ Failed to delete persona for {persona_id}")
            
            # Clear cache
            if hasattr(self, '_azure_cache'):
                self._azure_cache.clear()
                print("✅ Cleared Azure cache")
            
            print(f"🎉 Cleared all Azure data: {deleted_counts}")
            return deleted_counts
            
        except Exception as e:
            print(f"❌ Error clearing all Azure data: {e}")
            logger.error(f"Error clearing all Azure data: {e}")
            return deleted_counts

# Global instance
azure_storage = AzureStorageService()
