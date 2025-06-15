# 🔒 Security Setup Guide

## ⚠️ CRITICAL SECURITY FIXES APPLIED

This guide explains the security improvements made to protect sensitive data.

## 🚨 Issues Fixed

### 1. API Token Exposure (CRITICAL)
- **Problem**: Vercel API token was hardcoded in multiple files
- **Risk**: Full access to Vercel account if repository is compromised
- **Solution**: Moved to environment variables

### 2. Hardcoded Paths (HIGH)
- **Problem**: Absolute Windows paths in config files
- **Risk**: Non-portable setup, breaks for other developers
- **Solution**: Relative paths and environment variables

## 🛠️ Setup Instructions

### 1. Create Local Config Files

Copy the example files and add your actual values:

```bash
# Copy config templates
cp cursor-mcp-config.example.json cursor-mcp-config.json
cp cursor-mcp-settings.example.json cursor-mcp-settings.json
cp deploy-to-production.example.js deploy-to-production.js
```

### 2. Set Environment Variables

Create a `.env.local` file:

```bash
# Vercel API Token (get from https://vercel.com/account/tokens)
VERCEL_API_TOKEN=your_actual_vercel_token_here
```

### 3. Update Config Files

Edit your local config files with the actual token:

**cursor-mcp-config.json:**
```json
{
  "mcpServers": {
    "vercel": {
      "command": "node",
      "args": ["./mcp-vercel/build/index.js"],
      "env": {
        "VERCEL_API_TOKEN": "your_actual_token_here"
      }
    }
  }
}
```

## 🔐 Security Best Practices

1. **Never commit API tokens** to version control
2. **Use environment variables** for sensitive data
3. **Use relative paths** for portability
4. **Add sensitive files to .gitignore**
5. **Rotate tokens regularly**

## 📋 Files Protected

The following files are now in `.gitignore`:
- `cursor-mcp-config.json`
- `cursor-mcp-settings.json`
- `deploy-to-production.js`

## 🔄 For Team Members

When setting up the project:

1. Copy example files to actual config files
2. Get Vercel API token from team lead
3. Update config files with actual values
4. Never commit the actual config files

## 🆘 If Token Was Compromised

If the exposed token was used maliciously:

1. **Immediately revoke** the token in Vercel dashboard
2. **Generate new token** with minimal required permissions
3. **Update all local configs** with new token
4. **Monitor Vercel account** for unauthorized deployments

## 📞 Support

For security questions, contact the development team immediately.
