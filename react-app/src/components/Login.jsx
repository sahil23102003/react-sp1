import { useState } from 'react';
import { loginUser } from '../services/auth';
import './Login.css';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await loginUser(credentials.username, credentials.password);
      
      if (response.success) {
        onLogin(response.user);
      } else {
        setError(response.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-header">
          <h1>Intern Portal</h1>
          <p>Sign in to access your account</p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Test accounts:</p>
          <ul className="test-accounts">
            <li><strong>Admin:</strong> username: admin, password: admin123</li>
            <li><strong>Mentor:</strong> username: mentor1, password: mentor123</li>
            <li><strong>Intern:</strong> username: alex, password: intern123</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;