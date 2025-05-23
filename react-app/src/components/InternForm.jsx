import { useState } from 'react';
import { addIntern } from '../services/api';
import './InternForm.css';

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
  role: '',
  department: '',
  email: '',
  phone: '',
  imageUrl: '',
  funFact: '',
  joinDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  techStacks: [],
  performance: {
    rating: '4.0',
    sprints: 1,
    projects: [],
    courses: []
  }
};

const InternForm = ({ onInternAdded }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Validate the form data
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Role validation
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }
    
    // Department validation
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    // Image URL validation - optional but if provided should be a valid URL
    if (formData.imageUrl.trim() && !/^https?:\/\/.+/.test(formData.imageUrl)) {
      newErrors.imageUrl = 'Must be a valid URL starting with http:// or https://';
    }
    
    // Join date validation
    if (!formData.joinDate) {
      newErrors.joinDate = 'Join date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested performance object
    if (name.startsWith('performance.')) {
      const performanceField = name.split('.')[1];
      setFormData({
        ...formData,
        performance: {
          ...formData.performance,
          [performanceField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
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
    
    // Validate the form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a random placeholder image if none provided
      const submissionData = {
        ...formData,
        imageUrl: formData.imageUrl || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`
      };
      
      const response = await addIntern(submissionData);
      
      if (response.status === 201) {
        // Success!
        setSubmitSuccess(true);
        setFormData(initialFormState);
        setShowAdvanced(false);
        
        // Notify parent component
        if (onInternAdded) {
          onInternAdded(response.data);
        }
      } else {
        // Handle API error
        setErrors({
          ...errors,
          form: response.message || 'Failed to add intern. Please try again.'
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
      <h2 className="form-title">Add New Intern</h2>
      
      {/* Success message */}
      {submitSuccess && (
        <div className="form-success">
          Intern added successfully!
        </div>
      )}
      
      {/* Form error message */}
      {errors.form && (
        <div className="error-message">
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'invalid' : ''}`}
                placeholder="Enter full name"
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>
          </div>
          
          <div className="form-col">
            <div className="form-group">
              <label htmlFor="role" className="form-label">Role *</label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`form-input ${errors.role ? 'invalid' : ''}`}
                placeholder="E.g., Frontend Developer Intern"
              />
              {errors.role && <div className="error-message">{errors.role}</div>}
            </div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label htmlFor="department" className="form-label">Department *</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`form-select ${errors.department ? 'invalid' : ''}`}
              >
                <option value="">Select a department</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="HR">Human Resources</option>
                <option value="Analytics">Analytics</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Product">Product</option>
              </select>
              {errors.department && <div className="error-message">{errors.department}</div>}
            </div>
          </div>
          
          <div className="form-col">
            <div className="form-group">
              <label htmlFor="joinDate" className="form-label">Join Date *</label>
              <input
                type="date"
                id="joinDate"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
                className={`form-input ${errors.joinDate ? 'invalid' : ''}`}
              />
              {errors.joinDate && <div className="error-message">{errors.joinDate}</div>}
            </div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'invalid' : ''}`}
                placeholder="email@example.com"
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
          </div>
          
          <div className="form-col">
            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? 'invalid' : ''}`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="imageUrl" className="form-label">Profile Image URL (Optional)</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className={`form-input ${errors.imageUrl ? 'invalid' : ''}`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.imageUrl && <div className="error-message">{errors.imageUrl}</div>}
          <small>Leave blank to use a random profile image</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="funFact" className="form-label">Fun Fact (Optional)</label>
          <textarea
            id="funFact"
            name="funFact"
            value={formData.funFact}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Share an interesting fact about yourself"
            rows="3"
          />
        </div>

        <div className="advanced-toggle">
          <button 
            type="button" 
            className="toggle-button"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </button>
        </div>
        
        {showAdvanced && (
          <>
            <h3 className="form-section-title">Tech Stacks</h3>
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
            
            <h3 className="form-section-title">Performance Metrics</h3>
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="rating" className="form-label">Initial Rating</label>
                  <select
                    id="rating"
                    name="performance.rating"
                    value={formData.performance.rating}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="3.0">3.0</option>
                    <option value="3.5">3.5</option>
                    <option value="4.0">4.0</option>
                    <option value="4.5">4.5</option>
                    <option value="5.0">5.0</option>
                  </select>
                </div>
              </div>
              
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="sprints" className="form-label">Initial Sprints</label>
                  <input
                    type="number"
                    id="sprints"
                    name="performance.sprints"
                    value={formData.performance.sprints}
                    onChange={handleChange}
                    min="0"
                    max="20"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </>
        )}
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Intern'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InternForm;