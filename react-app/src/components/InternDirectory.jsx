import { useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import InternForm from './InternForm';
import InternTable from './InternTable';
import { fetchInterns } from '../services/api';
import './InternDirectory.css';

const InternDirectory = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [showForm, setShowForm] = useState(false);

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
  };

  const handleInternDeleted = (deletedId) => {
    // Refresh the intern list
    loadInterns();
  };

  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="directory-container">
      <h2 className="directory-title">Intern Directory</h2>
      
      <div className="directory-controls">
        <button className="refresh-button" onClick={handleRefresh}>
          Refresh Data
        </button>
        
        <button className="toggle-form-button" onClick={toggleForm}>
          {showForm ? 'Hide Form' : 'Add New Intern'}
        </button>
      </div>
      
      {showForm && (
        <InternForm onInternAdded={handleInternAdded} />
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
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
      </div>
      
      {loading ? (
        <div className="loading">Loading interns...</div>
      ) : (
        <>
          {viewMode === 'table' ? (
            <InternTable 
              interns={interns} 
              onInternDeleted={handleInternDeleted}
              loading={loading}
            />
          ) : (
            <div className="interns-grid">
              {interns.map((intern) => (
                <ProfileCard
                  key={intern.id}
                  name={intern.name}
                  role={intern.role}
                  department={intern.department}
                  email={intern.email}
                  phone={intern.phone}
                  imageUrl={intern.imageUrl}
                  funFact={intern.funFact}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InternDirectory;