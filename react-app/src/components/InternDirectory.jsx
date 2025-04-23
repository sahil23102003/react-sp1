import { useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import InternForm from './InternForm';
import InternTable from './InternTable';
import InternDetail from './InternDetail';
import InternReports from './InternReports';
import { fetchInterns } from '../services/api';
import './InternDirectory.css';

const InternDirectory = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'table', or 'reports'
  const [showForm, setShowForm] = useState(false);
  const [selectedInternId, setSelectedInternId] = useState(null);

  const loadInterns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call our API
      const response = await fetchInterns();
      
      if (response.status === 200) {
        setInterns(response.data);
      } else {
        setError(response.message || 'Failed to load interns');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error loading interns:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load interns when component mounts
  useEffect(() => {
    loadInterns();
  }, []);

  const handleRefresh = () => {
    loadInterns();
  };

  const handleInternAdded = (newIntern) => {
    // Refresh the intern list
    loadInterns();
    // Hide the form after successful addition
    setShowForm(false);
  };

  const handleInternDeleted = (deletedId) => {
    // Refresh the intern list
    loadInterns();
  };

  const handleInternSelected = (internId) => {
    setSelectedInternId(internId);
  };

  const handleCloseDetail = () => {
    setSelectedInternId(null);
    // Refresh data when detail view is closed (in case updates were made)
    loadInterns();
  };

  const toggleViewMode = (mode) => {
    // When changing view mode, hide the form
    setShowForm(false);
    setViewMode(mode);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    // If showing form, ensure we're in cards/table view, not reports
    if (!showForm && viewMode === 'reports') {
      setViewMode('cards');
    }
  };

  return (
    <div className="directory-container">
      <div className="directory-controls-wrapper">
        <div className="directory-actions">
          <button className="refresh-button" onClick={handleRefresh}>
            Refresh Data
          </button>
          
          <button className="toggle-form-button" onClick={toggleForm}>
            {showForm ? 'Hide Form' : 'Add New Intern'}
          </button>
        </div>

        <div className="view-toggle">
          <button 
            className={`view-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => toggleViewMode('cards')}
          >
            Card View
          </button>
          <button 
            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => toggleViewMode('table')}
          >
            Table View
          </button>
          <button 
            className={`view-toggle-btn ${viewMode === 'reports' ? 'active' : ''}`}
            onClick={() => toggleViewMode('reports')}
          >
            Reports
          </button>
        </div>
      </div>
      
      {showForm && (
        <InternForm onInternAdded={handleInternAdded} />
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {!showForm && !loading && (
        <>
          {viewMode === 'reports' ? (
            <InternReports />
          ) : viewMode === 'table' ? (
            <InternTable 
              interns={interns} 
              onInternDeleted={handleInternDeleted}
              onInternSelected={handleInternSelected}
              loading={loading}
            />
          ) : (
            <div className="interns-grid">
              {interns.map((intern) => (
                <div key={intern.id} onClick={() => handleInternSelected(intern.id)}>
                  <ProfileCard
                    name={intern.name}
                    role={intern.role}
                    department={intern.department}
                    email={intern.email}
                    phone={intern.phone}
                    imageUrl={intern.imageUrl}
                    funFact={intern.funFact}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {loading && (
        <div className="loading">Loading interns...</div>
      )}
      
      {selectedInternId && (
        <InternDetail 
          internId={selectedInternId}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default InternDirectory;