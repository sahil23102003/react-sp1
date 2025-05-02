/**
 * Safely compares two IDs that could be different formats
 * (handles string vs number and MongoDB ObjectId vs simple ID)
 * 
 * @param {string|number} id1 - First ID to compare
 * @param {string|number} id2 - Second ID to compare
 * @returns {boolean} - True if the IDs match
 */
export const compareIds = (id1, id2) => {
    // Convert both to strings for comparison
    const strId1 = String(id1);
    const strId2 = String(id2);
    
    return strId1 === strId2;
  };
  
  /**
   * Checks if an ID matches MongoDB ObjectId format
   * 
   * @param {string} id - ID to check
   * @returns {boolean} - True if it's a valid MongoDB ObjectId format
   */
  export const isValidObjectId = (id) => {
    // MongoDB ObjectId is a 24-character hex string
    return /^[0-9a-fA-F]{24}$/.test(String(id));
  };
  
  /**
   * Ensures an ID is in string format
   * 
   * @param {string|number} id - ID to normalize
   * @returns {string} - String representation of the ID
   */
  export const normalizeId = (id) => {
    return String(id);
  };