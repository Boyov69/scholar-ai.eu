import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Brain, 
  Mail, 
  Lock, 
  User, 
  Building, 
  Eye, 
  EyeOff, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { userRoles } from '../../lib/config';

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp, signIn, resetPassword, loading, error } = useAuth();
  
  const [mode, setMode] = useState(searchParams.get('mode') || 'signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    institution: '',
    department: '',
    role: 'student'
  });

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (mode === 'signup') {
      if (!formData.fullName) {
        errors.fullName = 'Full name is required';
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.role) {
        errors.role = 'Please select your role';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (mode === 'signup') {
        const userData = {
          fullName: formData.fullName,
          institution: formData.institution,
          department: formData.department,
          role: formData.role
        };
        
        const { error } = await signUp(formData.email, formData.password, userData);
        
        if (!error) {
          // Show success message and redirect
          navigate('/dashboard?welcome=true');
        }
      } else if (mode === 'signin') {
        console.log('🧪 Attempting sign in with:', formData.email);
        const { data, error } = await signIn(formData.email, formData.password);

        console.log('🧪 Sign in result:', { data, error });

        if (!error && data) {
          console.log('🧪 Sign in successful, redirecting to dashboard');
          navigate('/dashboard');
        } else {
          console.error('🧪 Sign in failed:', error);
        }
      } else if (mode === 'reset') {
        const { error } = await resetPassword(formData.email);
        
        if (!error) {
          setResetEmailSent(true);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setFormErrors({});
    setResetEmailSent(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-xl ice-gradient animate-glow">
                <Brain className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold ice-gradient-text mb-2">
              Welcome to Scholar-AI
            </h1>
            <p className="text-muted-foreground">
              {mode === 'signup' && 'Create your account to get started'}
              {mode === 'signin' && 'Sign in to your account'}
              {mode === 'reset' && 'Reset your password'}
            </p>
          </div>

          <Card className="glass-strong">
            <CardContent className="pt-6">
              {mode === 'reset' && resetEmailSent ? (
                <div className="text-center space-y-4">
                  <div className="p-3 rounded-full bg-green-500/20 w-fit mx-auto">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Check your email</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      We've sent a password reset link to {formData.email}
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => switchMode('signin')}
                      className="w-full"
                    >
                      Back to Sign In
                    </Button>
                  </div>
                </div>
              ) : (
                <Tabs value={mode} onValueChange={switchMode}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  {error && (
                    <Alert className="mb-6 border-destructive/50 bg-destructive/10">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <TabsContent value="signin" className="space-y-4 mt-0">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="pl-10"
                            disabled={loading}
                          />
                        </div>
                        {formErrors.email && (
                          <p className="text-sm text-destructive">{formErrors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className="pl-10 pr-10"
                            disabled={loading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                        {formErrors.password && (
                          <p className="text-sm text-destructive">{formErrors.password}</p>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="link"
                          className="px-0 text-sm"
                          onClick={() => switchMode('reset')}
                        >
                          Forgot password?
                        </Button>
                      </div>

                      <Button
                        type="submit"
                        className="w-full ice-gradient hover:opacity-90"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="mr-2 h-4 w-4" />
                        )}
                        Sign In
                      </Button>


                    </TabsContent>

                    <TabsContent value="signup" className="space-y-4 mt-0">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className="pl-10"
                            disabled={loading}
                          />
                        </div>
                        {formErrors.fullName && (
                          <p className="text-sm text-destructive">{formErrors.fullName}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupEmail">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signupEmail"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="pl-10"
                            disabled={loading}
                          />
                        </div>
                        {formErrors.email && (
                          <p className="text-sm text-destructive">{formErrors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select 
                          value={formData.role} 
                          onValueChange={(value) => handleInputChange('role', value)}
                          disabled={loading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="researcher">Researcher</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.role && (
                          <p className="text-sm text-destructive">{formErrors.role}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="institution">Institution (Optional)</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="institution"
                            type="text"
                            placeholder="Your university or organization"
                            value={formData.institution}
                            onChange={(e) => handleInputChange('institution', e.target.value)}
                            className="pl-10"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupPassword">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signupPassword"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className="pl-10 pr-10"
                            disabled={loading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                        {formErrors.password && (
                          <p className="text-sm text-destructive">{formErrors.password}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className="pl-10 pr-10"
                            disabled={loading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                        {formErrors.confirmPassword && (
                          <p className="text-sm text-destructive">{formErrors.confirmPassword}</p>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full ice-gradient hover:opacity-90"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="mr-2 h-4 w-4" />
                        )}
                        Create Account
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        By creating an account, you agree to our{' '}
                        <a href="#" className="text-primary hover:underline">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </p>
                    </TabsContent>

                    {mode === 'reset' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="resetEmail">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="resetEmail"
                              type="email"
                              placeholder="Enter your email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="pl-10"
                              disabled={loading}
                            />
                          </div>
                          {formErrors.email && (
                            <p className="text-sm text-destructive">{formErrors.email}</p>
                          )}
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full ice-gradient hover:opacity-90"
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Mail className="mr-2 h-4 w-4" />
                          )}
                          Send Reset Link
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => switchMode('signin')}
                        >
                          Back to Sign In
                        </Button>
                      </div>
                    )}
                  </form>
                </Tabs>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Need help?{' '}
              <a href="mailto:support@scholar-ai.com" className="text-primary hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;

