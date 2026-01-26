import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Header from '../components/header';

// Mock the logo import
jest.mock('../assets/images/logo.png', () => 'test-logo.png');

const HeaderWithRouter = () => (
  <BrowserRouter>
    <Header />
  </BrowserRouter>
);

describe('Header Component', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks();
  });

  // Test 1: Basic rendering
  it('renders without crashing', () => {
    render(<HeaderWithRouter />);
  });

  // Test 2: Logo and brand name display
  it('displays the HopeCare logo and brand name', () => {
    render(<HeaderWithRouter />);
    expect(screen.getByText('HopeCare')).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  // Test 3: Desktop navigation links
  it('displays desktop navigation links', () => {
    render(<HeaderWithRouter />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Contact us')).toBeInTheDocument();
  });

  // Test 4: Authentication buttons
  it('displays authentication buttons', () => {
    render(<HeaderWithRouter />);
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  // Test 5: Mobile menu toggle functionality
  it('toggles mobile menu when hamburger button is clicked', async () => {
    render(<HeaderWithRouter />);
    
    // Find the mobile menu button
    const menuButton = screen.getByRole('button');
    
    // Initially, mobile menu should be closed
    const mobileNav = screen.getByText('Home').closest('div');
    expect(mobileNav).toHaveClass('max-h-0');
    
    // Click to open menu
    fireEvent.click(menuButton);
    
    await waitFor(() => {
      expect(mobileNav).toHaveClass('max-h-96');
    });
  });

  // Test 6: Mobile menu displays correct links
  it('displays mobile navigation links when menu is open', async () => {
    render(<HeaderWithRouter />);
    
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);
    
    await waitFor(() => {
      // Check if mobile navigation links are present
      const homeLinks = screen.getAllByText('Home');
      const servicesLinks = screen.getAllByText('Services');
      expect(homeLinks.length).toBeGreaterThan(1); // Desktop + Mobile
      expect(servicesLinks.length).toBeGreaterThan(1); // Desktop + Mobile
    });
  });

  // Test 7: Logo link navigation
  it('logo links to home page', () => {
    render(<HeaderWithRouter />);
    const logoLink = screen.getByText('HopeCare').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  // Test 8: Navigation links have correct hrefs
  it('navigation links have correct href attributes', () => {
    render(<HeaderWithRouter />);
    
    const homeLink = screen.getAllByText('Home')[0].closest('a');
    const contactLink = screen.getByText('Contact us').closest('a');
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  // Test 9: Auth buttons have correct links
  it('auth buttons link to correct pages', () => {
    render(<HeaderWithRouter />);
    
    const loginButton = screen.getAllByText('Log in')[0].closest('a');
    const signupButton = screen.getAllByText('Sign up')[0].closest('a');
    
    expect(loginButton).toHaveAttribute('href', '/login');
    expect(signupButton).toHaveAttribute('href', '/signup');
  });

  // Test 10: Header has sticky positioning
  it('header has sticky positioning classes', () => {
    render(<HeaderWithRouter />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky', 'top-0', 'z-50');
  });
});

