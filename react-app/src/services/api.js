// API service with JSON Server
const API_URL = 'http://localhost:3001';

// Helper function to handle fetch responses
const handleResponse = async (response, successMessage) => {
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

// GET - Fetch all interns with better error handling
export const fetchInterns = async () => {
  try {
    // First check if we can connect to the server at all
    const response = await fetch(`${API_URL}/interns`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    return await handleResponse(response, 'Interns fetched successfully');
  } catch (error) {
    console.error('Error fetching interns:', error);
    // Check if it's a connection error
    if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
      return {
        status: 503,
        data: [],
        message: 'Cannot connect to the server. Make sure JSON Server is running at ' + API_URL
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
    const url = `${API_URL}/interns/${id}`;
    console.log(`Fetching intern from: ${url}`);
    
    // Check if we can access the interns list first
    const listResponse = await fetch(`${API_URL}/interns`);
    
    if (!listResponse.ok) {
      console.error('Could not connect to interns endpoint');
      return {
        status: 503,
        data: null,
        message: 'Cannot connect to the server. Make sure JSON Server is running.'
      };
    }
    
    // Get all interns and find the one with matching ID
    const interns = await listResponse.json();
    console.log(interns);
    
    const intern = interns.find(intern => intern.id === id);
    
    if (!intern) {
      console.error(`Intern with ID ${id} not found in the database`);
      return {
        status: 404,
        data: null,
        message: 'Intern not found'
      };
    }
    
    return {
      status: 200,
      data: intern,
      message: 'Intern fetched successfully'
    };
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
    const response = await fetch(`${API_URL}/interns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(internData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      status: 201,
      data: data,
      message: 'Intern added successfully'
    };
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
    const response = await fetch(`${API_URL}/interns/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(internData),
    });
    
    if (response.status === 404) {
      return {
        status: 404,
        data: null,
        message: 'Intern not found'
      };
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      status: 200,
      data: data,
      message: 'Intern updated successfully'
    };
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
    const response = await fetch(`${API_URL}/interns/${id}`, {
      method: 'DELETE',
    });
    
    if (response.status === 404) {
      return {
        status: 404,
        data: null,
        message: 'Intern not found'
      };
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return {
      status: 200,
      data: null,
      message: 'Intern deleted successfully'
    };
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
    // Check if the endpoint exists by fetching with HEAD first
    const checkResponse = await fetch(`${API_URL}/projects`, { 
      method: 'HEAD',
      headers: {
        'Accept': 'application/json'
      }
    }).catch(() => ({ ok: false }));
    
    if (!checkResponse.ok) {
      console.warn('Projects endpoint may not exist. Creating a placeholder response.');
      // Return an empty array if the endpoint doesn't exist
      return {
        status: 200,
        data: [],
        message: 'No projects found. The projects endpoint may not exist in your JSON server.'
      };
    }
    
    const response = await fetch(`${API_URL}/projects`);
    return await handleResponse(response, 'Projects fetched successfully');
  } catch (error) {
    console.error('Error fetching projects:', error);
    return {
      status: 500,
      data: [],
      message: 'Failed to fetch projects. Make sure your JSON server is configured to handle projects.'
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
    const response = await fetch(`${API_URL}/projects/${id}`);
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
    // First check if the endpoint exists
    const checkResponse = await fetch(`${API_URL}/projects`, { 
      method: 'HEAD' 
    }).catch(() => ({ ok: false }));
    
    if (!checkResponse.ok) {
      console.error('Projects endpoint does not exist');
      return {
        status: 404,
        data: null,
        message: 'Projects endpoint not found. Make sure your JSON server is configured with a "projects" route.'
      };
    }
    
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    
    return await handleResponse(response, 'Project added successfully');
  } catch (error) {
    console.error('Error adding project:', error);
    return {
      status: 500,
      data: null,
      message: 'Failed to add project: ' + error.message
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
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    
    if (response.status === 404) {
      return {
        status: 404,
        data: null,
        message: 'Project not found'
      };
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      status: 200,
      data: data,
      message: 'Project updated successfully'
    };
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
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
    });
    
    if (response.status === 404) {
      return {
        status: 404,
        data: null,
        message: 'Project not found'
      };
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return {
      status: 200,
      data: null,
      message: 'Project deleted successfully'
    };
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
    // First get the intern data
    const internResponse = await fetchInternById(internId);
    if (internResponse.status !== 200 || !internResponse.data) {
      return {
        status: 404,
        message: 'Intern not found'
      };
    }
    
    // Then get the project data
    const projectResponse = await fetchProjectById(projectId);
    if (projectResponse.status !== 200 || !projectResponse.data) {
      return {
        status: 404,
        message: 'Project not found'
      };
    }
    
    const intern = internResponse.data;
    const project = projectResponse.data;
    
    // Update the intern with the project assignment
    if (!intern.assignedProjects) {
      intern.assignedProjects = [];
    }
    
    if (!intern.assignedProjects.includes(projectId)) {
      intern.assignedProjects.push(projectId);
    }
    
    // Update the project with the intern
    if (!project.assignedInterns) {
      project.assignedInterns = [];
    }
    
    if (!project.assignedInterns.includes(internId)) {
      project.assignedInterns.push(internId);
    }
    
    // Save both updates
    const updateInternResponse = await updateIntern(internId, intern);
    
    const updateProjectResponse = await updateProject(projectId, project);
    
    if (updateInternResponse.status !== 200 || updateProjectResponse.status !== 200) {
      return {
        status: 500,
        message: 'Failed to update assignment'
      };
    }
    
    return {
      status: 200,
      message: 'Intern assigned to project successfully'
    };
  } catch (error) {
    console.error('Error assigning intern to project:', error);
    return {
      status: 500,
      message: 'Failed to assign intern to project: ' + error.message
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
    // First get the intern data
    const internResponse = await fetchInternById(internId);
    if (internResponse.status !== 200 || !internResponse.data) {
      return {
        status: 404,
        message: 'Intern not found'
      };
    }
    
    // Then get the project data
    const projectResponse = await fetchProjectById(projectId);
    if (projectResponse.status !== 200 || !projectResponse.data) {
      return {
        status: 404,
        message: 'Project not found'
      };
    }
    
    const intern = internResponse.data;
    const project = projectResponse.data;
    
    // Remove project from intern's assignedProjects
    if (intern.assignedProjects) {
      intern.assignedProjects = intern.assignedProjects.filter(id => id !== projectId);
    }
    
    // Remove intern from project's assignedInterns
    if (project.assignedInterns) {
      project.assignedInterns = project.assignedInterns.filter(id => id !== internId);
    }
    
    // Save both updates
    const updateInternResponse = await updateIntern(internId, intern);
    
    const updateProjectResponse = await updateProject(projectId, project);
    
    if (updateInternResponse.status !== 200 || updateProjectResponse.status !== 200) {
      return {
        status: 500,
        message: 'Failed to update assignment'
      };
    }
    
    return {
      status: 200,
      message: 'Intern removed from project successfully'
    };
  } catch (error) {
    console.error('Error removing intern from project:', error);
    return {
      status: 500,
      message: 'Failed to remove intern from project: ' + error.message
    };
  }
};