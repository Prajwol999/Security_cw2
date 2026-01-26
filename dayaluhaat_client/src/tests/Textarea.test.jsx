import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Textarea from '../components/textarea';

describe('Textarea Component', () => {
  // Test 70: Basic rendering
  it('renders without crashing', () => {
    render(<Textarea />);
  });

  // Test 71: Textarea with placeholder
  it('displays placeholder text correctly', () => {
    render(<Textarea placeholder="Enter your message" />);
    expect(screen.getByPlaceholderText('Enter your message')).toBeInTheDocument();
  });

  // Test 72: Textarea value handling
  it('handles value changes correctly', () => {
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test content' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  // Test 73: Textarea with custom props
  it('applies custom props correctly', () => {
    render(<Textarea rows={5} cols={30} data-testid="custom-textarea" />);
    const textarea = screen.getByTestId('custom-textarea');
    expect(textarea).toHaveAttribute('rows', '5');
    expect(textarea).toHaveAttribute('cols', '30');
  });

  // Test 74: Textarea styling
  it('applies correct styling classes', () => {
    render(<Textarea className="custom-textarea" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('custom-textarea');
  });
});


