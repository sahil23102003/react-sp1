// Simulated API service
import { internsData } from '../data/mockData';

// Simulate API call delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// GET - Fetch all interns
export const fetchInterns = async () => {
  try {
    // Simulate network delay
    await delay(800);
    
    // Simulate successful API response
    return {
      status: 200,
      data: internsData,
      message: 'Interns fetched successfully'
    };
  } catch (error) {
    // Simulate error response
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
    // Simulate network delay
    await delay(600);
    
    const intern = internsData.find(intern => intern.id === parseInt(id));
    
    if (!intern) {
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
    // Simulate error response
    console.error('Error fetching intern:', error);
    return {
      status: 500,
      data: null,
      message: 'Failed to fetch intern details'
    };
  }
};