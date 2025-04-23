import { useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import InternForm from './InternForm';
import InternTable from './InternTable';
import InternDetail from './InternDetail';
import InternReports from './InternReports';
import ProjectList from './ProjectList';
import ProjectForm from './ProjectForm';
import ProjectDetail from './ProjectDetail'; 
import { fetchInterns } from '../services/api';
import './InternDirectory.css';

const InternDirectory = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'table', 'reports', or 'projects'
  const [showForm, setShowForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedInternId, setSelectedInternId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const loadInterns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call our API
      const response = await fetchInterns();
      
      if (response.status === 200) {
        setInterns(response.data || []); // Ensure we always have an array
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

  const handleProjectAdded = (newProject) => {
    // Hide the form after successful addition
    setShowProjectForm(false);
    // Auto-switch to project view to show the new project
    setViewMode('projects');
  };

  const handleInternDeleted = (deletedId) => {
    // Refresh the intern list
    loadInterns();
  };

  const handleInternSelected = (internId) => {
    if (internId && typeof internId === 'number') {
      setSelectedInternId(internId);
    } else {
      console.error('Invalid intern ID:', internId);
    }
  };

  const handleProjectSelected = (projectId) => {
    setSelectedProjectId(projectId);
  };

  const handleCloseDetail = () => {
    setSelectedInternId(null);
    // Refresh data when detail view is closed (in case updates were made)
    loadInterns();
  };

  const handleCloseProjectDetail = () => {
    setSelectedProjectId(null);
  };

  const toggleViewMode = (mode) => {
    // When changing view mode, hide all forms
    setShowForm(false);
    setShowProjectForm(false);
    setViewMode(mode);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setShowProjectForm(false); // Close project form if open
    
    // If showing form, ensure we're in cards/table view, not reports
    if (!showForm && (viewMode === 'reports' || viewMode === 'projects')) {
      setViewMode('cards');
    }
  };

  const toggleProjectForm = () => {
    setShowProjectForm(!showProjectForm);
    setShowForm(false); // Close intern form if open
    
    // If showing form, ensure we're in projects view
    if (!showProjectForm && viewMode !== 'projects') {
      setViewMode('projects');
    }
  };

  // Determine what button label should be shown based on current view
  const getAddButtonLabel = () => {
    if (viewMode === 'projects') {
      return showProjectForm ? 'Hide Project Form' : 'Add New Project';
    } else {
      return showForm ? 'Hide Form' : 'Add New Intern';
    }
  };
  
  // Determine which add button action to perform
  const handleAddButtonClick = () => {
    if (viewMode === 'projects') {
      toggleProjectForm();
    } else {
      toggleForm();
    }
  };

  return (
    <div className="directory-container">
      <div className="directory-controls-wrapper">
        <div className="directory-actions">
          <button className="refresh-button" onClick={handleRefresh}>
            Refresh Data
          </button>
          
          <button className="toggle-form-button" onClick={handleAddButtonClick}>
            {getAddButtonLabel()}
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
          <button 
            className={`view-toggle-btn ${viewMode === 'projects' ? 'active' : ''}`}
            onClick={() => toggleViewMode('projects')}
          >
            Projects
          </button>
        </div>
      </div>
      
      {showForm && (
        <InternForm onInternAdded={handleInternAdded} />
      )}
      
      {showProjectForm && (
        <ProjectForm onProjectAdded={handleProjectAdded} />
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {!showForm && !showProjectForm && !loading && (
        <>
          {viewMode === 'reports' ? (
            <InternReports />
          ) : viewMode === 'projects' ? (
            <ProjectList onProjectSelected={handleProjectSelected} />
          ) : viewMode === 'table' ? (
            <InternTable 
              interns={interns} 
              onInternDeleted={handleInternDeleted}
              onInternSelected={handleInternSelected}
              loading={loading}
            />
          ) : (
            <div className="interns-grid">
              {interns && interns.length > 0 ? (
                interns.map((intern) => (
                  <div key={intern.id} onClick={() => handleInternSelected(intern.id)}>
                    <ProfileCard
                      name={intern.name}
                      role={intern.role}
                      department={intern.department}
                      email={intern.email}
                      phone={intern.phone}
                      imageUrl={intern.imageUrl}
                      funFact={intern.funFact}
                      status={intern.endDate && new Date(intern.endDate) <= new Date() ? 'Completed' : 'Active'}
                    />
                  </div>
                ))
              ) : (
                <div className="no-interns">No interns found. Add some interns to get started!</div>
              )}
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
      
      {selectedProjectId && (
        <ProjectDetail
          projectId={selectedProjectId}
          onClose={handleCloseProjectDetail}
        />
      )}
    </div>
  );
};

export default InternDirectory;