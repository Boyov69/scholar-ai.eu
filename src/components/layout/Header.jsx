import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { 
  Brain, 
  User, 
  Settings, 
  LogOut, 
  Search, 
  BookOpen, 
  Users, 
  CreditCard,
  Menu
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut, isAuthenticated } = useAuth();
  const { tier, isActive } = useSubscription();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const getTierBadgeColor = (tierName) => {
    switch (tierName) {
      case 'student': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'research': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'institution': return 'bg-gold-500/20 text-gold-400 border-gold-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <header className="glass-strong border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg ice-gradient animate-glow">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold ice-gradient-text">
              Scholar-AI
            </span>
          </Link>

          {/* Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => {
                  console.log('Desktop nav: Dashboard clicked');
                  navigate('/dashboard');
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  isActivePath('/dashboard')
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <Search className="h-4 w-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => {
                  console.log('Desktop nav: Research clicked');
                  navigate('/research');
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  isActivePath('/research')
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Research</span>
              </button>

              <button
                onClick={() => {
                  console.log('Desktop nav: Citations clicked');
                  navigate('/citations');
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  isActivePath('/citations')
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Citations</span>
              </button>

              <button
                onClick={() => {
                  console.log('Desktop nav: Workspaces clicked');
                  navigate('/workspaces');
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  isActivePath('/workspaces') || isActivePath('/workspace')
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Workspaces</span>
              </button>
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/auth')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/auth?mode=signup')}
                  className="ice-gradient hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Subscription Badge */}
                {tier && (
                  <Badge 
                    variant="outline" 
                    className={`${getTierBadgeColor(tier)} capitalize`}
                  >
                    {tier}
                  </Badge>
                )}

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage 
                          src={profile?.avatar_url} 
                          alt={profile?.full_name || user?.email} 
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent 
                    className="w-56 glass-strong border-border/50" 
                    align="end"
                  >
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-sm">
                          {profile?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    
                    <DropdownMenuSeparator className="bg-border/50" />
                    
                    <DropdownMenuItem 
                      onClick={() => navigate('/settings')}
                      className="cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => navigate('/settings')}
                      className="cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => navigate('/pricing')}
                      className="cursor-pointer"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator className="bg-border/50" />
                    
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu */}
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent 
                      className="w-48 glass-strong border-border/50" 
                      align="end"
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          console.log('Mobile nav: Dashboard clicked');
                          navigate('/dashboard');
                        }}
                        className="cursor-pointer"
                      >
                        <Search className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          console.log('Mobile nav: Research clicked');
                          navigate('/research');
                        }}
                        className="cursor-pointer"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>Research</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          console.log('Mobile nav: Citations clicked');
                          navigate('/citations');
                        }}
                        className="cursor-pointer"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>Citations</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          console.log('Mobile nav: Workspaces clicked');
                          navigate('/workspaces');
                        }}
                        className="cursor-pointer"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        <span>Workspaces</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

