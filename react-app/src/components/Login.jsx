// components/Login.jsx - For JWT Authentication
import { useState } from 'react';
import { login } from '../services/api';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
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
      const response = await login(credentials);
      
      if (response.status === 200 && response.data.success) {
        // Call the parent component's callback with user data
        if (onLoginSuccess) {
          onLoginSuccess(response.data.user);
        }
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Base64 encode the default credentials for demo purposes
  const encodeCredentials = () => {
    // This is just for display, not actual authentication
    const credStr = JSON.stringify(credentials);
    return btoa(credStr);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Intern Portal Login</h2>
        
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              className="login-input"
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="login-input"
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {/* <div className="login-info">
          <p>Use these credentials for testing:</p>
          <p><strong>Username:</strong> admin</p>
          <p><strong>Password:</strong> password123</p>
          <p className="encoded-text">
            <strong>Base64 Encoded:</strong> {credentials.username && credentials.password ? encodeCredentials() : 'Enter credentials above'}
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Login;