import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../components/card';

describe('Card Component', () => {
  // Test 55: Basic rendering
  it('renders without crashing', () => {
    render(<Card>Test Content</Card>);
  });

  // Test 56: Card content display
  it('displays children content correctly', () => {
    render(<Card>Test Card Content</Card>);
    expect(screen.getByText('Test Card Content')).toBeInTheDocument();
  });

  // Test 57: Card with custom className
  it('applies custom className when provided', () => {
    render(<Card className="custom-card">Card Content</Card>);
    const card = screen.getByText('Card Content').closest('div');
    expect(card).toHaveClass('custom-card');
  });

  // Test 58: Card default styling
  it('applies default card styling classes', () => {
    render(<Card>Styled Card</Card>);
    const card = screen.getByText('Styled Card').closest('div');
    expect(card).toHaveClass(); // Should have default styling
  });

  // Test 59: Card with multiple children
  it('renders multiple children elements', () => {
    render(
      <Card>
        <h2>Card Title</h2>
        <p>Card Description</p>
      </Card>
    );
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
  });
});


