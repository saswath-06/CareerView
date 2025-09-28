# Azure Storage Setup Guide

## Overview
This guide explains how to set up Azure Blob Storage for persistent career matches and career paths.

## Prerequisites
1. Azure account with active subscription
2. Azure Storage Account created

## Setup Steps

### 1. Create Azure Storage Account
1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource" → "Storage account"
3. Fill in the details:
   - **Subscription**: Your subscription
   - **Resource group**: Create new or use existing
   - **Storage account name**: Choose a unique name (e.g., `careersimstorage`)
   - **Region**: Choose closest to your users
   - **Performance**: Standard
   - **Redundancy**: LRS (Locally-redundant storage)
4. Click "Review + create" → "Create"

### 2. Get Storage Account Name
1. Go to your storage account in Azure Portal
2. Copy the **Storage account name** from the overview page
3. This will be your `AZURE_STORAGE_ACCOUNT_NAME`

### 3. Set Up Authentication
The application uses `DefaultAzureCredential` which supports multiple authentication methods:

#### Option A: Azure CLI (Recommended for development)
```bash
# Install Azure CLI
# Then login
az login

# Set default subscription (if you have multiple)
az account set --subscription "your-subscription-id"
```

#### Option B: Environment Variables
Set these environment variables:
```bash
export AZURE_CLIENT_ID="your-client-id"
export AZURE_CLIENT_SECRET="your-client-secret"
export AZURE_TENANT_ID="your-tenant-id"
```

#### Option C: Managed Identity (For production)
If running on Azure (App Service, VM, etc.), enable Managed Identity.

### 4. Configure Environment Variables
Create a `.env` file in the backend directory:
```bash
# Azure Storage
AZURE_STORAGE_ACCOUNT_NAME=your_storage_account_name

# OpenAI (if not already set)
OPENAI_API_KEY=your_openai_api_key
```

### 5. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

## How It Works

### Data Storage Structure
```
career-data/
├── matches/
│   ├── user123.json
│   ├── user456.json
│   └── ...
└── paths/
    ├── software_developer.json
    ├── data_scientist.json
    └── ...
```

### Storage Behavior
1. **Career Matches**: Stored per user, cleared when new resume uploaded
2. **Career Paths**: Stored per career, cleared when new resume uploaded
3. **Automatic Fallback**: If Azure is unavailable, falls back to in-memory cache

### Benefits
- ✅ **Persistent Storage**: Data survives server restarts
- ✅ **Scalable**: Can handle multiple users simultaneously
- ✅ **Reliable**: Azure's 99.9% uptime SLA
- ✅ **Cost-Effective**: Pay only for storage used
- ✅ **Secure**: Built-in encryption and access controls

## Testing
1. Start the backend server
2. Upload a resume
3. Check Azure Portal → Storage Account → Containers → career-data
4. You should see the stored data

## Troubleshooting

### Common Issues
1. **Authentication Error**: Make sure you're logged in with `az login`
2. **Container Not Found**: The app will create it automatically
3. **Permission Denied**: Check your Azure RBAC permissions

### Debug Commands
```bash
# Check Azure login status
az account show

# List storage accounts
az storage account list

# Check container contents
az storage blob list --account-name your_storage_account_name --container-name career-data
```

## Cost Estimation
- **Storage**: ~$0.02/GB/month
- **Transactions**: ~$0.004/10,000 operations
- **Typical usage**: <$1/month for small applications

## Security Notes
- Data is encrypted at rest by default
- Access is controlled via Azure RBAC
- Consider enabling soft delete for additional protection
- Use private endpoints for production environments

