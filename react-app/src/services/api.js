// services/api.js - Complete file with JWT Authentication
const API_URL = 'http://localhost:5000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper function to handle fetch responses
const handleResponse = async (response, successMessage) => {
  if (response.status === 401) {
    // Handle unauthorized (token expired or invalid)
    return {
      status: 401,
      data: null,
      message: 'Unauthorized. Please log in again.'
    };
  }
  
  if (response.status === 404) {
    return {
      status: 404,
      data: null,
      message: 'Resource not found'
    };
  }
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  try {
    const data = await response.json();
    return {
      status: response.status,
      data: data,
      message: successMessage
    };
  } catch (error) {
    // If the response is empty or not valid JSON
    return {
      status: response.status,
      data: null,
      message: successMessage
    };
  }
};

// Login function
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    // If login successful, store the JWT token
    if (response.status === 200 && data.token) {
      localStorage.setItem('jwt_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return {
      status: response.status,
      data: data
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      status: 500,
      data: { success: false, message: 'Network error. Please try again.' }
    };
  }
};

// Logout function - for JWT we just remove the token
export const logout = () => {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user');
  
  return {
    status: 200,
    data: { success: true, message: 'Logged out successfully' }
  };
};

// Check authentication status
export const checkAuthStatus = async () => {
  const token = localStorage.getItem('jwt_token');
  
  // If no token in localStorage, user is not authenticated
  if (!token) {
    return {
      status: 200,
      data: { isAuthenticated: false }
    };
  }
  
  try {
    const response = await fetch(`${API_URL}/api/auth/verify`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    return {
      status: response.status,
      data: data
    };
  } catch (error) {
    console.error('Auth check error:', error);
    return {
      status: 500,
      data: { isAuthenticated: false }
    };
  }
};

// GET - Fetch all interns with JWT authentication
export const fetchInterns = async () => {
  try {
    const response = await fetch(`${API_URL}/api/interns`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...getAuthHeaders()
      }
    });
    
    return await handleResponse(response, 'Interns fetched successfully');
  } catch (error) {
    console.error('Error fetching interns:', error);
    if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
      return {
        status: 503,
        data: [],
        message: 'Cannot connect to the server. Make sure server is running at ' + API_URL
      };
    }
    
    return {
      status: 500,
      data: [],
      message: 'Failed to fetch interns: ' + error.message
    };
  }
};

// GET - Fetch single intern by ID
export const fetchInternById = async (id) => {
  if (!id) {
    return {
      status: 400,
      data: null,
      message: 'Invalid intern ID'
    };
  }
  
  try {
    // First log the URL we're trying to fetch
    const url = `${API_URL}/api/interns/${id}`;
    console.log(`Fetching intern from: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...getAuthHeaders()
      }
    });
    
    return await handleResponse(response, 'Intern fetched successfully');
  } catch (error) {
    console.error('Error fetching intern:', error);
    return {
      status: 500,
      data: null,
      message: 'Failed to fetch intern details'
    };
  }
};

// POST - Add a new intern
export const addIntern = async (internData) => {
  try {
    const response = await fetch(`${API_URL}/api/interns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(internData),
    });
    
    return await handleResponse(response, 'Intern added successfully');
  } catch (error) {
    console.error('Error adding intern:', error);
    return {
      status: 500,
      data: null,
      message: 'Failed to add intern'
    };
  }
};

// PUT - Update an intern
export const updateIntern = async (id, internData) => {
  if (!id) {
    return {
      status: 400,
      data: null,
      message: 'Invalid intern ID'
    };
  }
  
  try {
    const response = await fetch(`${API_URL}/api/interns/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(internData),
    });
    
    return await handleResponse(response, 'Intern updated successfully');
  } catch (error) {
    console.error('Error updating intern:', error);
    return {
      status: 500,
      data: null,
      message: 'Failed to update intern'
    };
  }
};

// DELETE - Delete an intern
export const deleteIntern = async (id) => {
  if (!id) {
    return {
      status: 400,
      data: null,
      message: 'Invalid intern ID'
    };
  }
  
  try {
    const response = await fetch(`${API_URL}/api/interns/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders()
      }
    });
    
    return await handleResponse(response, 'Intern deleted successfully');
  } catch (error) {
    console.error('Error deleting intern:', error);
    return {
      status: 500,
      data: null,
      message: 'Failed to delete intern'
    };
  }
};

