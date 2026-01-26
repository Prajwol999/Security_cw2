import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import LoginForm from '../components/auth/LoginForm';

// Mock the useLogin hook
jest.mock('../../hooks/useLoginUserTan', () => ({
  useLogin: () => ({
    mutate: jest.fn(),
    isPending: false
  })
}));

// Mock ReCAPTCHA
jest.mock('react-google-recaptcha', () => {
  return React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      getValue: () => 'mock-recaptcha-token',
      reset: jest.fn()
    }));
    return <div data-testid="recaptcha">ReCAPTCHA Mock</div>;
  });
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('LoginForm Component', () => {
  let wrapper;
  
  beforeEach(() => {
    wrapper = createWrapper();
    // Mock environment variable
    import.meta.env = { VITE_RECAPTCHA_SITE_KEY: 'test-site-key' };
  });

  // Test 25: Basic rendering
  it('renders without crashing', () => {
    render(<LoginForm />, { wrapper });
  });

  // Test 26: Form title and description
  it('displays welcome message and description', () => {
    render(<LoginForm />, { wrapper });
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Continue your journey of making a difference')).toBeInTheDocument();
  });

  // Test 27: Form fields presence
  it('displays email and password input fields', () => {
    render(<LoginForm />, { wrapper });
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  // Test 28: Form labels
  it('displays correct field labels', () => {
    render(<LoginForm />, { wrapper });
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  // Test 29: Remember me checkbox
  it('displays remember me checkbox', () => {
    render(<LoginForm />, { wrapper });
    expect(screen.getByText('Remember me')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  // Test 30: Forgot password link
  it('displays forgot password link', () => {
    render(<LoginForm />, { wrapper });
    const forgotLink = screen.getByText('Forgot password?');
    expect(forgotLink).toBeInTheDocument();
    expect(forgotLink.closest('a')).toHaveAttribute('href', '/forgot-password');
  });

  // Test 31: Sign up link
  it('displays sign up link for new users', () => {
    render(<LoginForm />, { wrapper });
    expect(screen.getByText('New to our community?')).toBeInTheDocument();
    const signupLink = screen.getByText('Join us today');
    expect(signupLink.closest('a')).toHaveAttribute('href', '/signup');
  });

  // Test 32: Email validation
  it('shows email validation error for invalid email', async () => {
    render(<LoginForm />, { wrapper });
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  // Test 33: Password validation
  it('shows password validation error for short password', async () => {
    render(<LoginForm />, { wrapper });
    
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.blur(passwordInput);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  // Test 34: Required field validation
  it('shows required field errors when fields are empty', async () => {
    render(<LoginForm />, { wrapper });
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  // Test 35: ReCAPTCHA presence
  it('displays ReCAPTCHA component', () => {
    render(<LoginForm />, { wrapper });
    expect(screen.getByTestId('recaptcha')).toBeInTheDocument();
  });

  // Test 36: Submit button states
  it('displays correct submit button text', () => {
    render(<LoginForm />, { wrapper });
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  // Test 37: Form icons
  it('displays mail and lock icons in input fields', () => {
    render(<LoginForm />, { wrapper });
    // Icons are rendered as SVG elements, check for their presence
    const emailField = screen.getByPlaceholderText('Enter your email').parentElement;
    const passwordField = screen.getByPlaceholderText('Enter your password').parentElement;
    
    expect(emailField).toContainHTML('svg');
    expect(passwordField).toContainHTML('svg');
  });

  // Test 38: Heart icon in header
  it('displays heart icon in the header', () => {
    render(<LoginForm />, { wrapper });
    const headerSection = screen.getByText('Welcome Back').parentElement;
    expect(headerSection).toContainHTML('svg');
  });

  // Test 39: Form styling classes
  it('applies correct CSS classes for styling', () => {
    render(<LoginForm />, { wrapper });
    const form = screen.getByRole('button', { name: /sign in/i }).closest('form');
    expect(form).toHaveClass('space-y-4');
  });
});

