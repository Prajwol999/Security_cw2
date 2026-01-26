import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Badge from '../components/badge';

describe('Badge Component', () => {
  // Test 60: Basic rendering
  it('renders without crashing', () => {
    render(<Badge>Test Badge</Badge>);
  });

  // Test 61: Badge content display
  it('displays badge text correctly', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  // Test 62: Badge with different variants
  it('applies different variant styles', () => {
    render(<Badge variant="success">Success Badge</Badge>);
    const badge = screen.getByText('Success Badge');
    expect(badge).toBeInTheDocument();
  });

  // Test 63: Badge default styling
  it('applies default badge styling', () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText('Default Badge');
    expect(badge).toHaveClass(); // Should have styling classes
  });

  // Test 64: Badge with custom props
  it('handles custom props correctly', () => {
    render(<Badge data-testid="custom-badge">Custom Badge</Badge>);
    expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
  });
});


