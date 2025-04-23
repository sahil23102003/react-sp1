import { useState, useEffect, useMemo } from 'react';
import { deleteIntern } from '../services/api';
import './InternTable.css';

const InternTable = ({ interns, onInternDeleted, onInternSelected, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Reset to page 1 when search, filter, or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, itemsPerPage]);

  // Get unique roles for filter dropdown
  const uniqueRoles = useMemo(() => {
    const roles = interns.map(intern => intern.role);
    return ['', ...new Set(roles)]; // Add empty option for "All"
  }, [interns]);

  // Filter and sort interns
  const filteredInterns = useMemo(() => {
    return interns
      .filter(intern => {
        // Apply search filter (case insensitive)
        const nameMatch = intern.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Apply role filter
        const roleMatch = roleFilter === '' || intern.role === roleFilter;
        
        return nameMatch && roleMatch;
      })
      .sort((a, b) => {
        // Handle sorting for different data types
        if (sortField === 'joinDate') {
          const dateA = new Date(a[sortField]);
          const dateB = new Date(b[sortField]);
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        } else {
          // String or number comparison
          const valueA = a[sortField]?.toString().toLowerCase();
          const valueB = b[sortField]?.toString().toLowerCase();
          
          if (sortDirection === 'asc') {
            return valueA.localeCompare(valueB);
          } else {
            return valueB.localeCompare(valueA);
          }
        }
      });
  }, [interns, searchTerm, roleFilter, sortField, sortDirection]);

  // Paginate interns
  const paginatedInterns = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInterns.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInterns, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredInterns.length / itemsPerPage);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this intern?')) {
      try {
        const response = await deleteIntern(id);
        
        if (response.status === 200) {
          // Notify parent component to refresh data
          if (onInternDeleted) {
            onInternDeleted(id);
          }
        } else {
          alert(response.message || 'Failed to delete intern');
        }
      } catch (error) {
        console.error('Error deleting intern:', error);
        alert('An unexpected error occurred');
      }
    }
  };

  // Handle row click to view details
  const handleRowClick = (intern) => {
    if (onInternSelected) {
      onInternSelected(intern.id);
    }
  };

  // Generate page buttons
  const renderPageButtons = () => {
    const pageButtons = [];
    
    // Previous button
    pageButtons.push(
      <button
        key="prev"
        className="pagination-button"
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        &laquo; Prev
      </button>
    );
    
    // Page numbers - show up to 5 pages with current page in the middle when possible
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < 4 && startPage > 1) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    pageButtons.push(
      <button
        key="next"
        className="pagination-button"
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages || totalPages === 0}
      >
        Next &raquo;
      </button>
    );
    
    return pageButtons;
  };

  // Render sort indicator
  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    return (
      <span className="sort-indicator">
        {sortDirection === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  return (
    <div className="intern-table-container">
      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-container">
          <select
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            {uniqueRoles.slice(1).map((role, index) => (
              <option key={index} value={role}>{role}</option>
            ))}
          </select>
        </div>
        
        <div className="items-per-page-container">
          <span className="items-per-page-label">Items per page:</span>
          <select
            className="items-per-page-select"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading interns...</div>
      ) : (
        <>
          <table className="intern-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>
                  Name {renderSortIndicator('name')}
                </th>
                <th onClick={() => handleSort('role')}>
                  Role {renderSortIndicator('role')}
                </th>
                <th onClick={() => handleSort('department')}>
                  Department {renderSortIndicator('department')}
                </th>
                <th onClick={() => handleSort('joinDate')}>
                  Join Date {renderSortIndicator('joinDate')}
                </th>
                <th onClick={() => handleSort('email')}>
                  Email {renderSortIndicator('email')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInterns.length > 0 ? (
                paginatedInterns.map((intern) => (
                  <tr 
                    key={intern.id} 
                    className="clickable-row"
                    onClick={() => handleRowClick(intern)}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                          src={intern.imageUrl} 
                          alt={`${intern.name}'s profile`} 
                          className="intern-avatar"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/40?text=404';
                          }}
                        />
                        {intern.name}
                      </div>
                    </td>
                    <td>{intern.role}</td>
                    <td>{intern.department}</td>
                    <td>{new Date(intern.joinDate).toLocaleDateString()}</td>
                    <td>{intern.email}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className="table-action-btn"
                        onClick={() => handleRowClick(intern)}
                      >
                        View
                      </button>
                      <button
                        className="table-action-btn delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(intern.id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    No interns found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {paginatedInterns.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredInterns.length)} of {filteredInterns.length} interns
            </div>
            <div className="pagination-controls">
              {renderPageButtons()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InternTable;