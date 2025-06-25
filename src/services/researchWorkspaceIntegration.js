/**
 * Research Workspace Integration Service
 * 
 * This service connects the enhanced Scholar AI model with the Academic Research Workspace,
 * ensuring all queries and results are properly routed and saved.
 */

import { futureHouseClient } from '../lib/futurehouse';
import { db } from '../lib/supabase';

class ResearchWorkspaceIntegration {
  /**
   * Route a research query to a specific workspace
   * 
   * @param {string} query - The research query text
   * @param {Array} agents - Selected FutureHouse agents
   * @param {Object} options - Query options
   * @param {string} options.workspaceId - Target workspace ID
   * @param {string} options.userId - User ID
   * @param {string} options.stage - Current pipeline stage
   * @returns {Promise<Object>} - Query results and workspace data
   */
  async routeQueryToWorkspace(query, agents, options = {}) {
    const { workspaceId, userId, stage = 'query' } = options;
    
    try {
      console.log(`🔄 Routing query to workspace ${workspaceId} at stage ${stage}`);
      
      // Create research query for FutureHouse API
      const researchQuery = {
        query: query.query_text || query,
        researchArea: query.research_area || 'General Research',
        maxResults: query.max_results || 50,
        citationStyle: query.citation_style || 'APA',
        synthesisType: query.research_depth || 'standard',
        userId: userId
      };
      
      // Process query with FutureHouse AI agents
      const results = await futureHouseClient.processResearchQuery(researchQuery, {
        agents: agents,
        workspaceId: workspaceId
      });
      
      // Save results to workspace data
      await this.saveResultsToWorkspace(results, workspaceId, stage);
      
      return {
        results,
        workspaceId,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error routing query to workspace:', error);
      return {
        error: error.message,
        status: 'error'
      };
    }
  }
  
  /**
   * Save research results to a workspace
   * 
   * @param {Object} results - Research results from FutureHouse
   * @param {string} workspaceId - Target workspace ID
   * @param {string} stage - Current pipeline stage
   * @returns {Promise<Object>} - Updated workspace data
   */
  async saveResultsToWorkspace(results, workspaceId, stage = 'query') {
    try {
      console.log(`💾 Saving results to workspace ${workspaceId} at stage ${stage}`);
      
      // Create a mock workspace for development since db methods might not exist
      let workspaceData = {};
      
      // In a real implementation, we would fetch the workspace data from the database
      try {
        if (typeof db.getWorkspaceById === 'function') {
          const { data: workspace, error } = await db.getWorkspaceById(workspaceId);
          if (!error && workspace) {
            workspaceData = workspace.data || {};
          }
        } else {
          console.log('⚠️ db.getWorkspaceById not available, using mock data');
          // Mock workspace data for development
          workspaceData = {
            id: workspaceId,
            name: 'Academic Research Workspace',
            description: 'Enhanced research workspace for Scholar AI',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        }
      } catch (fetchError) {
        console.warn('⚠️ Error fetching workspace data:', fetchError);
        // Continue with empty workspace data
      }
      
      // Store results based on pipeline stage
      switch (stage) {
        case 'query':
          workspaceData.query = {
            text: results.query || '',
            timestamp: new Date().toISOString(),
            researchArea: results.metadata?.researchArea || 'General Research'
          };
          break;
          
        case 'search':
          workspaceData.search = {
            results: results.results?.literature?.sources || [],
            timestamp: new Date().toISOString(),
            totalSources: results.metadata?.total_sources || 0
          };
          break;
          
        case 'citation':
          workspaceData.citation = {
            formatted: results.results?.citations || [],
            sources: results.results?.literature?.sources || [],
            timestamp: new Date().toISOString(),
            style: results.metadata?.citation_style || 'APA'
          };
          break;
          
        case 'think':
          workspaceData.think = {
            synthesis: results.results?.synthesis || {},
            timestamp: new Date().toISOString(),
            keyFindings: results.results?.synthesis?.key_findings || []
          };
          break;
          
        default:
          // For other stages, store in stage-specific container
          workspaceData[stage] = {
            ...results,
            timestamp: new Date().toISOString()
          };
      }
      
      // Update workspace progress
      workspaceData.currentStage = stage;
      workspaceData.lastUpdated = new Date().toISOString();
      
      // In a real implementation, we would update the workspace in the database
      try {
        if (typeof db.updateWorkspace === 'function') {
          await db.updateWorkspace(workspaceId, { data: workspaceData });
        } else {
          console.log('⚠️ db.updateWorkspace not available, skipping database update');
          // In development, we just return the data without persisting
        }
      } catch (updateError) {
        console.warn('⚠️ Error updating workspace data:', updateError);
        // Continue despite update error
      }
      
      return {
        workspaceId,
        data: workspaceData,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Error saving results to workspace:', error);
      return {
        error: error.message,
        status: 'error'
      };
    }
  }
  
  /**
   * Create a new workspace from research results
   *
   * @param {Object} results - Research results from FutureHouse
   * @param {string} userId - User ID
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - New workspace data
   */
  async createWorkspaceFromResults(results, userId, options = {}) {
    // Prevent recursive workspace creation
    const lastCreationTime = localStorage.getItem('workspace_creation_timestamp');
    const now = Date.now();
    
    if (lastCreationTime && (now - parseInt(lastCreationTime)) < 3000) {
      console.warn('⚠️ Preventing rapid workspace creation - throttled');
      return {
        status: 'throttled',
        error: 'Too many workspace creation attempts. Please try again in a few seconds.',
        workspaceId: localStorage.getItem('lastResearchWorkspaceId') || null
      };
    }
    
    // Set timestamp to prevent rapid creation
    localStorage.setItem('workspace_creation_timestamp', now.toString());
    try {
      console.log(`🏗️ Creating new workspace from research results`);
      
      // Extract research details
      const query = results.query || options.query || 'Untitled Research';
      const researchArea = results.metadata?.researchArea || options.researchArea || 'General Research';
      
      // Create new workspace
      const workspaceData = {
        name: `Research: ${query.length > 30 ? query.substring(0, 30) + '...' : query}`,
        description: `Research on ${researchArea}`,
        type: 'enhanced',
        owner_id: userId, // Changed from user_id to owner_id to match the required field in supabase.js
        data: {
          query: {
            text: query,
            timestamp: new Date().toISOString(),
            researchArea: researchArea
          },
          search: {
            results: results.results?.literature?.sources || [],
            timestamp: new Date().toISOString(),
            totalSources: results.metadata?.total_sources || 0
          },
          citation: {
            formatted: results.results?.citations || [],
            sources: results.results?.literature?.sources || [],
            timestamp: new Date().toISOString(),
            style: results.metadata?.citation_style || 'APA'
          },
          think: {
            synthesis: results.results?.synthesis || {},
            timestamp: new Date().toISOString(),
            keyFindings: results.results?.synthesis?.key_findings || []
          },
          currentStage: 'think',
          created: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      };
      
      // In a real implementation, we would create the workspace in the database
      try {
        if (typeof db.createWorkspace === 'function') {
          const { data: newWorkspace, error } = await db.createWorkspace(workspaceData);
          if (error) throw new Error(`Could not create workspace: ${error.message}`);
          
          return {
            workspaceId: newWorkspace.id,
            data: newWorkspace,
            status: 'success'
          };
        } else {
          console.log('⚠️ db.createWorkspace not available, using mock workspace');
          // For development, return a mock workspace with an ID
          const mockWorkspaceId = `mock-${Date.now()}`;
          
          // Store workspace ID for future reference
          localStorage.setItem('lastResearchWorkspaceId', mockWorkspaceId);
          
          return {
            workspaceId: mockWorkspaceId,
            data: {
              id: mockWorkspaceId,
              ...workspaceData
            },
            status: 'success'
          };
        }
      } catch (createError) {
        console.warn('⚠️ Error creating workspace:', createError);
        throw createError;
      }
    } catch (error) {
      console.error('❌ Error creating workspace from results:', error);
      return {
        error: error.message,
        status: 'error'
      };
    }
  }
}

// Export singleton instance
export const researchWorkspaceIntegration = new ResearchWorkspaceIntegration();

export default researchWorkspaceIntegration;