// PROJECT API ENDPOINTS

// GET - Fetch all projects
export const fetchProjects = async () => {
  try {
    const response = await fetch(`${API_URL}/api/projects`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...getAuthHeaders()
      }
    });
    
    return await handleResponse(response, 'Projects fetched successfully');
  } catch (error) {
    console.error('Error fetching projects:', error);
    return {
      status: 500,
      data: [],
      message: 'Failed to fetch projects'
    };
  }
};

// GET - Fetch single project by ID
export const fetchProjectById = async (id) => {
  if (!id) {
    return {
      status: 400,
      data: null,
      message: 'Invalid project ID'
    };
  }
  
  try {
    const response = await fetch(`${API_URL}/api/projects/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...getAuthHeaders()
      }
    });
    
    return await handleResponse(response, 'Project fetched successfully');
  } catch (error) {
    console.error('Error fetching project:', error);
    return {
      status: 500,
      data: null,
      message: 'Failed to fetch project details'
    };
  }
};

// POST - Add a new project
export const addProject = async (projectData) => {
  try {
    const response = await fetch(`${API_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(projectData),
    });
    
    return await handleResponse(response, 'Project added successfully');
  } catch (error) {
    console.error('Error adding project:', error);
    return {
      status: 500,
      data: null,
      message: 'Failed to add project'
    };
  }
};

// PUT - Update a project
export const updateProject = async (id, projectData) => {
  if (!id) {
    return {
      status: 400,
      data: null,
      message: 'Invalid project ID'
    };
  }
  
  try {
    const response = await fetch(`${API_URL}/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(projectData),
    });
    
    return await handleResponse(response, 'Project updated successfully');
  } catch (error) {
    console.error('Error updating project:', error);
    return {
      status: 500,
      data: null,
      message: 'Failed to update project'
    };
  }
};

// DELETE - Delete a project
export const deleteProject = async (id) => {
  if (!id) {
    return {
      status: 400,
      data: null,
      message: 'Invalid project ID'
    };
  }
  
  try {
    const response = await fetch(`${API_URL}/api/projects/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders()
      }
    });
    
    return await handleResponse(response, 'Project deleted successfully');
  } catch (error) {
    console.error('Error deleting project:', error);
    return {
      status: 500,
      data: null,
      message: 'Failed to delete project'
    };
  }
};

// Assign an intern to a project
export const assignInternToProject = async (internId, projectId) => {
  if (!internId || !projectId) {
    return {
      status: 400,
      message: 'Invalid intern or project ID'
    };
  }
  
  try {
    const response = await fetch(`${API_URL}/api/projects/${projectId}/assign/${internId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    
    return await handleResponse(response, 'Intern assigned to project successfully');
  } catch (error) {
    console.error('Error assigning intern to project:', error);
    return {
      status: 500,
      message: 'Failed to assign intern to project'
    };
  }
};

// Remove an intern from a project
export const removeInternFromProject = async (internId, projectId) => {
  if (!internId || !projectId) {
    return {
      status: 400,
      message: 'Invalid intern or project ID'
    };
  }
  
  try {
    // Debug log to see what's being passed
    console.log("Removing intern:", internId, "from project:", projectId);
    
    const response = await fetch(`${API_URL}/api/projects/${projectId}/assign/${internId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders()
      }
    });
    
    return await handleResponse(response, 'Intern removed from project successfully');
  } catch (error) {
    console.error('Error removing intern from project:', error);
    return {
      status: 500,
      message: 'Failed to remove intern from project'
    };
  }
};