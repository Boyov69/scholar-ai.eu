import React, { useState } from 'react';
import { 
  Users, Settings, MoreVertical, Edit3, Trash2, Share2, 
  Lock, Globe, Eye, Calendar, Activity, FileText, MessageSquare,
  Crown, Shield, User, UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

/**
 * 🏢 State-of-the-Art Workspace Card Component
 * 
 * Features:
 * - Modern card design with hover effects
 * - Role-based access indicators
 * - Activity metrics and analytics
 * - Quick actions menu
 * - Member avatars preview
 * - Status indicators
 * - Collaboration tools
 */
export const WorkspaceCard = ({ 
  workspace, 
  currentUserRole = 'member',
  onEdit, 
  onDelete, 
  onShare, 
  onSettings,
  onClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'admin': return <Shield className="h-4 w-4 text-blue-500" />;
      case 'member': return <User className="h-4 w-4 text-green-500" />;
      case 'viewer': return <Eye className="h-4 w-4 text-gray-500" />;
      default: return <UserCheck className="h-4 w-4 text-gray-400" />;
    }
  };

  const getVisibilityIcon = () => {
    switch (workspace.visibility) {
      case 'public': return <Globe className="h-4 w-4 text-green-500" />;
      case 'team': return <Users className="h-4 w-4 text-blue-500" />;
      case 'organization': return <Shield className="h-4 w-4 text-purple-500" />;
      default: return <Lock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const canEdit = currentUserRole === 'owner' || currentUserRole === 'admin';
  const canDelete = currentUserRole === 'owner';

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-l-4 ${
        workspace.status === 'active' ? 'border-l-green-500' : 
        workspace.status === 'archived' ? 'border-l-yellow-500' : 'border-l-red-500'
      }`}
      style={{ borderLeftColor: workspace.color_theme }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(workspace)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Workspace Header */}
            <div className="flex items-center gap-2 mb-2">
              {workspace.avatar_url ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={workspace.avatar_url} />
                  <AvatarFallback style={{ backgroundColor: workspace.color_theme }}>
                    {workspace.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div 
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                  style={{ backgroundColor: workspace.color_theme }}
                >
                  {workspace.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-foreground truncate drop-shadow-sm hover:text-primary transition-colors duration-200">
                  {workspace.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {getRoleIcon(currentUserRole)}
                  <span className="capitalize font-medium">{currentUserRole}</span>
                  <span>•</span>
                  {getVisibilityIcon()}
                  <span className="capitalize font-medium">{workspace.visibility || 'private'}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {workspace.description && (
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3 leading-relaxed">
                {workspace.description}
              </p>
            )}

            {/* Tags */}
            {workspace.tags && workspace.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {workspace.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {workspace.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{workspace.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                  isHovered ? 'opacity-100' : ''
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onClick?.(workspace);
              }}>
                <Eye className="h-4 w-4 mr-2" />
                Open Workspace
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onShare?.(workspace);
              }}>
                <Share2 className="h-4 w-4 mr-2" />
                Share & Invite
              </DropdownMenuItem>

              {canEdit && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(workspace);
                  }}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Workspace
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onSettings?.(workspace);
                  }}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                </>
              )}

              {canDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(workspace);
                    }}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Workspace
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
            </div>
            <div className="font-bold text-lg text-foreground">{workspace.member_count || 0}</div>
            <div className="text-xs text-muted-foreground font-medium">Members</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <FileText className="h-4 w-4" />
            </div>
            <div className="font-bold text-lg text-foreground">{workspace.project_count || 0}</div>
            <div className="text-xs text-muted-foreground font-medium">Projects</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Activity className="h-4 w-4" />
            </div>
            <div className="font-bold text-lg text-foreground">
              {workspace.last_activity ?
                Math.floor((Date.now() - new Date(workspace.last_activity)) / (1000 * 60 * 60 * 24)) : 0
              }d
            </div>
            <div className="text-xs text-muted-foreground font-medium">Last Active</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
          <div className="flex items-center gap-1 font-medium">
            <Calendar className="h-3 w-3" />
            <span>Created {formatDate(workspace.created_at)}</span>
          </div>

          <Badge
            variant={workspace.status === 'active' ? 'default' : 'secondary'}
            className="text-xs font-semibold"
          >
            {workspace.status || 'active'}
          </Badge>
        </div>

        {/* Storage Usage (if available) */}
        {workspace.storage_used !== undefined && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 font-medium">
              <span>Storage Used</span>
              <span className="text-foreground font-semibold">
                {(workspace.storage_used / 1024 / 1024).toFixed(1)} MB /
                {(workspace.storage_limit / 1024 / 1024 / 1024).toFixed(1)} GB
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300 shadow-sm"
                style={{
                  width: `${Math.min((workspace.storage_used / workspace.storage_limit) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
