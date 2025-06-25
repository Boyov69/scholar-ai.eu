-- Academic Research Workspace Database Schema
-- This schema extends the existing database with tables for workspace functionality

-- Update existing workspaces table with new columns
ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS pipeline_config JSONB DEFAULT '{}';
ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS enabled_external_tools JSONB DEFAULT '[]';
ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS current_pipeline_stage TEXT DEFAULT 'query';

-- Create table for workspace tools configuration
CREATE TABLE IF NOT EXISTS workspace_tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  tool_category TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  api_key TEXT,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, tool_name)
);

-- Create table for pipeline progress tracking
CREATE TABLE IF NOT EXISTS pipeline_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID,
  stage TEXT NOT NULL,
  status TEXT DEFAULT 'in_progress',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  stage_data JSONB DEFAULT '{}',
  CONSTRAINT valid_stage CHECK (stage IN ('query', 'search', 'cite', 'think', 'test', 'ship'))
);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_workspace_tools_workspace_id ON workspace_tools(workspace_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_progress_workspace_id ON pipeline_progress(workspace_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_progress_stage ON pipeline_progress(stage);

-- Add function to update timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW(); 
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for workspace_tools
CREATE TRIGGER update_workspace_tools_timestamp
BEFORE UPDATE ON workspace_tools
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add helper function to reset workspace pipeline
CREATE OR REPLACE FUNCTION reset_workspace_pipeline(workspace_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE workspaces SET current_pipeline_stage = 'query' WHERE id = workspace_uuid;
  DELETE FROM pipeline_progress WHERE workspace_id = workspace_uuid;
  INSERT INTO pipeline_progress (workspace_id, stage, status)
  VALUES (workspace_uuid, 'query', 'in_progress');
END;
$$ LANGUAGE plpgsql;

-- Add helper function to advance workspace pipeline stage
CREATE OR REPLACE FUNCTION advance_workspace_stage(workspace_uuid UUID, current_stage TEXT, next_stage TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  valid_stages TEXT[] := ARRAY['query', 'search', 'cite', 'think', 'test', 'ship'];
  current_idx INTEGER;
  next_idx INTEGER;
BEGIN
  -- Find indices of stages
  SELECT array_position(valid_stages, current_stage) INTO current_idx;
  SELECT array_position(valid_stages, next_stage) INTO next_idx;
  
  -- Validate stage progression
  IF next_idx IS NULL OR current_idx IS NULL OR next_idx <= current_idx THEN
    RETURN FALSE;
  END IF;
  
  -- Mark current stage as completed
  UPDATE pipeline_progress 
  SET status = 'completed', completed_at = NOW()
  WHERE workspace_id = workspace_uuid AND stage = current_stage;
  
  -- Create next stage record
  INSERT INTO pipeline_progress (workspace_id, stage, status)
  VALUES (workspace_uuid, next_stage, 'in_progress');
  
  -- Update workspace current stage
  UPDATE workspaces SET current_pipeline_stage = next_stage
  WHERE id = workspace_uuid;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Example data for testing (commented out for production)
/*
INSERT INTO workspace_tools (workspace_id, tool_category, tool_name, settings, is_active)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'discovery', 'zotero', '{"apiKey": "test-key", "syncEnabled": true}', true),
  ('00000000-0000-0000-0000-000000000001', 'writing', 'writefull', '{"checkGrammar": true, "language": "en-US"}', true),
  ('00000000-0000-0000-0000-000000000001', 'productivity', 'forest', '{"goalMinutes": 30}', true);

INSERT INTO pipeline_progress (workspace_id, stage, status, stage_data)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'query', 'completed', '{"question": "How do rising ocean temperatures affect coral reef biodiversity?", "keywords": ["coral reef", "biodiversity", "temperature", "climate change"]}'),
  ('00000000-0000-0000-0000-000000000001', 'search', 'in_progress', '{"sources": 5, "databases": ["PubMed", "ScienceDirect"]}');
*/