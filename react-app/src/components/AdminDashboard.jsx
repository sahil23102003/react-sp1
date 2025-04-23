import { useState, useEffect } from 'react';
import { fetchInterns, fetchMentors, assignMentor, generateReport } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [interns, setInterns] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState('');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [reportFilters, setReportFilters] = useState({
    department: '',
    status: ''
  });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [internsResponse, mentorsResponse] = await Promise.all([
          fetchInterns(),
          fetchMentors()
        ]);

        if (internsResponse.status === 200) {
          setInterns(internsResponse.data);
        } else {
          setError(internsResponse.message || 'Failed to load interns');
        }

        if (mentorsResponse.status === 200) {
          setMentors(mentorsResponse.data);
        } else {
          setError(prev => prev || mentorsResponse.message || 'Failed to load mentors');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAssignMentor = async () => {
    if (!selectedIntern || !selectedMentor) {
      return;
    }

    try {
      const response = await assignMentor(selectedIntern, parseInt(selectedMentor));
      
      if (response.status === 200) {
        // Update the local state
        setInterns(interns.map(intern => 
          intern.id === selectedIntern 
            ? { ...intern, mentorId: parseInt(selectedMentor) }
            : intern
        ));
        
        // Reset selected values
        setSelectedIntern(null);
        setSelectedMentor('');
        
        alert('Mentor assigned successfully');
      } else {
        alert(response.message || 'Failed to assign mentor');
      }
    } catch (err) {
      console.error('Error assigning mentor:', err);
      alert('An unexpected error occurred');
    }
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    setReportSuccess(false);
    
    try {
      const response = await generateReport(reportFormat, reportFilters);
      
      if (response.status === 200) {
        setReportSuccess(true);
        
        // In a real app, this would download the file
        // For this demo, we'll just log the data
        console.log('Generated report data:', response.data);
        
        // Simulate a file download
        setTimeout(() => {
          const filename = `intern_report_${new Date().toISOString().split('T')[0]}.${reportFormat}`;
          alert(`Report "${filename}" has been generated. In a real application, this would trigger a download.`);
        }, 500);
      } else {
        alert(response.message || 'Failed to generate report');
      }
    } catch (err) {
      console.error('Error generating report:', err);
      alert('An unexpected error occurred');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleReportFilterChange = (e) => {
    const { name, value } = e.target;
    setReportFilters({
      ...reportFilters,
      [name]: value
    });
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <div className="loading">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  // Get unique departments for filtering
  const departments = [...new Set(interns.map(intern => intern.department))];
  
  // Get interns without assigned mentors
  const internsWithoutMentors = interns.filter(intern => !intern.mentorId);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`admin-tab ${activeTab === 'mentors' ? 'active' : ''}`}
          onClick={() => setActiveTab('mentors')}
        >
          Mentor Assignment
        </button>
        <button 
          className={`admin-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-cards">
              <div className="stat-card">
                <h3>Total Interns</h3>
                <div className="stat-value">{interns.length}</div>
              </div>
              <div className="stat-card">
                <h3>Total Mentors</h3>
                <div className="stat-value">{mentors.length}</div>
              </div>
              <div className="stat-card">
                <h3>Active Interns</h3>
                <div className="stat-value">
                  {interns.filter(intern => intern.status === 'active').length}
                </div>
              </div>
              <div className="stat-card">
                <h3>Unassigned Interns</h3>
                <div className="stat-value">{internsWithoutMentors.length}</div>
              </div>
            </div>
            
            <h2>Department Distribution</h2>
            <div className="department-chart">
              {departments.map(dept => {
                const count = interns.filter(intern => intern.department === dept).length;
                return (
                  <div key={dept} className="chart-bar-container">
                    <div className="chart-label">{dept}</div>
                    <div className="chart-bar" style={{ width: `${Math.min(100, count * 10)}%` }}>
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <h2>Recent Interns</h2>
            <div className="recent-interns">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Mentor</th>
                  </tr>
                </thead>
                <tbody>
                  {interns.slice(0, 5).map(intern => {
                    const mentorName = mentors.find(m => m.id === intern.mentorId)?.name || 'Not Assigned';
                    return (
                      <tr key={intern.id}>
                        <td>{intern.name}</td>
                        <td>{intern.department}</td>
                        <td>
                          <span className={`status-badge ${intern.status}`}>
                            {intern.status}
                          </span>
                        </td>
                        <td>{new Date(intern.joinDate).toLocaleDateString()}</td>
                        <td>{mentorName}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'mentors' && (
          <div className="mentors-tab">
            <h2>Assign Mentors to Interns</h2>
            
            <div className="assign-form">
              <div className="form-group">
                <label>Select Intern</label>
                <select 
                  value={selectedIntern || ''}
                  onChange={(e) => setSelectedIntern(parseInt(e.target.value))}
                >
                  <option value="">-- Select Intern --</option>
                  {interns.map(intern => (
                    <option key={intern.id} value={intern.id}>
                      {intern.name} - {intern.department} 
                      {intern.mentorId ? ' (Already has mentor)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Select Mentor</label>
                <select
                  value={selectedMentor}
                  onChange={(e) => setSelectedMentor(e.target.value)}
                  disabled={!selectedIntern}
                >
                  <option value="">-- Select Mentor --</option>
                  {mentors.map(mentor => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.name} - {mentor.department}
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                className="assign-button"
                onClick={handleAssignMentor}
                disabled={!selectedIntern || !selectedMentor}
              >
                Assign Mentor
              </button>
            </div>
            
            <h2>Current Assignments</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Intern</th>
                  <th>Department</th>
                  <th>Mentor</th>
                  <th>Mentor Department</th>
                </tr>
              </thead>
              <tbody>
                {interns.map(intern => {
                  const mentor = mentors.find(m => m.id === intern.mentorId);
                  return (
                    <tr key={intern.id}>
                      <td>{intern.name}</td>
                      <td>{intern.department}</td>
                      <td>{mentor ? mentor.name : 'Not Assigned'}</td>
                      <td>{mentor ? mentor.department : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'reports' && (
          <div className="reports-tab">
            <h2>Generate Reports</h2>
            
            <div className="report-form">
              <div className="form-group">
                <label>Report Format</label>
                <select
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value)}
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Department Filter</label>
                <select
                  name="department"
                  value={reportFilters.department}
                  onChange={handleReportFilterChange}
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Status Filter</label>
                <select
                  name="status"
                  value={reportFilters.status}
                  onChange={handleReportFilterChange}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <button 
                className="generate-button"
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? 'Generating...' : 'Generate Report'}
              </button>
              
              {reportSuccess && (
                <div className="success-message">
                  Report generated successfully!
                </div>
              )}
            </div>
            
            <h2>Available Reports</h2>
            <div className="no-reports-message">
              No previous reports available. Generate a new report above.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;