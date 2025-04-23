import { useEffect, useState } from 'react';
import { fetchInternById } from '../services/api';
import TechStackForm from './TechStackForm';
import InternEditForm from './InternEditForm';
import './InternDetail.css';

const InternDetail = ({ internId, onClose }) => {
  const [intern, setIntern] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTechStackForm, setShowTechStackForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const loadInternDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!internId) {
          setError("No intern ID provided");
          setLoading(false);
          return;
        }
        
        console.log(`Loading intern details for ID: ${internId}`);
        const response = await fetchInternById(internId);
        
        if (response.status === 200 && response.data) {
          // Add mock data for demo purposes if not already present
          const internData = {
            ...response.data,
            performance: response.data.performance || {
              rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
              sprints: response.data.sprints || Math.floor(Math.random() * 8) + 1,
              projects: response.data.projects || [
                {
                  id: 1,
                  name: 'Website Redesign',
                  description: 'Collaborated on the company website redesign project'
                },
                {
                  id: 2,
                  name: 'Mobile App Feature',
                  description: 'Implemented new feature for the mobile application'
                }
              ],
              courses: response.data.courses || [
                {
                  id: 1,
                  name: 'Advanced React Patterns',
                  status: 'Completed'
                },
                {
                  id: 2,
                  name: 'Data Structures & Algorithms',
                  status: 'In Progress'
                },
                {
                  id: 3,
                  name: 'UI/UX Fundamentals',
                  status: 'Completed'
                }
              ],
            },
            techStacks: response.data.techStacks || ['JavaScript', 'React', 'Node.js'],
            assignedProjects: response.data.assignedProjects || []
          };
          
          setIntern(internData);
        } else {
          setError(response.message || 'Failed to load intern details');
        }
      } catch (err) {
        console.error('Error loading intern details:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadInternDetails();
  }, [internId]);

  const handleTechStackUpdated = (updatedIntern) => {
    setIntern(updatedIntern);
    setShowTechStackForm(false);
  };

  const handleInternUpdated = (updatedIntern) => {
    setIntern(updatedIntern);
    setIsEditMode(false);
  };

  // Handle click outside to close the modal
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('detail-overlay')) {
      onClose();
    }
  };

  // Generate stars for rating
  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="detail-rating-star">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="detail-rating-star">⯨</span>);
      } else {
        stars.push(<span key={i} className="detail-rating-star">☆</span>);
      }
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="detail-overlay" onClick={handleOverlayClick}>
        <div className="detail-container">
          <div className="detail-content" style={{ textAlign: 'center', padding: '40px' }}>
            Loading intern details...
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

  if (!intern) {
    return (
      <div className="detail-overlay" onClick={handleOverlayClick}>
        <div className="detail-container">
          <div className="detail-content" style={{ textAlign: 'center', padding: '40px' }}>
            No intern data found. Please try again.
          </div>
          <button className="detail-close" onClick={onClose}>×</button>
        </div>
      </div>
    );
  }

  if (isEditMode) {
    return (
      <div className="detail-overlay" onClick={handleOverlayClick}>
        <div className="detail-container">
          <button className="detail-close" onClick={() => setIsEditMode(false)}>×</button>
          <InternEditForm 
            intern={intern} 
            onSave={handleInternUpdated} 
            onCancel={() => setIsEditMode(false)} 
          />
        </div>
      </div>
    );
  }

  // Check if intern is active
  const now = new Date();
  const isActive = !intern.endDate || new Date(intern.endDate) > now;
  const status = isActive ? 'Active' : 'Completed';

  return (
    <div className="detail-overlay" onClick={handleOverlayClick}>
      <div className="detail-container">
        <div className="detail-header">
          <img 
            src={intern.imageUrl} 
            alt={`${intern.name}'s profile`} 
            className="detail-profile-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/80?text=404';
            }}
          />
          <div className="detail-name-section">
            <h2 className="detail-name">{intern.name}</h2>
            <p className="detail-role">{intern.role}</p>
            <div className="detail-status-badges">
              <span className="detail-department">{intern.department}</span>
              <span className={`detail-status ${isActive ? 'status-active' : 'status-completed'}`}>
                {status}
              </span>
            </div>
          </div>
          <div className="detail-action-buttons">
            <button 
              className="detail-edit-button"
              onClick={() => setIsEditMode(true)}
            >
              Edit Details
            </button>
            <button className="detail-close" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="detail-content">
          <div className="detail-metrics">
            <div className="detail-metric-card">
              <p className="detail-metric-value">{intern.performance.rating}</p>
              <p className="detail-metric-label">Performance Rating</p>
            </div>
            <div className="detail-metric-card">
              <p className="detail-metric-value">{intern.performance.sprints}</p>
              <p className="detail-metric-label">Sprints Completed</p>
            </div>
            <div className="detail-metric-card">
              <p className="detail-metric-value">{intern.performance.projects.length}</p>
              <p className="detail-metric-label">Projects</p>
            </div>
          </div>

          <div className="detail-section detail-dates-section">
            <div className="detail-dates">
              <div className="detail-date-item">
                <span className="detail-date-label">Join Date:</span>
                <span className="detail-date-value">{new Date(intern.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="detail-date-item">
                <span className="detail-date-label">End Date:</span>
                <span className="detail-date-value">
                  {intern.endDate ? new Date(intern.endDate).toLocaleDateString() : 'Not set'}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3 className="detail-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Tech Stacks
            </h3>
            
            {showTechStackForm ? (
              <TechStackForm 
                intern={intern} 
                onTechStackUpdated={handleTechStackUpdated} 
              />
            ) : (
              <>
                <div className="tech-stack-list">
                  {intern.techStacks && intern.techStacks.length > 0 ? (
                    intern.techStacks.map(tech => (
                      <span key={tech} className="tech-stack-tag">{tech}</span>
                    ))
                  ) : (
                    <span>No tech stacks added yet</span>
                  )}
                </div>
                <button 
                  className="tech-form-submit" 
                  style={{ marginTop: '12px' }}
                  onClick={() => setShowTechStackForm(true)}
                >
                  Edit Tech Stacks
                </button>
              </>
            )}
          </div>

          <div className="detail-section">
            <h3 className="detail-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Projects
            </h3>
            <div className="project-list">
              {intern.performance.projects && intern.performance.projects.length > 0 ? (
                intern.performance.projects.map(project => (
                  <div key={project.id} className="project-item">
                    <h4 className="project-name">{project.name}</h4>
                    <p className="project-description">{project.description}</p>
                  </div>
                ))
              ) : (
                <div className="project-item">
                  <p className="project-description">No projects assigned yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h3 className="detail-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Courses
            </h3>
            <div className="course-list">
              {intern.performance.courses && intern.performance.courses.length > 0 ? (
                intern.performance.courses.map(course => (
                  <div key={course.id} className="course-item">
                    <div className="course-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="course-info">
                      <h4 className="course-name">{course.name}</h4>
                      <p className="course-status">{course.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="course-item">
                  <div className="course-info">
                    <p>No courses completed yet</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h3 className="detail-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Contact Information
            </h3>
            <div className="detail-grid">
              <div className="detail-info-item">
                <p className="detail-info-label">Email</p>
                <p className="detail-info-value">{intern.email}</p>
              </div>
              <div className="detail-info-item">
                <p className="detail-info-label">Phone</p>
                <p className="detail-info-value">{intern.phone}</p>
              </div>
              <div className="detail-info-item">
                <p className="detail-info-label">Join Date</p>
                <p className="detail-info-value">{new Date(intern.joinDate).toLocaleDateString()}</p>
              </div>
              <div className="detail-info-item">
                <p className="detail-info-label">Fun Fact</p>
                <p className="detail-info-value">{intern.funFact || 'No fun fact provided'}</p>
              </div>
            </div>
          </div>
          
          {intern.assignedProjects && intern.assignedProjects.length > 0 && (
            <div className="detail-section">
              <h3 className="detail-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Assigned Projects
              </h3>
              <div className="assigned-projects-list">
                {intern.assignedProjects.map(projectId => (
                  <div key={projectId} className="assigned-project-item">
                    Project #{projectId}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternDetail;