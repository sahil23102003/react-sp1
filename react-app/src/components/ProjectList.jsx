import { useState, useEffect } from 'react';
import { fetchProjects } from '../services/api';
import ProjectDetail from './ProjectDetail';
import './ProjectList.css';

const ProjectList = ({ onProjectSelected }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchProjects();
      
      if (response.status === 200) {
        setProjects(response.data);
      } else {
        setError(response.message || 'Failed to load projects');
      }
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    setSelectedProjectId(projectId);
    if (onProjectSelected) {
      onProjectSelected(projectId);
    }
  };

  const handleCloseDetail = () => {
    setSelectedProjectId(null);
    // Refresh projects when detail view is closed (in case updates were made)
    loadProjects();
  };

  if (loading) {
    return (
      <div className="projects-container">
        <h2 className="section-title">Projects</h2>
        <div className="loading">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-container">
        <h2 className="section-title">Projects</h2>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <h2 className="section-title">Projects</h2>
      
      {projects.length === 0 ? (
        <div className="no-projects">
          <p>No projects found. Create a new project to get started!</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => {
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
              <div 
                key={project._id} 
                className={`project-card project-status-${status.toLowerCase()}`}
                onClick={() => handleProjectClick(project._id)}
              >
                <div className="project-header">
                  <h3 className="project-name">{project.name}</h3>
                  <span className={`project-status status-${status.toLowerCase()}`}>
                    {status}
                  </span>
                </div>
                
                <p className="project-description">{project.description}</p>
                
                <div className="project-tech-stacks">
                  {project.techStacks && project.techStacks.slice(0, 3).map(tech => (
                    <span key={tech} className="project-tech-tag">{tech}</span>
                  ))}
                  {project.techStacks && project.techStacks.length > 3 && (
                    <span className="project-tech-more">+{project.techStacks.length - 3} more</span>
                  )}
                </div>
                
                <div className="project-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{progressPercentage}% Complete</span>
                </div>
                
                <div className="project-meta">
                  <div className="project-dates">
                    <div className="date-label">Timeline:</div>
                    <div className="date-value">
                      {new Date(project.startDate).toLocaleDateString()} 
                      {project.endDate ? ` - ${new Date(project.endDate).toLocaleDateString()}` : ' - Ongoing'}
                    </div>
                  </div>
                  
                  <div className="project-team">
                    <div className="team-label">Team:</div>
                    <div className="team-value">
                      {project.assignedInterns?.length || 0} / {project.requiredPeople} assigned
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {selectedProjectId && (
        <ProjectDetail 
          projectId={selectedProjectId}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default ProjectList;