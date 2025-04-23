// API service with JSON Server
const API_URL = 'http://localhost:3001';

// GET - Fetch all interns
export const fetchInterns = async () => {
  try {
    const response = await fetch(`${API_URL}/interns`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      status: 200,
      data: data,
      message: 'Interns fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching interns:', error);
    return {
      status: 500,
      data: null,
      message: 'Failed to fetch interns'
    };
  }
};

// GET - Fetch single intern by ID
export const fetchInternById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/interns/${id}`);
    
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
    const response = await fetch(`${API_URL}/projects`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      status: 200,
      data: data,
      message: 'Projects fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return {
      status: 500,
      data: null,
      message: 'Failed to fetch projects'
    };
  }
};

// GET - Fetch single project by ID
export const fetchProjectById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/projects/${id}`);
    
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
      message: 'Project fetched successfully'
    };
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
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      status: 201,
      data: data,
      message: 'Project added successfully'
    };
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
  try {
    // First get the intern data
    const internResponse = await fetchInternById(internId);
    if (internResponse.status !== 200) {
      throw new Error('Failed to fetch intern');
    }
    
    // Then get the project data
    const projectResponse = await fetchProjectById(projectId);
    if (projectResponse.status !== 200) {
      throw new Error('Failed to fetch project');
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
      throw new Error('Failed to update assignment');
    }
    
    return {
      status: 200,
      message: 'Intern assigned to project successfully'
    };
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
  try {
    // First get the intern data
    const internResponse = await fetchInternById(internId);
    if (internResponse.status !== 200) {
      throw new Error('Failed to fetch intern');
    }
    
    // Then get the project data
    const projectResponse = await fetchProjectById(projectId);
    if (projectResponse.status !== 200) {
      throw new Error('Failed to fetch project');
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
      throw new Error('Failed to update assignment');
    }
    
    return {
      status: 200,
      message: 'Intern removed from project successfully'
    };
  } catch (error) {
    console.error('Error removing intern from project:', error);
    return {
      status: 500,
      message: 'Failed to remove intern from project'
    };
  }
};