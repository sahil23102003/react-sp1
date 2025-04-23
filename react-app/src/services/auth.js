// Authentication service
const API_URL = 'http://localhost:3001';

// Login user
export const loginUser = async (username, password) => {
  try {
    // In a real app, this would be a POST request with credentials
    // For this demo, we'll use a GET request to find the user
    const response = await fetch(`${API_URL}/users?username=${username}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const users = await response.json();
    
    // Check if user exists and password matches
    const user = users.find(u => u.username === username);
    
    if (user && user.password === password) {
      // Create a user object without the password
      const { password, ...userWithoutPassword } = user;
      
      // Store user in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      return {
        success: true,
        user: userWithoutPassword
      };
    } else {
      return {
        success: false,
        message: 'Invalid username or password'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'An error occurred during login'
    };
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('currentUser');
  return {
    success: true
  };
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getCurrentUser();
};

// Check if user has a specific role
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

// Check if user is an admin
export const isAdmin = () => {
  return hasRole('admin');
};

// Check if user is a mentor
export const isMentor = () => {
  return hasRole('mentor');
};

// Check if user is an intern
export const isIntern = () => {
  return hasRole('intern');
};