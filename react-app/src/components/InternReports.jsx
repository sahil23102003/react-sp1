import { useState, useEffect, useMemo } from 'react';
import { fetchInterns } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
         PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import './InternReports.css';

const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#ec4899', '#f59e0b', '#6b7280'];

const InternReports = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchInterns();
        
        if (response.status === 200) {
          // Add mock performance and tech stack data if not present
          const internsWithMetrics = response.data.map(intern => {
            if (!intern.performance) {
              intern.performance = {
                rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
                sprints: Math.floor(Math.random() * 8) + 1,
                projects: Math.floor(Math.random() * 4) + 1,
                courses: Math.floor(Math.random() * 5) + 1
              };
            }
            
            if (!intern.techStacks) {
              const availableTechs = ['JavaScript', 'React', 'Node.js', 'Python', 'Django', 'Angular', 'Vue', 'TypeScript', 'Java', 'Spring', 'PHP', 'Laravel', 'MongoDB', 'MySQL', 'PostgreSQL', 'GraphQL', 'AWS', 'Docker'];
              const techCount = Math.floor(Math.random() * 5) + 1;
              const shuffled = [...availableTechs].sort(() => 0.5 - Math.random());
              intern.techStacks = shuffled.slice(0, techCount);
            }
            
            return intern;
          });
          
          setInterns(internsWithMetrics);
        } else {
          setError(response.message || 'Failed to load interns');
        }
      } catch (err) {
        console.error('Error loading interns for reports:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter interns based on department and time range
  const filteredInterns = useMemo(() => {
    let result = [...interns];
    
    // Apply department filter
    if (departmentFilter) {
      result = result.filter(intern => intern.department === departmentFilter);
    }
    
    // Apply time filter based on join date
    if (timeFilter !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (timeFilter) {
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }
      
      result = result.filter(intern => new Date(intern.joinDate) >= cutoffDate);
    }
    
    return result;
  }, [interns, departmentFilter, timeFilter]);

  // Get unique departments for filter
  const departments = useMemo(() => {
    const depts = [...new Set(interns.map(intern => intern.department))];
    return depts;
  }, [interns]);

  // Data for department distribution chart
  const departmentData = useMemo(() => {
    const deptCounts = filteredInterns.reduce((acc, intern) => {
      acc[intern.department] = (acc[intern.department] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(deptCounts).map(([name, value]) => ({ name, value }));
  }, [filteredInterns]);

  // Data for tech stack popularity chart
  const techStackData = useMemo(() => {
    const techCounts = {};
    
    filteredInterns.forEach(intern => {
      if (intern.techStacks) {
        intern.techStacks.forEach(tech => {
          techCounts[tech] = (techCounts[tech] || 0) + 1;
        });
      }
    });
    
    // Sort by count and take top 10
    return Object.entries(techCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  }, [filteredInterns]);

  // Data for performance ratings chart
  const ratingData = useMemo(() => {
    // Group by rating rounded to nearest 0.5
    const ratingGroups = filteredInterns.reduce((acc, intern) => {
      if (intern.performance && intern.performance.rating) {
        const roundedRating = Math.round(parseFloat(intern.performance.rating) * 2) / 2;
        acc[roundedRating] = (acc[roundedRating] || 0) + 1;
      }
      return acc;
    }, {});
    
    // Convert to array and sort by rating
    return Object.entries(ratingGroups)
      .map(([rating, count]) => ({ rating: parseFloat(rating), count }))
      .sort((a, b) => a.rating - b.rating);
  }, [filteredInterns]);

  if (loading) {
    return (
      <div className="reports-container">
        <h2 className="reports-title">Intern Reports</h2>
        <div className="loading-container">
          Loading reports data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-container">
        <h2 className="reports-title">Intern Reports</h2>
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <h2 className="reports-title">Intern Reports Dashboard</h2>
      
      <div className="reports-filters">
        <div className="reports-filter">
          <label className="reports-filter-label">Department</label>
          <select 
            className="reports-filter-select"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        <div className="reports-filter">
          <label className="reports-filter-label">Time Period</label>
          <select 
            className="reports-filter-select"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>
      
      <div className="report-summary">
        <div className="summary-item">
          <p className="summary-value">{filteredInterns.length}</p>
          <p className="summary-label">Total Interns</p>
        </div>
        
        <div className="summary-item">
          <p className="summary-value">
            {departments.length}
          </p>
          <p className="summary-label">Departments</p>
        </div>
        
        <div className="summary-item">
          <p className="summary-value">
            {filteredInterns.length > 0 
              ? (filteredInterns.reduce((sum, intern) => sum + (intern.performance ? parseFloat(intern.performance.rating) : 0), 0) / filteredInterns.length).toFixed(1)
              : 'N/A'
            }
          </p>
          <p className="summary-label">Avg Rating</p>
        </div>
        
        <div className="summary-item">
          <p className="summary-value">
            {techStackData.length > 0 ? techStackData[0].name : 'N/A'}
          </p>
          <p className="summary-label">Top Tech</p>
        </div>
      </div>
      
      <div className="reports-grid">
        <div className="report-card">
          <h3 className="report-card-title">Department Distribution</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} interns`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="report-card">
          <h3 className="report-card-title">Performance Ratings</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} interns`, 'Count']} />
                <Bar dataKey="count" fill="#3b82f6" name="Interns" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="report-card">
          <h3 className="report-card-title">Popular Tech Stacks</h3>
          <div className="tech-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={techStackData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip formatter={(value) => [`${value} interns`, 'Count']} />
                <Bar dataKey="count" fill="#10b981" name="Interns" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="report-card">
          <h3 className="report-card-title">Top Performers</h3>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredInterns
                .filter(intern => intern.performance && intern.performance.rating)
                .sort((a, b) => parseFloat(b.performance.rating) - parseFloat(a.performance.rating))
                .slice(0, 5)
                .map(intern => (
                  <tr key={intern.id}>
                    <td>{intern.name}</td>
                    <td>{intern.department}</td>
                    <td>{intern.performance.rating}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InternReports;