import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import LandingPage from '../pages/LandingPage';

// Mock the lazy-loaded sections
jest.mock('../pages/LandingPageSections', () => ({
  FeaturesSection: ({ features }) => <div data-testid="features-section">Features: {features.length}</div>,
  PricingSection: ({ pricingTiers }) => <div data-testid="pricing-section">Pricing: {pricingTiers.length}</div>,
  TestimonialsSection: ({ testimonials }) => <div data-testid="testimonials-section">Testimonials: {testimonials.length}</div>,
  FAQSection: ({ faqs }) => <div data-testid="faq-section">FAQs: {faqs.length}</div>
}));

// Mock useAuth hook
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null
  })
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('LandingPage', () => {
  test('renders hero section', () => {
    renderWithProviders(<LandingPage />);
    
    expect(screen.getByText(/Scholar-AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Advanced AI Research Platform/i)).toBeInTheDocument();
  });

  test('renders main navigation elements', () => {
    renderWithProviders(<LandingPage />);
    
    // Check for key navigation elements
    expect(screen.getByText(/Get Started/i)).toBeInTheDocument();
  });

  test('renders call-to-action buttons', () => {
    renderWithProviders(<LandingPage />);
    
    // Should have CTA buttons
    const ctaButtons = screen.getAllByRole('button');
    expect(ctaButtons.length).toBeGreaterThan(0);
  });

  test('displays pricing information', () => {
    renderWithProviders(<LandingPage />);
    
    // Should mention pricing or plans
    expect(screen.getByText(/Choose the Perfect Plan/i) || screen.getByText(/pricing/i)).toBeInTheDocument();
  });

  test('shows features section', () => {
    renderWithProviders(<LandingPage />);
    
    // Should have features section
    expect(screen.getByText(/Advanced Research Capabilities/i) || screen.getByText(/features/i)).toBeInTheDocument();
  });
});
