import { useState, useEffect } from 'react';
import { updateIntern } from '../services/api';
import './TechStackForm.css';

const AVAILABLE_TECH_STACKS = [
  'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue',
  'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
  'GraphQL', 'REST API', 'Redux', 'Git', 'GitHub',
  'SASS/SCSS', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Webpack',
  'Python', 'Java', 'C#', '.NET', 'PHP'
];

const TechStackForm = ({ intern, onTechStackUpdated }) => {
  const [selectedTechStacks, setSelectedTechStacks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Initialize with intern's existing tech stacks if available
  useEffect(() => {
    if (intern && intern.techStacks) {
      setSelectedTechStacks(intern.techStacks);
    }
  }, [intern]);

  const handleTechStackToggle = (techStack) => {
    setSelectedTechStacks(prev => {
      if (prev.includes(techStack)) {
        return prev.filter(item => item !== techStack);
      } else {
        return [...prev, techStack];
      }
    });
    
    // Clear success/error messages when selection changes
    setSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create updated intern data with selected tech stacks
      const updatedInternData = {
        ...intern,
        techStacks: selectedTechStacks
      };
      
      const response = await updateIntern(intern.id, updatedInternData);
      
      if (response.status === 200) {
        setSuccess(true);
        
        // Notify parent component
        if (onTechStackUpdated) {
          onTechStackUpdated(response.data);
        }
      } else {
        setError(response.message || 'Failed to update tech stacks');
      }
    } catch (err) {
      console.error('Error updating tech stacks:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!intern) {
    return <div>Please select an intern first.</div>;
  }

  return (
    <div className="tech-form-container">
      <h3 className="tech-form-title">Select Your Favorite Tech Stacks</h3>
      
      {success && (
        <div className="tech-form-success">
          Tech stacks updated successfully!
        </div>
      )}
      
      {error && (
        <div className="tech-form-error">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="tech-stacks-grid">
          {AVAILABLE_TECH_STACKS.map((tech) => (
            <div 
              key={tech}
              className={`tech-stack-item ${selectedTechStacks.includes(tech) ? 'selected' : ''}`}
              onClick={() => handleTechStackToggle(tech)}
            >
              <input
                type="checkbox"
                id={`tech-${tech}`}
                checked={selectedTechStacks.includes(tech)}
                onChange={() => {}} // Handled by onClick on parent div
                readOnly
              />
              <label htmlFor={`tech-${tech}`}>{tech}</label>
            </div>
          ))}
        </div>
        
        <div className="tech-form-actions">
          <button
            type="submit"
            className="tech-form-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Tech Stacks'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TechStackForm;