import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from '../api';
import { ChartIcon, TargetIcon, TrophyIcon, MapIcon, LocationIcon, LightningIcon, TicketIcon, TrendUpIcon, MoneyIcon } from './Icons';
import "../styles/Dashboard.css";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const [userSummaries, setUserSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("analytics");
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL}/api/users/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUserSummaries(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(
          err.response && err.response.status === 401
            ? "Unauthorized: Admin only. Please login as admin."
            : "Unable to load user summary."
        );
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    if (activeView === "users") {
      // Fetch all users for user management
      axios.get(`${BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setUsers(res.data);
        })
        .catch(err => {
          console.error("Error fetching users:", err);
        });
    }
  }, [activeView, token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.delete(`${BASE_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => {
          setUsers(users.filter(user => user.id !== userId));
          alert("User deleted successfully");
        })
        .catch(err => {
          alert("Error deleting user: " + (err.response?.data?.message || "Unknown error"));
        });
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-topbar">
        <div className="dashboard-header">
          <h1>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Sundaram Travel Management - Admin
          </h1>
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-layout">
        <div className="admin-sidebar">
          <div className="sidebar-menu">
            <button 
              className={activeView === "analytics" ? "menu-item active" : "menu-item"}
              onClick={() => setActiveView("analytics")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              Analytics Dashboard
            </button>
            <button 
              className={activeView === "summary" ? "menu-item active" : "menu-item"}
              onClick={() => setActiveView("summary")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="20" x2="12" y2="10"/>
                <line x1="18" y1="20" x2="18" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="16"/>
              </svg>
              View Summary
            </button>
            <button 
              className={activeView === "users" ? "menu-item active" : "menu-item"}
              onClick={() => setActiveView("users")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Manage Users
            </button>
          </div>
        </div>

        <div className="admin-content">
          <div className="welcome-message">
            <h2>Welcome, Admin</h2>
            <p>Oversee all users' itineraries, bookings, and system analytics.</p>
          </div>

          {activeView === "analytics" && (
            <>
              <h2 style={{marginBottom: '2rem', fontSize: '1.8rem', color: '#2d3748'}}>
                <ChartIcon size={24} color="#667eea" /> Analytics Dashboard
              </h2>
              {loading ? (
                <div style={{textAlign: 'center', padding: '3rem'}}>
                  <div className="loading-spinner"></div>
                  <p>Loading analytics...</p>
                </div>
              ) : error ? (
                <div style={{padding: '2rem', backgroundColor: '#fee', borderRadius: '8px', color: '#c00'}}>
                  {error}
                </div>
              ) : (
                <>
                  {/* Key Metrics Cards */}
                  <div className="stats-grid-modern">
                    <div className="stat-card-modern primary">
                      <div className="stat-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      </div>
                      <div className="stat-content">
                        <h4>Total Users</h4>
                        <p className="stat-number">{userSummaries.length}</p>
                        <span className="stat-label">Active accounts</span>
                      </div>
                    </div>
                    
                    <div className="stat-card-modern success">
                      <div className="stat-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                          <line x1="8" y1="2" x2="8" y2="18"/>
                          <line x1="16" y1="6" x2="16" y2="22"/>
                        </svg>
                      </div>
                      <div className="stat-content">
                        <h4>Total Itineraries</h4>
                        <p className="stat-number">{userSummaries.reduce((sum, user) => sum + user.itineraryCount, 0)}</p>
                        <span className="stat-label">Planned trips</span>
                      </div>
                    </div>
                    
                    <div className="stat-card-modern warning">
                      <div className="stat-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                      </div>
                      <div className="stat-content">
                        <h4>Total Destinations</h4>
                        <p className="stat-number">{userSummaries.reduce((sum, user) => sum + user.destinationCount, 0)}</p>
                        <span className="stat-label">Unique places</span>
                      </div>
                    </div>
                    
                    <div className="stat-card-modern info">
                      <div className="stat-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                      </div>
                      <div className="stat-content">
                        <h4>Total Activities</h4>
                        <p className="stat-number">{userSummaries.reduce((sum, user) => sum + user.activityCount, 0)}</p>
                        <span className="stat-label">Scheduled events</span>
                      </div>
                    </div>
                  </div>

                  {/* Charts Section */}
                  <div className="charts-grid">
                    {/* Bar Chart - User Activity Distribution */}
                    <div className="chart-container">
                      <h3 className="chart-title"><ChartIcon size={20} color="#667eea" /> User Activity Distribution</h3>
                      <div className="bar-chart">
                        {userSummaries.slice(0, 8).map((user, index) => {
                          const totalActivity = user.itineraryCount + user.destinationCount + user.activityCount + user.bookingCount;
                          const maxActivity = Math.max(...userSummaries.map(u => 
                            u.itineraryCount + u.destinationCount + u.activityCount + u.bookingCount
                          ));
                          const percentage = maxActivity > 0 ? (totalActivity / maxActivity) * 100 : 0;
                          
                          return (
                            <div key={user.userId} className="bar-item">
                              <div className="bar-label">{user.username.substring(0, 8)}</div>
                              <div className="bar-track">
                                <div 
                                  className="bar-fill" 
                                  style={{
                                    width: `${percentage}%`,
                                    background: `linear-gradient(135deg, #667eea ${index * 10}%, #764ba2 100%)`
                                  }}
                                  title={`${totalActivity} total activities`}
                                >
                                  <span className="bar-value">{totalActivity}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pie Chart - Content Distribution */}
                    <div className="chart-container">
                      <h3 className="chart-title"><TargetIcon size={20} color="#667eea" /> Content Distribution</h3>
                      <div className="pie-chart-wrapper">
                        {(() => {
                          const totalItineraries = userSummaries.reduce((sum, user) => sum + user.itineraryCount, 0);
                          const totalDestinations = userSummaries.reduce((sum, user) => sum + user.destinationCount, 0);
                          const totalActivities = userSummaries.reduce((sum, user) => sum + user.activityCount, 0);
                          const totalBookings = userSummaries.reduce((sum, user) => sum + user.bookingCount, 0);
                          const total = totalItineraries + totalDestinations + totalActivities + totalBookings;
                          
                          const segments = [
                            { label: 'Itineraries', value: totalItineraries, color: '#667eea', percentage: ((totalItineraries / total) * 100).toFixed(1) },
                            { label: 'Destinations', value: totalDestinations, color: '#f093fb', percentage: ((totalDestinations / total) * 100).toFixed(1) },
                            { label: 'Activities', value: totalActivities, color: '#4facfe', percentage: ((totalActivities / total) * 100).toFixed(1) },
                            { label: 'Bookings', value: totalBookings, color: '#43e97b', percentage: ((totalBookings / total) * 100).toFixed(1) }
                          ];
                          
                          return (
                            <>
                              <div className="pie-chart">
                                {segments.map((segment, index) => (
                                  <div 
                                    key={index}
                                    className="pie-segment"
                                    style={{
                                      '--percentage': `${segment.percentage}%`,
                                      '--color': segment.color,
                                      '--rotation': `${segments.slice(0, index).reduce((sum, s) => sum + parseFloat(s.percentage), 0) * 3.6}deg`
                                    }}
                                  />
                                ))}
                              </div>
                              <div className="pie-legend">
                                {segments.map((segment, index) => (
                                  <div key={index} className="legend-item">
                                    <div className="legend-color" style={{backgroundColor: segment.color}}></div>
                                    <div className="legend-label">
                                      <strong>{segment.label}</strong>
                                      <span>{segment.value} ({segment.percentage}%)</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Top Users Section */}
                  <div className="chart-container" style={{marginTop: '2rem'}}>
                    <h3 className="chart-title"><TrophyIcon size={20} color="#667eea" /> Top Active Users</h3>
                    <div className="top-users-grid">
                      {userSummaries
                        .map(user => ({
                          ...user,
                          totalActivity: user.itineraryCount + user.destinationCount + user.activityCount + user.bookingCount + user.expenseCount
                        }))
                        .sort((a, b) => b.totalActivity - a.totalActivity)
                        .slice(0, 5)
                        .map((user, index) => (
                          <div key={user.userId} className="top-user-card">
                            <div className="user-rank">{index + 1}</div>
                            <div className="user-avatar">
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                              </svg>
                            </div>
                            <div className="user-stats">
                              <h4>{user.username}</h4>
                              <p className="total-activity">{user.totalActivity} Total Activities</p>
                              <div className="mini-stats">
                                <span title="Itineraries"><MapIcon size={14} /> {user.itineraryCount}</span>
                                <span title="Destinations"><LocationIcon size={14} /> {user.destinationCount}</span>
                                <span title="Activities"><LightningIcon size={14} /> {user.activityCount}</span>
                                <span title="Bookings"><TicketIcon size={14} /> {user.bookingCount}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Insights Cards */}
                  <div className="insights-grid">
                    <div className="insight-card">
                      <h4><TrendUpIcon size={20} color="#667eea" /> Average Activities per User</h4>
                      <p className="insight-value">
                        {userSummaries.length > 0 
                          ? (userSummaries.reduce((sum, u) => sum + u.activityCount, 0) / userSummaries.length).toFixed(1)
                          : 0}
                      </p>
                    </div>
                    <div className="insight-card">
                      <h4><TargetIcon size={20} color="#667eea" /> Average Destinations per User</h4>
                      <p className="insight-value">
                        {userSummaries.length > 0 
                          ? (userSummaries.reduce((sum, u) => sum + u.destinationCount, 0) / userSummaries.length).toFixed(1)
                          : 0}
                      </p>
                    </div>
                    <div className="insight-card">
                      <h4><MoneyIcon size={20} color="#667eea" /> Total Expenses Tracked</h4>
                      <p className="insight-value">
                        {userSummaries.reduce((sum, u) => sum + u.expenseCount, 0)}
                      </p>
                    </div>
                    <div className="insight-card">
                      <h4><TicketIcon size={20} color="#667eea" /> Total Bookings</h4>
                      <p className="insight-value">
                        {userSummaries.reduce((sum, u) => sum + u.bookingCount, 0)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {activeView === "summary" && (
            <>
              <h2>User Summaries</h2>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : userSummaries.length === 0 ? (
                <p>No user data found.</p>
              ) : (
                <>
                  <table className="summary-table">
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Itineraries</th>
                        <th>Destinations</th>
                        <th>Activities</th>
                        <th>Bookings</th>
                        <th>Expenses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userSummaries.map(user => (
                        <tr key={user.userId}>
                          <td>{user.userId}</td>
                          <td>{user.username}</td>
                          <td>{user.itineraryCount}</td>
                          <td>{user.destinationCount}</td>
                          <td>{user.activityCount}</td>
                          <td>{user.bookingCount}</td>
                          <td>{user.expenseCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="data-visualizations">
                    <h3>Analytics Overview</h3>
                    <div className="stats-grid">
                      <div className="stat-card">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        <h4>Total Users</h4>
                        <p className="stat-number">{userSummaries.length}</p>
                      </div>
                      <div className="stat-card">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                          <line x1="8" y1="2" x2="8" y2="18"/>
                          <line x1="16" y1="6" x2="16" y2="22"/>
                        </svg>
                        <h4>Total Itineraries</h4>
                        <p className="stat-number">{userSummaries.reduce((sum, user) => sum + user.itineraryCount, 0)}</p>
                      </div>
                      <div className="stat-card">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <h4>Total Destinations</h4>
                        <p className="stat-number">{userSummaries.reduce((sum, user) => sum + user.destinationCount, 0)}</p>
                      </div>
                      <div className="stat-card">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <h4>Total Activities</h4>
                        <p className="stat-number">{userSummaries.reduce((sum, user) => sum + user.activityCount, 0)}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {activeView === "users" && (
            <>
              <h2>Manage Users</h2>
              {users.filter(user => user.id !== 10).length === 0 ? (
                <p>No users found.</p>
              ) : (
                <div className="users-list">
                  {users.filter(user => user.id !== 10).map(user => (
                    <div key={user.id} className="user-card">
                      <div className="user-info">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <div className="user-details">
                          <h4>{user.username}</h4>
                          <p>{user.email}</p>
                          <span className="user-id">ID: {user.id}</span>
                        </div>
                      </div>
                      <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
