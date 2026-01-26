import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Buttons from '../components/buttons';

describe('Buttons Component', () => {
  // Test 11: Basic rendering
  it('renders without crashing', () => {
    render(<Buttons>Test Button</Buttons>);
  });

  // Test 12: Button text content
  it('displays the correct text content', () => {
    render(<Buttons>Click Me</Buttons>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  // Test 13: Default variant styling
  it('applies primary variant styling by default', () => {
    render(<Buttons>Primary Button</Buttons>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blood-500', 'hover:bg-blood-600', 'text-white');
  });

  // Test 14: Secondary variant styling
  it('applies secondary variant styling correctly', () => {
    render(<Buttons variant="secondary">Secondary Button</Buttons>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-800', 'hover:bg-gray-700', 'text-white');
  });

  // Test 15: Outline variant styling
  it('applies outline variant styling correctly', () => {
    render(<Buttons variant="outline">Outline Button</Buttons>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border', 'border-gray-300', 'text-gray-700', 'bg-white');
  });

  // Test 16: Ghost variant styling
  it('applies ghost variant styling correctly', () => {
    render(<Buttons variant="ghost">Ghost Button</Buttons>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-gray-700', 'hover:text-blood-600', 'hover:bg-blood-50');
  });

  // Test 17: Small size styling
  it('applies small size styling correctly', () => {
    render(<Buttons size="small">Small Button</Buttons>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-4', 'py-2', 'text-sm');
  });

  // Test 18: Medium size styling (default)
  it('applies medium size styling by default', () => {
    render(<Buttons>Medium Button</Buttons>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-base');
  });

  // Test 19: Large size styling
  it('applies large size styling correctly', () => {
    render(<Buttons size="large">Large Button</Buttons>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-8', 'py-4', 'text-lg');
  });

  // Test 20: Click event handling
  it('handles click events correctly', () => {
    const handleClick = jest.fn();
    render(<Buttons onClick={handleClick}>Clickable Button</Buttons>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test 21: Disabled state
  it('applies disabled styling and prevents clicks when disabled', () => {
    const handleClick = jest.fn();
    render(<Buttons disabled onClick={handleClick}>Disabled Button</Buttons>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Test 22: Custom className
  it('applies custom className correctly', () => {
    render(<Buttons className="custom-class">Custom Button</Buttons>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  // Test 23: Additional props
  it('passes through additional props correctly', () => {
    render(<Buttons data-testid="custom-button" aria-label="Custom Label">Props Button</Buttons>);
    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom Label');
  });

  // Test 24: Base classes are always applied
  it('always applies base classes regardless of variant', () => {
    render(<Buttons variant="ghost">Base Classes Button</Buttons>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('font-medium', 'rounded-full', 'transition-all', 'duration-300');
  });
});


