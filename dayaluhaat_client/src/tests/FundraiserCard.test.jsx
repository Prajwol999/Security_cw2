import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import FundraiserCard from '../components/FundraiserCard';

const FundraiserCardWithRouter = ({ ...props }) => (
  <BrowserRouter>
    <FundraiserCard {...props} />
  </BrowserRouter>
);

describe('FundraiserCard Component', () => {
  const mockFundraiser = {
    id: '1',
    title: 'Help Build School',
    description: 'Building a school for underprivileged children',
    targetAmount: 10000,
    currentAmount: 5000,
    image: 'test-image.jpg'
  };

  // Test 75: Basic rendering
  it('renders without crashing', () => {
    render(<FundraiserCardWithRouter fundraiser={mockFundraiser} />);
  });

  // Test 76: Fundraiser title display
  it('displays fundraiser title correctly', () => {
    render(<FundraiserCardWithRouter fundraiser={mockFundraiser} />);
    expect(screen.getByText('Help Build School')).toBeInTheDocument();
  });

  // Test 77: Fundraiser description display
  it('displays fundraiser description correctly', () => {
    render(<FundraiserCardWithRouter fundraiser={mockFundraiser} />);
    expect(screen.getByText('Building a school for underprivileged children')).toBeInTheDocument();
  });

  // Test 78: Progress calculation
  it('calculates and displays progress correctly', () => {
    render(<FundraiserCardWithRouter fundraiser={mockFundraiser} />);
    // 5000/10000 = 50% progress
    const progressElement = screen.getByText(/50%/) || screen.getByText(/5000/) || screen.getByText(/10000/);
    expect(progressElement).toBeInTheDocument();
  });

  // Test 79: Card styling and structure
  it('applies correct card styling and structure', () => {
    render(<FundraiserCardWithRouter fundraiser={mockFundraiser} />);
    const cardElement = screen.getByText('Help Build School').closest('div');
    expect(cardElement).toHaveClass(); // Should have styling classes
  });
});


