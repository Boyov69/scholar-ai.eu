// Jest setup file
import '@testing-library/jest-dom';

// Mock environment variables
process.env.VITE_DEV_MODE = 'true';
process.env.VITE_MOCK_PAYMENTS = 'true';
process.env.VITE_MOCK_AI_RESPONSES = 'true';

// Mock Supabase
jest.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({ data: [], error: null }))
          }))
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }))
  },
  db: {
    getUserWorkspaces: jest.fn(() => Promise.resolve({ data: [], error: null })),
    createWorkspace: jest.fn(() => Promise.resolve({ data: {}, error: null })),
    getUserResearchQueries: jest.fn(() => Promise.resolve({ data: [], error: null })),
    createResearchQuery: jest.fn(() => Promise.resolve({ data: {}, error: null }))
  }
}));

// Mock React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' })
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    section: 'section',
    h1: 'h1',
    h2: 'h2',
    p: 'p'
  },
  AnimatePresence: ({ children }) => children
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};
