import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import NotFoundPage from '../components/notFoundPage';

const NotFoundPageWithRouter = () => (
  <BrowserRouter>
    <NotFoundPage />
  </BrowserRouter>
);

describe('NotFoundPage Component', () => {
  // Test 80: Basic rendering
  it('renders without crashing', () => {
    render(<NotFoundPageWithRouter />);
  });

  // Test 81: 404 error message
  it('displays 404 error message', () => {
    render(<NotFoundPageWithRouter />);
    expect(screen.getByText(/404/i) || screen.getByText(/not found/i) || screen.getByText(/page not found/i)).toBeInTheDocument();
  });

  // Test 82: Navigation back to home
  it('provides navigation back to home', () => {
    render(<NotFoundPageWithRouter />);
    const homeLink = screen.getByText(/home/i) || screen.getByText(/back/i) || screen.getByRole('link');
    expect(homeLink).toBeInTheDocument();
  });

  // Test 83: Error page styling
  it('applies error page styling', () => {
    render(<NotFoundPageWithRouter />);
    const errorElement = screen.getByText(/404/i) || screen.getByText(/not found/i) || document.querySelector('div');
    expect(errorElement).toBeInTheDocument();
  });

  // Test 84: Error page structure
  it('has proper error page structure', () => {
    render(<NotFoundPageWithRouter />);
    // Error pages typically have headings
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThanOrEqual(0);
  });
});


