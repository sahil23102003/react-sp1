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