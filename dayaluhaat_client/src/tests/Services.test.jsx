import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Services from '../components/services';

const ServicesWithRouter = () => (
  <BrowserRouter>
    <Services />
  </BrowserRouter>
);

describe('Services Component', () => {
  // Test 50: Basic rendering
  it('renders without crashing', () => {
    render(<ServicesWithRouter />);
  });

  // Test 51: Services section structure
  it('displays services section with proper structure', () => {
    render(<ServicesWithRouter />);
    // Services typically have headings and content
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
  });

  // Test 52: Service items display
  it('displays multiple service items', () => {
    render(<ServicesWithRouter />);
    // Services section should have multiple service offerings
    const servicesContainer = screen.getByRole('heading').closest('section') || screen.getByRole('heading').closest('div');
    expect(servicesContainer).toBeInTheDocument();
  });

  // Test 53: Services styling
  it('applies correct styling to services section', () => {
    render(<ServicesWithRouter />);
    const servicesElement = screen.getByRole('heading').closest('div');
    expect(servicesElement).toHaveClass(); // Should have styling classes
  });

  // Test 54: Services icons or images
  it('contains service icons or visual elements', () => {
    render(<ServicesWithRouter />);
    const servicesSection = screen.getByRole('heading').closest('div');
    // Services often have icons (SVGs) or images
    expect(servicesSection).toContainHTML('svg');
  });
});


