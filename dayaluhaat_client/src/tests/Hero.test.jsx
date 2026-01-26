import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Hero from '../components/hero';

const HeroWithRouter = () => (
  <BrowserRouter>
    <Hero />
  </BrowserRouter>
);

describe('Hero Component', () => {
  // Test 45: Basic rendering
  it('renders without crashing', () => {
    render(<HeroWithRouter />);
  });

  // Test 46: Hero section structure
  it('has proper hero section structure', () => {
    render(<HeroWithRouter />);
    // Hero sections typically have headings
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
  });

  // Test 47: Call-to-action buttons
  it('contains call-to-action buttons', () => {
    render(<HeroWithRouter />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  // Test 48: Hero content text
  it('displays hero content and messaging', () => {
    render(<HeroWithRouter />);
    // Hero sections typically have descriptive text
    const heroSection = screen.getByRole('heading').closest('section') || screen.getByRole('heading').closest('div');
    expect(heroSection).toBeInTheDocument();
  });

  // Test 49: Hero styling
  it('applies hero styling classes', () => {
    render(<HeroWithRouter />);
    const heroElement = screen.getByRole('heading').closest('div');
    expect(heroElement).toHaveClass(); // Should have styling classes
  });
});


