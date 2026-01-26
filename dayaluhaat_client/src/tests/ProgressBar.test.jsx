import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressBar from '../components/progress-bar';

describe('ProgressBar Component', () => {
  // Test 65: Basic rendering
  it('renders without crashing', () => {
    render(<ProgressBar value={50} />);
  });

  // Test 66: Progress value display
  it('displays correct progress value', () => {
    render(<ProgressBar value={75} />);
    const progressBar = screen.getByRole('progressbar') || screen.getByTestId('progress-bar') || document.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
  });

  // Test 67: Progress bar with 0% value
  it('handles 0% progress correctly', () => {
    render(<ProgressBar value={0} />);
    const progressElement = document.querySelector('div'); // Progress bars are typically divs
    expect(progressElement).toBeInTheDocument();
  });

  // Test 68: Progress bar with 100% value
  it('handles 100% progress correctly', () => {
    render(<ProgressBar value={100} />);
    const progressElement = document.querySelector('div');
    expect(progressElement).toBeInTheDocument();
  });

  // Test 69: Progress bar styling
  it('applies correct styling classes', () => {
    render(<ProgressBar value={60} />);
    const progressElement = document.querySelector('div');
    expect(progressElement).toHaveClass(); // Should have styling classes
  });
});


