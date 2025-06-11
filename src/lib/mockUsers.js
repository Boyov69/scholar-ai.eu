// Mock user data for development testing

export const mockUsers = {
  'test@example.com': {
    id: 'user-1',
    email: 'test@example.com',
    user_metadata: {
      full_name: 'Test User',
      role: 'student'
    },
    subscription: {
      tier: 'free',
      status: 'active'
    }
  },
  
  'student@localhost.dev': {
    id: 'user-2',
    email: 'student@localhost.dev',
    user_metadata: {
      full_name: 'Alex Student',
      role: 'student',
      institution: 'University of Scholar AI',
      department: 'Computer Science'
    },
    subscription: {
      tier: 'free',
      status: 'active'
    }
  },
  
  'researcher@localhost.dev': {
    id: 'user-3',
    email: 'researcher@localhost.dev',
    user_metadata: {
      full_name: 'Dr. Sarah Researcher',
      role: 'researcher',
      institution: 'Scholar AI Research Institute',
      department: 'Artificial Intelligence'
    },
    subscription: {
      tier: 'advanced_ai',
      status: 'active'
    }
  },
  
  'professor@localhost.dev': {
    id: 'user-4',
    email: 'professor@localhost.dev',
    user_metadata: {
      full_name: 'Prof. Michael Academic',
      role: 'professor',
      institution: 'European University',
      department: 'Data Science'
    },
    subscription: {
      tier: 'ultra_intelligent',
      status: 'active'
    }
  },
  
  'admin@localhost.dev': {
    id: 'user-5',
    email: 'admin@localhost.dev',
    user_metadata: {
      full_name: 'Admin User',
      role: 'professor',
      institution: 'Scholar AI',
      department: 'Administration'
    },
    subscription: {
      tier: 'phd_level',
      status: 'active'
    }
  }
};

// Get mock user by email
export const getMockUser = (email) => {
  return mockUsers[email] || null;
};

// Check if email exists in mock users
export const isValidMockUser = (email) => {
  return email in mockUsers;
};

// Get all mock user emails for testing
export const getMockUserEmails = () => {
  return Object.keys(mockUsers);
};

export default mockUsers;
