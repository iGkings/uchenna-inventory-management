import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import FormField from '../../components/FormField/FormField';
import { BRAND } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import './Login.css';

export const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleFillDemo = () => {
    setEmail('demo@igkings.com');
    setPassword('Demo@12345');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      toast.success('Signed in successfully. Welcome back, Uchenna!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-root">
      <div className="login-page-card">
        <div className="login-brand-header">
          <img
            src={BRAND.logoUrl}
            alt={BRAND.name}
            className="login-brand-logo"
          />
          <h1 className="login-title">Inventory Portal</h1>
          <p className="login-subtitle">
            Sign in to manage inventory, categories, and stock movements.
          </p>
        </div>

        {error && (
          <div className="login-error-banner" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <FormField
            label="Email Address"
            name="email"
            required
            prefix={<Mail size={16} />}
          >
            <input
              type="email"
              className="input has-prefix"
              placeholder="name@igkings.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              autoComplete="email"
              required
            />
          </FormField>

          <FormField
            label="Password"
            name="password"
            required
            prefix={<Lock size={16} />}
            suffix={
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          >
            <input
              type={showPassword ? 'text' : 'password'}
              className="input has-prefix has-suffix"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              autoComplete="current-password"
              required
            />
          </FormField>

          <button
            type="submit"
            className="btn btn-primary login-submit-btn"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="demo-access-box">
          <div className="demo-access-header">
            <span className="demo-access-title">
              <Sparkles size={14} color="#FF941F" />
              Demo Credentials
            </span>
          </div>
          <div className="demo-credentials-text">
            <div>Email: <strong>demo@igkings.com</strong></div>
            <div>Password: <strong>Demo@12345</strong></div>
          </div>
          <button
            type="button"
            className="btn-fill-demo"
            onClick={handleFillDemo}
          >
            One-Click Autofill Demo Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
