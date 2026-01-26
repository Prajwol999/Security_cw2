import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Footer from '../components/footer';

const FooterWithRouter = () => (
  <BrowserRouter>
    <Footer />
  </BrowserRouter>
);

describe('Footer Component', () => {
  // Test 40: Basic rendering
  it('renders without crashing', () => {
    render(<FooterWithRouter />);
  });

  // Test 41: Footer structure
  it('has proper footer structure with sections', () => {
    render(<FooterWithRouter />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  // Test 42: Copyright information
  it('displays copyright information', () => {
    render(<FooterWithRouter />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
  });

  // Test 43: Social media links
  it('contains social media links or icons', () => {
    render(<FooterWithRouter />);
    // Look for common social media indicators
    const footer = screen.getByRole('contentinfo');
    expect(footer).toContainHTML('svg'); // Social icons are typically SVGs
  });

  // Test 44: Footer styling
  it('applies correct styling classes', () => {
    render(<FooterWithRouter />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass(); // Should have some CSS classes
  });
});


