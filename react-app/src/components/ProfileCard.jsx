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
      <div className="profile-header">
        <img 
          src={imageUrl} 
          alt={`${name}'s profile`} 
          className="profile-avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
          }}
        />
      </div>
      
      <div className="profile-content">
        <h3 className="profile-name">{name}</h3>
        <p className="profile-role">{role}</p>
        <span className="profile-department">{department}</span>
        
        <div className="profile-contact">
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Phone:</strong> {phone}</p>
        </div>
        
        <button 
          onClick={toggleFunFact}
          className="fun-fact-button"
        >
          {showFunFact ? "Hide Fun Fact" : "Show Fun Fact"}
        </button>
        
        {showFunFact && (
          <div className="profile-fun-fact">
            {funFact}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;