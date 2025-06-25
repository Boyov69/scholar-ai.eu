import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Wrench, 
  Search, 
  Filter, 
  Settings, 
  Play, 
  Pause, 
  MoreVertical,
  BookOpen,
  FileText,
  Users,
  Brain,
  Zap,
  Target,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { ACADEMIC_TOOLS, STAGE_TOOL_MAPPING } from '../../config/academicTools';

/**
 * WorkspaceTools Component
 * Displays and manages research tools for a workspace
 */
const WorkspaceTools = ({ workspaceId, workspaceSettings = {} }) => {
  const [activeTools, setActiveTools] = useState([]);
  const [availableTools, setAvailableTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  // Get template-based tools from workspace settings
  const templateTools = workspaceSettings?.template ? getTemplateTools(workspaceSettings.template) : [];

  useEffect(() => {
    loadWorkspaceTools();
  }, [workspaceId]);

  const loadWorkspaceTools = async () => {
    setLoading(true);
    try {
      // Flatten all tools from ACADEMIC_TOOLS
      const allTools = Object.values(ACADEMIC_TOOLS).flat();
      setAvailableTools(allTools);
      
      // Set active tools based on template or saved settings
      const savedActiveTools = workspaceSettings?.activeTools || templateTools;
      setActiveTools(savedActiveTools);
    } catch (error) {
      console.error('Error loading workspace tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTool = async (toolId) => {
    const isActive = activeTools.includes(toolId);
    const newActiveTools = isActive 
      ? activeTools.filter(id => id !== toolId)
      : [...activeTools, toolId];
    
    setActiveTools(newActiveTools);
    
    // TODO: Save to workspace settings
    console.log('Tool toggled:', toolId, 'Active:', !isActive);
  };

  const getToolsByCategory = () => {
    const filtered = availableTools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || getToolCategory(tool.id) === filterCategory;
      return matchesSearch && matchesCategory;
    });
    
    return filtered;
  };

  const getToolCategory = (toolId) => {
    for (const [category, tools] of Object.entries(ACADEMIC_TOOLS)) {
      if (tools.some(tool => tool.id === toolId)) {
        return category;
      }
    }
    return 'other';
  };

  const getToolStatus = (toolId) => {
    if (activeTools.includes(toolId)) {
      return { status: 'active', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    }
    if (templateTools.includes(toolId)) {
      return { status: 'recommended', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    }
    return { status: 'available', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
  };

  const categories = [
    { id: 'all', label: 'All Tools', icon: Wrench },
    { id: 'discovery', label: 'Discovery', icon: Search },
    { id: 'writing', label: 'Writing', icon: FileText },
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'analysis', label: 'Analysis', icon: Brain },
    { id: 'productivity', label: 'Productivity', icon: Target }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wrench className="h-6 w-6" />
            Research Tools
          </h2>
          <p className="text-muted-foreground">
            Manage tools for your research workflow
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
            {activeTools.length} Active
          </Badge>
          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            {templateTools.length} Recommended
          </Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={filterCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterCategory(category.id)}
                    className={filterCategory === category.id ? 'ice-gradient' : ''}
                  >
                    <IconComponent className="h-4 w-4 mr-1" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getToolsByCategory().map((tool) => {
          const toolStatus = getToolStatus(tool.id);
          const isActive = activeTools.includes(tool.id);
          const isRecommended = templateTools.includes(tool.id);
          
          return (
            <Card key={tool.id} className="glass hover:glass-strong transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{tool.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {tool.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className={toolStatus.color}>
                    {toolStatus.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isRecommended && (
                      <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
                        Recommended
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs capitalize">
                      {getToolCategory(tool.id)}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant={isActive ? 'destructive' : 'default'}
                    onClick={() => toggleTool(tool.id)}
                    className={isActive ? '' : 'ice-gradient'}
                  >
                    {isActive ? (
                      <>
                        <Pause className="h-4 w-4 mr-1" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {getToolsByCategory().length === 0 && (
        <Card className="glass text-center">
          <CardContent className="pt-12 pb-12">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Tools Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Helper function to get tools based on workspace template
// FIXED: Using realistic template mapping without hallucinated tool arrays
function getTemplateTools(template) {
  const templateToolMapping = {
    'research': ['zotero', 'feedly', 'writefull', 'overleaf'],
    'literature-review': ['zotero', 'feedly', 'audemic', 'writefull'],
    'collaboration': ['overleaf', 'slack', 'loom', 'authorea'],
    'data-analysis': ['xmind', 'toggl', 'forest'],
    'blank': []
  };

  return templateToolMapping[template] || [];
}

export default WorkspaceTools;
