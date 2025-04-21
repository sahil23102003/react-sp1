import { useState } from 'react';
import './ProfileCard.css';

const ProfileCard = ({ 
  name, 
  role, 
  department, 
  email, 
  phone, 
  imageUrl, 
  funFact 
}) => {
  const [showFunFact, setShowFunFact] = useState(false);

  const toggleFunFact = () => {
    setShowFunFact(!showFunFact);
  };

  return (
    <div className="profile-card">
      {/* Header with image */}
      <div className="profile-header">
        <img 
          src={imageUrl} 
          alt={`${name}'s profile`} 
          className="profile-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        <div className="profile-overlay">
          <h2 className="profile-name">{name}</h2>
          <p className="profile-role">{role}</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="profile-content">
        <div className="profile-info">
          <p><span className="label">Department:</span> {department}</p>
          <p><span className="label">Email:</span> {email}</p>
          <p><span className="label">Phone:</span> {phone}</p>
        </div>
        
        {/* Fun Fact Section */}
        <div>
          <button 
            onClick={toggleFunFact}
            className="fun-fact-button"
          >
            {showFunFact ? "Hide Fun Fact" : "Show Fun Fact"}
          </button>
          
          {showFunFact && (
            <div className="fun-fact-container">
              <p className="fun-fact-text"><span className="label">Fun Fact:</span> {funFact}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;