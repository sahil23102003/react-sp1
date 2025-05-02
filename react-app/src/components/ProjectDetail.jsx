import { useEffect, useState } from 'react';
import { fetchProjectById, fetchInterns, assignInternToProject, removeInternFromProject } from '../services/api';
import './ProjectDetail.css';

const ProjectDetail = ({ projectId, onClose }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableInterns, setAvailableInterns] = useState([]);
  const [selectedInterns, setSelectedInterns] = useState([]);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!projectId) return;

        const response = await fetchProjectById(projectId);

        if (response.status === 200) {
          setProject(response.data);
        } else {
          setError(response.message || 'Failed to load project details');
        }
      } catch (err) {
        console.error('Error loading project details:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadProjectDetails();
  }, [projectId]);

  // Load available interns when assign form is shown
  useEffect(() => {
    const loadAvailableInterns = async () => {
      if (!showAssignForm) return;

      try {
        const response = await fetchInterns();

        if (response.status === 200) {
          // Filter out interns who are already assigned to this project
          const assignedInternIds = project.assignedInterns || [];
          const availableInternsList = response.data.filter(intern =>
            // Only include active interns (no end date or end date in the future)
            (!intern.endDate || new Date(intern.endDate) > new Date()) &&
            // Not already assigned to this project
            !assignedInternIds.includes(intern._id)
          );

          setAvailableInterns(availableInternsList);
        }
      } catch (err) {
        console.error('Error loading available interns:', err);
      }
    };

    loadAvailableInterns();
  }, [showAssignForm, project]);

  // Handle click outside to close the modal
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('detail-overlay')) {
      onClose();
    }
  };

  const handleInternToggle = (internId) => {
    setSelectedInterns(prev => {
      if (prev.includes(internId)) {
        return prev.filter(id => id !== internId);
      } else {
        return [...prev, internId];
      }
    });
  };

  const handleAssignInterns = async () => {
    if (selectedInterns.length === 0) return;

    setIsAssigning(true);

    try {
      // Assign each selected intern to the project
      const results = await Promise.all(
        selectedInterns.map(internId =>
          assignInternToProject(internId, projectId)
        )
      );

      if (results.every(r => r.status === 200)) {
        // Refresh project data
        const response = await fetchProjectById(projectId);
        if (response.status === 200) {
          setProject(response.data);
        }

        // Clear selection and hide form
        setSelectedInterns([]);
        setShowAssignForm(false);
      }
    } catch (err) {
      console.error('Error assigning interns:', err);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveIntern = async (internId) => {

    if (!confirm('Are you sure you want to remove this intern from the project?')) {
      return;
    }
    const id = typeof internId === 'object' && internId._id ? internId._id : internId;
    console.log("Removing intern ID:", internId, typeof internId);

    try {
      const response = await removeInternFromProject(id, projectId);

      if (response.status === 200) {
        // Refresh project data
        const projectResponse = await fetchProjectById(projectId);
        if (projectResponse.status === 200) {
          setProject(projectResponse.data);
        }
      }
    } catch (err) {
      console.error('Error removing intern from project:', err);
    }
  };

  if (loading) {
    return (
      <div className="detail-overlay" onClick={handleOverlayClick}>
        <div className="detail-container">
          <div className="detail-content" style={{ textAlign: 'center', padding: '40px' }}>
            Loading project details...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-overlay" onClick={handleOverlayClick}>
        <div className="detail-container">
          <div className="detail-content" style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>
            {error}
          </div>
          <button className="detail-close" onClick={onClose}>×</button>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  // Calculate project status
  const now = new Date();
  const startDate = new Date(project.startDate);
  const endDate = project.endDate ? new Date(project.endDate) : null;

  let status = 'Active';
  if (startDate > now) {
    status = 'Upcoming';
  } else if (endDate && endDate < now) {
    status = 'Completed';
  }

  // Calculate progress for active projects
  let progressPercentage = 0;
  if (status === 'Active' && endDate) {
    const totalDuration = endDate - startDate;
    const elapsed = now - startDate;
    progressPercentage = Math.min(Math.round((elapsed / totalDuration) * 100), 100);
  } else if (status === 'Completed') {
    progressPercentage = 100;
  }

  return (
    <div className="detail-overlay" onClick={handleOverlayClick}>
      <div className="detail-container">
        <div className="project-detail-header">
          <div className="project-detail-title-section">
            <h2 className="project-detail-title">{project.name}</h2>
            <span className={`project-detail-status status-${status.toLowerCase()}`}>
              {status}
            </span>
          </div>
          <button className="detail-close" onClick={onClose}>×</button>
        </div>

        <div className="project-detail-content">
          <div className="project-detail-section">
            <div className="project-detail-description">
              <h3 className="project-section-title">Description</h3>
              <p>{project.description}</p>
            </div>

            <div className="project-detail-meta">
              <div className="project-detail-item">
                <span className="project-detail-label">Start Date:</span>
                <span className="project-detail-value">{new Date(project.startDate).toLocaleDateString()}</span>
              </div>

              <div className="project-detail-item">
                <span className="project-detail-label">End Date:</span>
                <span className="project-detail-value">
                  {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}
                </span>
              </div>

              <div className="project-detail-item">
                <span className="project-detail-label">Progress:</span>
                <div className="project-detail-progress">
                  <div className="detail-progress-bar">
                    <div
                      className="detail-progress-fill"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="detail-progress-text">{progressPercentage}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="project-detail-section">
            <h3 className="project-section-title">Tech Stacks</h3>
            <div className="project-detail-tech-stacks">
              {project.techStacks && project.techStacks.length > 0 ? (
                project.techStacks.map(tech => (
                  <span key={tech} className="project-detail-tech-tag">{tech}</span>
                ))
              ) : (
                <p className="no-tech-stacks">No tech stacks specified</p>
              )}
            </div>
          </div>

          <div className="project-detail-section">
            <div className="project-team-header">
              <h3 className="project-section-title">Team Members</h3>
              <button
                className="assign-button"
                onClick={() => setShowAssignForm(!showAssignForm)}
                disabled={status === 'Completed'}
              >
                {showAssignForm ? 'Cancel' : 'Assign Interns'}
              </button>
            </div>

            {showAssignForm && (
              <div className="assign-form">
                <h4 className="assign-form-title">Assign Interns to Project</h4>

                {availableInterns.length === 0 ? (
                  <p className="no-available-interns">No available interns to assign</p>
                ) : (
                  <>
                    <div className="available-interns-list">
                      {availableInterns.map(intern => (
                        <div
                          key={intern._id}
                          className={`available-intern-item ${selectedInterns.includes(intern._id) ? 'selected' : ''}`}
                          onClick={() => handleInternToggle(intern._id)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedInterns.includes(intern._id)}
                            onChange={() => { }}
                            readOnly
                          />
                          <div className="available-intern-info">
                            <div className="available-intern-name">{intern.name}</div>
                            <div className="available-intern-role">{intern.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="assign-form-actions">
                      <button
                        className="assign-submit-button"
                        onClick={handleAssignInterns}
                        disabled={selectedInterns.length === 0 || isAssigning}
                      >
                        {isAssigning ? 'Assigning...' : 'Assign Selected Interns'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="team-list">
              {project.assignedInterns && project.assignedInterns.length > 0 ? (
                project.assignedInterns.map(internId => {
                  // Look up intern details in the available interns list
                  const internDetail = availableInterns.find(i => i._id === internId);

                  return (
                    <div key={internId} className="team-member">
                      <div className="team-member-info">
                        <div className="team-member-name">
                          {internDetail ? internDetail.name :
                            (typeof internId === 'object' && internId.name ?
                              internId.name :
                              `Intern #${typeof internId === 'object' ? internId._id : internId}`)}
                        </div>
                        {internDetail && (
                          <div className="team-member-role">{internDetail.role}</div>
                        )}
                      </div>

                      {status !== 'Completed' && (
                        <button
                          className="remove-intern-button"
                          onClick={() => handleRemoveIntern(internId._id)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="no-team-members">No team members assigned yet</p>
              )}
            </div>

            <div className="team-summary">
              <span className="team-count">
                {project.assignedInterns?.length || 0} / {project.requiredPeople} positions filled
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;