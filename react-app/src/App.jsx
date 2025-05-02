// App.jsx - Updated for JWT Authentication
import { useState, useEffect } from 'react';
import InternDirectory from './components/InternDirectory';
import Login from './components/Login';
import { checkAuthStatus, logout } from './services/api';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      // Try to get user from localStorage first for quick rendering
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        } catch (e) {
          console.error('Error parsing user data from localStorage', e);
        }
      }
      
      // Then verify the token with the server
      const response = await checkAuthStatus();
      
      if (response.status === 200 && response.data.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        setAuthError(null);
      } else {
        // If server check fails, log the user out
        setIsAuthenticated(false);
        setUser(null);
        if (response.data && response.data.message) {
          setAuthError(response.data.message);
        }
        // Clear storage just to be safe
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setAuthError(null);
  };

  const handleLogout = () => {
    logout(); // This just removes tokens from localStorage
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="container loading-container">
        <div className="loading-spinner"></div>
        <p>Loading application...</p>
      </div>
    );
  }

  return (
    <div className="container">
      {isAuthenticated ? (
        <>
          <div className="header">
            <h1>Intern Portal</h1>
            <div className="user-info">
              <span>Welcome, {user?.username || 'User'}</span>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
          
          {/* Using the InternDirectory component that handles API calls */}
          <InternDirectory />
        </>
      ) : (
        <>
          {authError && (
            <div className="auth-error-banner">
              {authError}
            </div>
          )}
          <Login onLoginSuccess={handleLoginSuccess} />
        </>
      )}
    </div>
  );
}

export default App;