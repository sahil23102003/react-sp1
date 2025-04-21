import { useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import { fetchInterns } from '../services/api';
import './InternDirectory.css';

const InternDirectory = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadInterns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call our simulated API
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

  return (
    <div className="directory-container">
      <h2 className="directory-title">Intern Directory</h2>
      
      <button className="refresh-button" onClick={handleRefresh}>
        Refresh Data
      </button>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="loading">Loading interns...</div>
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
    </div>
  );
};

export default InternDirectory;