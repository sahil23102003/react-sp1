import { useState } from 'react';
import { addProject } from '../services/api';
import './ProjectForm.css';

const AVAILABLE_TECH_STACKS = [
  'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue',
  'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
  'GraphQL', 'REST API', 'Redux', 'Git', 'GitHub',
  'SASS/SCSS', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Webpack',
  'Python', 'Java', 'C#', '.NET', 'PHP'
];

const initialFormState = {
  name: '',
  description: '',
  startDate: new Date().toISOString().split('T')[0], // Today's date
  endDate: '',
  requiredPeople: 1,
  techStacks: [],
  assignedInterns: []
};

const ProjectForm = ({ onProjectAdded }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (formData.requiredPeople < 1) {
      newErrors.requiredPeople = 'At least 1 person is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: name === 'requiredPeople' ? parseInt(value, 10) : value
    });
    
    // Clear the error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
    
    // Clear success message when form is modified
    if (submitSuccess) {
      setSubmitSuccess(false);
    }
  };
  
  const handleTechStackToggle = (techStack) => {
    setFormData(prevData => {
      const techStacks = [...prevData.techStacks];
      
      if (techStacks.includes(techStack)) {
        return {
          ...prevData,
          techStacks: techStacks.filter(item => item !== techStack)
        };
      } else {
        return {
          ...prevData,
          techStacks: [...techStacks, techStack]
        };
      }
    });
    
    // Clear success message when form is modified
    if (submitSuccess) {
      setSubmitSuccess(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await addProject(formData);
      
      if (response.status === 201) {
        setSubmitSuccess(true);
        setFormData(initialFormState);
        
        if (onProjectAdded) {
          onProjectAdded(response.data);
        }
      } else {
        setErrors({
          ...errors,
          form: response.message || 'Failed to add project. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({
        ...errors,
        form: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add New Project</h2>
      
      {/* Success message */}
      {submitSuccess && (
        <div className="form-success">
          Project added successfully!
        </div>
      )}
      
      {/* Form error message */}
      {errors.form && (
        <div className="error-message">
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Project Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'invalid' : ''}`}
            placeholder="Enter project name"
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`form-textarea ${errors.description ? 'invalid' : ''}`}
            placeholder="Project description"
            rows="3"
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>
        
        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label htmlFor="startDate" className="form-label">Start Date *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`form-input ${errors.startDate ? 'invalid' : ''}`}
              />
              {errors.startDate && <div className="error-message">{errors.startDate}</div>}
            </div>
          </div>
          
          <div className="form-col">
            <div className="form-group">
              <label htmlFor="endDate" className="form-label">Expected End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`form-input ${errors.endDate ? 'invalid' : ''}`}
              />
              {errors.endDate && <div className="error-message">{errors.endDate}</div>}
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="requiredPeople" className="form-label">Required People</label>
          <input
            type="number"
            id="requiredPeople"
            name="requiredPeople"
            value={formData.requiredPeople}
            onChange={handleChange}
            min="1"
            max="20"
            className={`form-input ${errors.requiredPeople ? 'invalid' : ''}`}
          />
          {errors.requiredPeople && <div className="error-message">{errors.requiredPeople}</div>}
        </div>
        
        <h3 className="form-section-title">Required Tech Stacks</h3>
        <div className="tech-stacks-grid">
          {AVAILABLE_TECH_STACKS.map((tech) => (
            <div 
              key={tech}
              className={`tech-stack-item ${formData.techStacks.includes(tech) ? 'selected' : ''}`}
              onClick={() => handleTechStackToggle(tech)}
            >
              <input
                type="checkbox"
                id={`tech-${tech}`}
                checked={formData.techStacks.includes(tech)}
                onChange={() => {}} // Handled by onClick on parent div
                readOnly
              />
              <label htmlFor={`tech-${tech}`}>{tech}</label>
            </div>
          ))}
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;