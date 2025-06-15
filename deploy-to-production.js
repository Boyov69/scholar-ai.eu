// Script to deploy scholar-ai project to production
import { spawn } from 'child_process';

const mcpServer = spawn('node', ['E:/User/Documents/scholar-ai/mcp-vercel/build/index.js'], {
  env: {
    ...process.env,
    VERCEL_API_TOKEN: 'GVsf8tu8yRyXbZ9MvyOxYw6Z'
  },
  stdio: ['pipe', 'pipe', 'pipe']
});

// Create deployment request
const deploymentRequest = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: {
    name: "vercel-create-deployment",
    args: {
      name: "scholar-ai",
      project: "scholar-ai-19gzuac4q-boyov69s-projects",
      target: "production",
      projectSettings: {
        framework: "vite",
        buildCommand: "npm run build",
        outputDirectory: "dist",
        installCommand: "npm install",
        nodeVersion: "18.x"
      }
    }
  }
};

mcpServer.stdin.write(JSON.stringify(deploymentRequest) + '\n');

mcpServer.stdout.on('data', (data) => {
  console.log('Deployment Response:', data.toString());
});

mcpServer.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});

mcpServer.on('close', (code) => {
  console.log(`MCP server process exited with code ${code}`);
});
