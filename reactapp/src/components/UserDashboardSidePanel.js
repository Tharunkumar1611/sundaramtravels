import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BASE_URL, API_ENDPOINTS } from '../api';
import { MapIcon, ChartIcon, UserIcon, LocationIcon, TicketIcon, MoneyIcon, TargetIcon, PlaneIcon, DoorIcon, EditIcon, TrashIcon, SaveIcon, SparklesIcon, MailboxIcon } from './Icons';
import PlaceAutocomplete from './PlaceAutocomplete';
import "../styles/DashboardSidePanel.css";

const UserDashboard = () => {
  // User Authentication
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  // Username state that can be updated
  const [displayUsername, setDisplayUsername] = useState("");
  
  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    if (!token) {
      // No token found, redirect to login
      navigate('/');
      return;
    }
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDisplayUsername(decoded.username || decoded.sub || "Traveler");
      } catch (error) {
        console.error("Error decoding token:", error);
        // Invalid token, redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        navigate('/');
      }
    }
  }, [token, navigate]);

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false); // Close sidebar on desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside (mobile)
  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Navigation State
  const [activeSection, setActiveSection] = useState('itineraries');
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Itinerary States & Handlers
  const [itineraries, setItineraries] = useState([]);
  const [form, setForm] = useState({
    tripName: "",
    eventTitle: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    description: "",
    status: "PENDING",
    comment: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Itinerary Search/Sort/Filter
  const [itinerarySearch, setItinerarySearch] = useState("");
  const [itinerarySort, setItinerarySort] = useState({ field: "tripName", direction: "asc" });
  const [itineraryFilter, setItineraryFilter] = useState("ALL");

  // Destinations
  const [destinationForms, setDestinationForms] = useState({});
  const [destinations, setDestinations] = useState({});
  const [destinationEditId, setDestinationEditId] = useState({});
  const [showDestForm, setShowDestForm] = useState({});
  const [placeSearchQuery, setPlaceSearchQuery] = useState({});
  
  // Destination Search/Sort (nested by itinerary)
  const [destSearch, setDestSearch] = useState({});
  const [destSort, setDestSort] = useState({});

  // Activities
  const [activityForms, setActivityForms] = useState({});
  const [activities, setActivities] = useState({});
  const [editingActivityId, setEditingActivityId] = useState({});
  const [showActivityForm, setShowActivityForm] = useState({});
  
  // Activity Pagination & Search/Sort (nested by destination)
  const [activityPage, setActivityPage] = useState({});
  const [activityTotalPages, setActivityTotalPages] = useState({});
  const [activitySearch, setActivitySearch] = useState({});
  const [activitySort, setActivitySort] = useState({});

  // Bookings
  const [bookingForms, setBookingForms] = useState({});
  const [bookings, setBookings] = useState({});
  const [editingBookingId, setEditingBookingId] = useState({});
  const [showBookingForm, setShowBookingForm] = useState({});
  
  // Booking Pagination & Search/Sort/Filter (nested by itinerary)
  const [bookingPage, setBookingPage] = useState({});
  const [bookingTotalPages, setBookingTotalPages] = useState({});
  const [bookingSearch, setBookingSearch] = useState({});
  const [bookingSort, setBookingSort] = useState({});
  const [bookingFilter, setBookingFilter] = useState({});

  // Expenses
  const [expenseForms, setExpenseForms] = useState({});
  const [expenses, setExpenses] = useState({});
  const [editingExpenseId, setEditingExpenseId] = useState({});
  const [showExpenseForm, setShowExpenseForm] = useState({});
  
  // Expense Search/Sort/Filter (nested by itinerary)
  const [expenseSearch, setExpenseSearch] = useState({});
  const [expenseSort, setExpenseSort] = useState({});
  const [expenseFilter, setExpenseFilter] = useState({});

  // Profile
  const [userProfile, setUserProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    status: "ACTIVE"
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch User Profile
  const fetchUserProfile = () => {
    axios
      .get(`${BASE_URL}${API_ENDPOINTS.USER_PROFILE}`, config)
      .then(res => {
        setUserProfile(res.data);
        setProfileForm({
          username: res.data.username || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          city: res.data.city || "",
          state: res.data.state || "",
          country: res.data.country || "",
          status: res.data.status || "ACTIVE"
        });
      })
      .catch(err => console.error(err));
  };

  const handleProfileChange = e => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = e => {
    e.preventDefault();
    axios
      .put(`${BASE_URL}${API_ENDPOINTS.USER_PROFILE}`, profileForm, config)
      .then(res => {
        setUserProfile(res.data);
        setIsEditingProfile(false);
        // Update the displayed username in sidebar
        setDisplayUsername(res.data.username);
        alert("Profile updated successfully!");
      })
      .catch(err => {
        console.error(err);
        alert("Failed to update profile");
      });
  };

  // CRUD: Itinerary
  const fetchItineraries = () => {
    axios
      .get(`${BASE_URL}${API_ENDPOINTS.ITINERARY}`, config)
      .then(res => setItineraries(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (token) {
      fetchItineraries();
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = e => {
    e.preventDefault();
    
    // Check if token exists
    if (!token) {
      alert('Your session has expired. Please login again.');
      navigate('/');
      return;
    }
    
    axios
      .post(`${BASE_URL}${API_ENDPOINTS.ITINERARY}`, form, config)
      .then(() => {
        fetchItineraries();
        setForm({
          tripName: "",
          eventTitle: "",
          eventDate: "",
          eventTime: "",
          eventLocation: "",
          description: "",
          status: "PENDING",
          comment: ""
        });
        setShowForm(false);
      })
      .catch(err => {
        console.error('Error adding itinerary:', err);
        if (err.response && err.response.status === 401) {
          alert('Your session has expired. Please login again.');
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("role");
          navigate('/');
        } else {
          alert('Failed to add itinerary. Please try again.');
        }
      });
  };

  const handleUpdate = e => {
    e.preventDefault();
    axios
      .put(`${BASE_URL}${API_ENDPOINTS.ITINERARY_BY_ID(editingId)}`, form, config)
      .then(() => {
        setEditingId(null);
        fetchItineraries();
        setForm({
          tripName: "",
          eventTitle: "",
          eventDate: "",
          eventTime: "",
          eventLocation: "",
          description: "",
          status: "PENDING",
          comment: ""
        });
        setShowForm(false);
      })
      .catch(err => console.error(err));
  };

  const handleEdit = item => {
    setEditingId(item.id);
    setForm({ ...item });
    setShowForm(true);
  };

  const handleDelete = id => {
    axios
      .delete(`${BASE_URL}${API_ENDPOINTS.ITINERARY_BY_ID(id)}`, config)
      .then(() => fetchItineraries())
      .catch(err => console.error(err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/");
  };

  const selectItinerary = (id) => {
    setSelectedItinerary(id);
    setActiveSection('destinations');
    fetchDestinations(id);
  };

  // Destinations CRUD
  const fetchDestinations = (itineraryId) => {
    axios
      .get(`${BASE_URL}${API_ENDPOINTS.DESTINATIONS}`, config)
      .then(res => {
        const filtered = res.data.filter(d => d.itineraryId === itineraryId);
        setDestinations({ ...destinations, [itineraryId]: filtered });
      })
      .catch(err => console.error(err));
  };

  const handleDestinationChange = (itineraryId, e) => {
    setDestinationForms({
      ...destinationForms,
      [itineraryId]: {
        ...destinationForms[itineraryId],
        [e.target.name]: e.target.value
      }
    });
  };

  const handlePlaceSelect = (itineraryId, placeData) => {
    setDestinationForms({
      ...destinationForms,
      [itineraryId]: {
        ...destinationForms[itineraryId],
        coordinates: placeData.coordinates
      }
    });
    setPlaceSearchQuery({
      ...placeSearchQuery,
      [itineraryId]: placeData.name
    });
  };

  const handleAddDestination = itineraryId => {
    const data = {
      ...destinationForms[itineraryId],
      itinerary: { id: itineraryId }
    };
    axios
      .post(`${BASE_URL}${API_ENDPOINTS.DESTINATIONS}`, data, config)
      .then(res => {
        // Refetch destinations to ensure we have the complete data
        fetchDestinations(itineraryId);
        setDestinationForms({ ...destinationForms, [itineraryId]: {} });
        setShowDestForm({ ...showDestForm, [itineraryId]: false });
        setPlaceSearchQuery({ ...placeSearchQuery, [itineraryId]: "" });
      })
      .catch(err => console.error(err));
  };

  const handleEditDestination = (itineraryId, dest) => {
    setDestinationEditId({ ...destinationEditId, [itineraryId]: dest.destinationId });
    setDestinationForms({ ...destinationForms, [itineraryId]: { ...dest } });
    setShowDestForm({ ...showDestForm, [itineraryId]: true });
    // Set place search query to the destination name when editing
    setPlaceSearchQuery({ ...placeSearchQuery, [itineraryId]: dest.name || "" });
  };

  const handleUpdateDestination = itineraryId => {
    const destId = destinationEditId[itineraryId];
    const data = {
      ...destinationForms[itineraryId],
      destinationId: destId,
      itinerary: { id: itineraryId }
    };
    axios
      .put(`${BASE_URL}${API_ENDPOINTS.DESTINATION_BY_ID(destId)}`, data, config)
      .then(res => {
        // Refetch destinations to ensure we have the complete updated data
        fetchDestinations(itineraryId);
        setDestinationForms({ ...destinationForms, [itineraryId]: {} });
        setDestinationEditId({ ...destinationEditId, [itineraryId]: null });
        setShowDestForm({ ...showDestForm, [itineraryId]: false });
        setPlaceSearchQuery({ ...placeSearchQuery, [itineraryId]: "" });
      })
      .catch(err => console.error(err));
  };

  const handleDeleteDestination = (itineraryId, destId) => {
    axios
      .delete(`${BASE_URL}${API_ENDPOINTS.DESTINATION_BY_ID(destId)}`, config)
      .then(() => {
        setDestinations({
          ...destinations,
          [itineraryId]: destinations[itineraryId].filter(d => d.destinationId !== destId)
        });
      })
      .catch(err => console.error(err));
  };

  // Activities CRUD
  const fetchActivities = (destinationId, page = 0) => {
    const sortField = activitySort[destinationId]?.field || "activityId";
    const sortDir = activitySort[destinationId]?.direction || "asc";
    
    axios
      .get(`${BASE_URL}/api/activities/paged?page=${page}&size=5&sortBy=${sortField}&direction=${sortDir}`, config)
      .then(res => {
        // Filter by destinationId on the client side (backend doesn't support filtering by destination)
        const filtered = res.data.content.filter(a => a.destinationId === destinationId);
        setActivities({ ...activities, [destinationId]: filtered });
        setActivityPage({ ...activityPage, [destinationId]: res.data.number });
        setActivityTotalPages({ ...activityTotalPages, [destinationId]: res.data.totalPages });
      })
      .catch(err => console.error(err));
  };

  const handleActivityChange = (destinationId, e) => {
    const { name, value, type, checked } = e.target;
    setActivityForms({
      ...activityForms,
      [destinationId]: {
        ...activityForms[destinationId],
        [name]: type === 'checkbox' ? checked : value
      }
    });
  };

  const handleAddActivity = destinationId => {
    const data = {
      ...activityForms[destinationId],
      destination: { destinationId }
    };
    axios
      .post(`${BASE_URL}${API_ENDPOINTS.ACTIVITIES}`, data, config)
      .then(res => {
        // Refetch activities to ensure we have the complete data
        fetchActivities(destinationId);
        setActivityForms({ ...activityForms, [destinationId]: {} });
        setShowActivityForm({ ...showActivityForm, [destinationId]: false });
      })
      .catch(err => console.error(err));
  };

  const handleEditActivity = (destinationId, activity) => {
    setEditingActivityId({ ...editingActivityId, [destinationId]: activity.activityId });
    setActivityForms({ ...activityForms, [destinationId]: { ...activity } });
    setShowActivityForm({ ...showActivityForm, [destinationId]: true });
  };

  const handleUpdateActivity = destinationId => {
    const actId = editingActivityId[destinationId];
    const data = {
      ...activityForms[destinationId],
      activityId: actId,
      destination: { destinationId }
    };
    axios
      .put(`${BASE_URL}${API_ENDPOINTS.ACTIVITY_BY_ID(actId)}`, data, config)
      .then(res => {
        // Refetch activities to ensure we have the complete updated data
        fetchActivities(destinationId);
        setActivityForms({ ...activityForms, [destinationId]: {} });
        setEditingActivityId({ ...editingActivityId, [destinationId]: null });
        setShowActivityForm({ ...showActivityForm, [destinationId]: false });
      })
      .catch(err => console.error(err));
  };

  const handleDeleteActivity = (destinationId, actId) => {
    axios
      .delete(`${BASE_URL}${API_ENDPOINTS.ACTIVITY_BY_ID(actId)}`, config)
      .then(() => {
        setActivities({
          ...activities,
          [destinationId]: activities[destinationId].filter(a => a.activityId !== actId)
        });
      })
      .catch(err => console.error(err));
  };

  const selectDestination = (destId) => {
    setSelectedDestination(destId);
    setActiveSection('activities');
    fetchActivities(destId);
  };

  // Bookings CRUD
  const fetchBookings = (itineraryId, page = 0) => {
    const sortField = bookingSort[itineraryId]?.field || "id";
    const sortDir = bookingSort[itineraryId]?.direction || "asc";
    
    axios
      .get(`${BASE_URL}${API_ENDPOINTS.BOOKINGS_PAGED}?page=${page}&size=5&sortBy=${sortField}&direction=${sortDir}`, config)
      .then(res => {
        // Filter by itineraryId on the client side (backend doesn't support filtering by itinerary)
        const filtered = res.data.content.filter(b => b.itineraryId === itineraryId);
        setBookings({ ...bookings, [itineraryId]: filtered });
        setBookingPage({ ...bookingPage, [itineraryId]: res.data.number });
        setBookingTotalPages({ ...bookingTotalPages, [itineraryId]: res.data.totalPages });
      })
      .catch(err => console.error(err));
  };

  const handleBookingChange = (itineraryId, e) => {
    setBookingForms({
      ...bookingForms,
      [itineraryId]: {
        ...bookingForms[itineraryId],
        [e.target.name]: e.target.value
      }
    });
  };

  const handleAddBooking = itineraryId => {
    const data = {
      ...bookingForms[itineraryId],
      itinerary: { id: itineraryId }
    };
    axios
      .post(`${BASE_URL}${API_ENDPOINTS.BOOKINGS}`, data, config)
      .then(res => {
        setBookings({
          ...bookings,
          [itineraryId]: [...(bookings[itineraryId] || []), res.data]
        });
        setBookingForms({ ...bookingForms, [itineraryId]: {} });
        setShowBookingForm({ ...showBookingForm, [itineraryId]: false });
      })
      .catch(err => console.error(err));
  };

  const handleEditBooking = (itineraryId, booking) => {
    setEditingBookingId({ ...editingBookingId, [itineraryId]: booking.id });
    setBookingForms({ ...bookingForms, [itineraryId]: { ...booking } });
    setShowBookingForm({ ...showBookingForm, [itineraryId]: true });
  };

  const handleUpdateBooking = itineraryId => {
    const bookingId = editingBookingId[itineraryId];
    const data = {
      ...bookingForms[itineraryId],
      id: bookingId,
      itinerary: { id: itineraryId }
    };
    axios
      .put(`${BASE_URL}${API_ENDPOINTS.BOOKING_BY_ID(bookingId)}`, data, config)
      .then(res => {
        setBookings({
          ...bookings,
          [itineraryId]: bookings[itineraryId].map(b =>
            b.id === bookingId ? res.data : b
          )
        });
        setBookingForms({ ...bookingForms, [itineraryId]: {} });
        setEditingBookingId({ ...editingBookingId, [itineraryId]: null });
        setShowBookingForm({ ...showBookingForm, [itineraryId]: false });
      })
      .catch(err => console.error(err));
  };

  const handleDeleteBooking = (itineraryId, bookingId) => {
    axios
      .delete(`${BASE_URL}${API_ENDPOINTS.BOOKING_BY_ID(bookingId)}`, config)
      .then(() => {
        setBookings({
          ...bookings,
          [itineraryId]: bookings[itineraryId].filter(b => b.id !== bookingId)
        });
      })
      .catch(err => console.error(err));
  };

  // Expenses CRUD
  const fetchExpenses = (itineraryId) => {
    axios
      .get(`${BASE_URL}${API_ENDPOINTS.EXPENSES}`, config)
      .then(res => {
        const filtered = res.data.filter(e => e.itineraryId === itineraryId);
        setExpenses({ ...expenses, [itineraryId]: filtered });
      })
      .catch(err => console.error(err));
  };

  const handleExpenseChange = (itineraryId, e) => {
    setExpenseForms({
      ...expenseForms,
      [itineraryId]: {
        ...expenseForms[itineraryId],
        [e.target.name]: e.target.value
      }
    });
  };

  const handleAddExpense = itineraryId => {
    const data = {
      ...expenseForms[itineraryId],
      itinerary: { id: itineraryId }
    };
    axios
      .post(`${BASE_URL}${API_ENDPOINTS.EXPENSES}`, data, config)
      .then(res => {
        setExpenses({
          ...expenses,
          [itineraryId]: [...(expenses[itineraryId] || []), res.data]
        });
        setExpenseForms({ ...expenseForms, [itineraryId]: {} });
        setShowExpenseForm({ ...showExpenseForm, [itineraryId]: false });
      })
      .catch(err => console.error(err));
  };

  const handleEditExpense = (itineraryId, expense) => {
    setEditingExpenseId({ ...editingExpenseId, [itineraryId]: expense.id });
    setExpenseForms({ ...expenseForms, [itineraryId]: { ...expense } });
    setShowExpenseForm({ ...showExpenseForm, [itineraryId]: true });
  };

  const handleUpdateExpense = itineraryId => {
    const expenseId = editingExpenseId[itineraryId];
    const data = {
      ...expenseForms[itineraryId],
      id: expenseId,
      itinerary: { id: itineraryId }
    };
    axios
      .put(`${BASE_URL}${API_ENDPOINTS.EXPENSE_BY_ID(expenseId)}`, data, config)
      .then(res => {
        setExpenses({
          ...expenses,
          [itineraryId]: expenses[itineraryId].map(e =>
            e.id === expenseId ? res.data : e
          )
        });
        setExpenseForms({ ...expenseForms, [itineraryId]: {} });
        setEditingExpenseId({ ...editingExpenseId, [itineraryId]: null });
        setShowExpenseForm({ ...showExpenseForm, [itineraryId]: false });
      })
      .catch(err => console.error(err));
  };

  const handleDeleteExpense = (itineraryId, expenseId) => {
    axios
      .delete(`${BASE_URL}${API_ENDPOINTS.EXPENSE_BY_ID(expenseId)}`, config)
      .then(() => {
        setExpenses({
          ...expenses,
          [itineraryId]: expenses[itineraryId].filter(e => e.id !== expenseId)
        });
      })
      .catch(err => console.error(err));
  };

  const filteredItineraries = itineraries
    .filter(item => {
      // Search filter
      const search = itinerarySearch.toLowerCase();
      const matchesSearch = item.tripName?.toLowerCase().includes(search) ||
                           item.eventTitle?.toLowerCase().includes(search) ||
                           item.eventLocation?.toLowerCase().includes(search);
      
      // Status filter
      const matchesStatus = itineraryFilter === "ALL" || item.status === itineraryFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort logic
      const field = itinerarySort.field;
      const direction = itinerarySort.direction === "asc" ? 1 : -1;
      
      let aVal = a[field];
      let bVal = b[field];
      
      // Handle null/undefined values
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      
      // String comparison
      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal) * direction;
      }
      
      // Number/Date comparison
      return (aVal > bVal ? 1 : -1) * direction;
    });

  const getCurrentItinerary = () => itineraries.find(i => i.id === selectedItinerary);
  const getCurrentDestination = () => {
    if (!selectedItinerary || !selectedDestination) return null;
    return destinations[selectedItinerary]?.find(d => d.destinationId === selectedDestination);
  };

  return (
    <div className="dashboard-wrapper">
      {/* Hamburger Menu Button for Mobile */}
      <button 
        className={`hamburger-menu ${isSidebarOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && isMobile && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Top Bar */}
      <div className="dashboard-topbar">
        <div className="dashboard-header">
          <h1>
            <PlaneIcon size={20} /> Sundaram Travels
          </h1>
          <button className="logout-btn" onClick={handleLogout}>
            <DoorIcon size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="dashboard-layout">
        {/* Side Panel Navigation */}
        <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div className="user-info">
              <div className="user-avatar">{displayUsername.charAt(0).toUpperCase()}</div>
              <div className="user-details">
                <h3>{displayUsername}</h3>
                <p>Traveler</p>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h4 className="sidebar-title">Navigation</h4>
            <nav className="sidebar-nav">
              <button 
                className={`nav-item ${activeSection === 'itineraries' && !selectedItinerary ? 'active' : ''}`}
                onClick={() => {
                  setActiveSection('itineraries');
                  setSelectedItinerary(null);
                  setSelectedDestination(null);
                  closeSidebar();
                }}
              >
                <span className="nav-icon"><MapIcon size={20} /></span>
                <span>Itineraries</span>
              </button>
              <button 
                className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
                onClick={() => {
                  setActiveSection('analytics');
                  setSelectedItinerary(null);
                  setSelectedDestination(null);
                  closeSidebar();
                }}
              >
                <span className="nav-icon"><ChartIcon size={20} /></span>
                <span>My Analytics</span>
              </button>
              <button 
                className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
                onClick={() => {
                  setActiveSection('profile');
                  setSelectedItinerary(null);
                  setSelectedDestination(null);
                  fetchUserProfile();
                  closeSidebar();
                }}
              >
                <span className="nav-icon"><UserIcon size={20} /></span>
                <span>My Profile</span>
              </button>
            </nav>
          </div>

          {selectedItinerary && (
            <div className="sidebar-section">
              <h4 className="sidebar-title">{getCurrentItinerary()?.tripName}</h4>
              <nav className="sidebar-nav">
                <button 
                  className={`nav-item ${activeSection === 'destinations' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('destinations');
                    setSelectedDestination(null);
                    fetchDestinations(selectedItinerary);
                    closeSidebar();
                  }}
                >
                  <span className="nav-icon"><LocationIcon size={20} /></span>
                  <span>Destinations</span>
                </button>
                <button 
                  className={`nav-item ${activeSection === 'bookings' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('bookings');
                    setSelectedDestination(null);
                    fetchBookings(selectedItinerary);
                    closeSidebar();
                  }}
                >
                  <span className="nav-icon"><TicketIcon size={20} /></span>
                  <span>Bookings</span>
                </button>
                <button 
                  className={`nav-item ${activeSection === 'expenses' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('expenses');
                    setSelectedDestination(null);
                    fetchExpenses(selectedItinerary);
                    closeSidebar();
                  }}
                >
                  <span className="nav-icon"><MoneyIcon size={20} /></span>
                  <span>Expenses</span>
                </button>
                <button 
                  className="nav-item back-nav"
                  onClick={() => {
                    setActiveSection('itineraries');
                    setSelectedItinerary(null);
                    setSelectedDestination(null);
                    closeSidebar();
                  }}
                >
                  <span className="nav-icon">←</span>
                  <span>Back</span>
                </button>
              </nav>
            </div>
          )}

          {selectedDestination && (
            <div className="sidebar-section">
              <h4 className="sidebar-title">{getCurrentDestination()?.name}</h4>
              <nav className="sidebar-nav">
                <button 
                  className={`nav-item ${activeSection === 'activities' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection('activities');
                    fetchActivities(selectedDestination);
                    closeSidebar();
                  }}
                >
                  <span className="nav-icon"><TargetIcon size={20} /></span>
                  <span>Activities</span>
                </button>
                <button 
                  className="nav-item back-nav"
                  onClick={() => {
                    setActiveSection('destinations');
                    setSelectedDestination(null);
                    closeSidebar();
                  }}
                >
                  <span className="nav-icon">←</span>
                  <span>Back</span>
                </button>
              </nav>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main">
          <div className="content-wrapper">
            {/* ITINERARIES SECTION */}
            {activeSection === 'itineraries' && !selectedItinerary && (
              <div className="content-section">
                <div className="section-header-modern">
                  <div className="header-content">
                  <div className="icon-badge">
  <MapIcon size={32} color="white" />
</div>
                    <div className="header-text">
                      <h2>My Itineraries</h2>
                      <p>Plan and manage your travel adventures</p>
                    </div>
                  </div>
                  <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Close Form' : '+ New Itinerary'}
                  </button>
                </div>

                {/* Search, Sort, and Filter Controls */}
                <div className="controls-panel">
                  <div className="search-box-modern">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search itineraries..."
                      value={itinerarySearch}
                      onChange={e => setItinerarySearch(e.target.value)}
                    />
                  </div>
                  <div className="filter-sort-separate">
                    <div className="filter-box">
                      <label>STATUS</label>
                      <select 
                        value={itineraryFilter}
                        onChange={(e) => setItineraryFilter(e.target.value)}
                      >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                    <div className="sort-with-toggle">
                      <div className="sort-box">
                        <label>SORT BY</label>
                        <select 
                          value={itinerarySort.field}
                          onChange={(e) => setItinerarySort({...itinerarySort, field: e.target.value})}
                        >
                          <option value="tripName">Trip Name</option>
                          <option value="eventDate">Date</option>
                          <option value="eventTitle">Event</option>
                          <option value="status">Status</option>
                        </select>
                      </div>
                      <button 
                        className="sort-toggle-btn"
                        onClick={() => setItinerarySort({...itinerarySort, direction: itinerarySort.direction === "asc" ? "desc" : "asc"})}
                        title={itinerarySort.direction === "asc" ? "Ascending" : "Descending"}
                      >
                        {itinerarySort.direction === "desc" ? <FaSortDown /> : <FaSortUp />}
                      </button>
                    </div>
                  </div>
                </div>

                {showForm && (
                  <div className="form-card">
                    <h3>{editingId ? 'Edit Itinerary' : 'Create New Itinerary'}</h3>
                    <form onSubmit={editingId ? handleUpdate : handleAdd}>
                      <div className="form-grid">
                        <input name="tripName" placeholder="Trip Name" value={form.tripName} onChange={handleChange} required />
                        <input name="eventTitle" placeholder="Event Title" value={form.eventTitle} onChange={handleChange} required />
                        <input name="eventDate" type="date" value={form.eventDate} onChange={handleChange} required />
                        <input name="eventTime" type="time" value={form.eventTime} onChange={handleChange} required />
                        <select name="eventLocation" value={form.eventLocation} onChange={handleChange} required>
                          <option value="">Select Location</option>
                          <option value="Chennai">Chennai</option>
                          <option value="Bangalore">Bangalore</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Kolkata">Kolkata</option>
                          <option value="Pune">Pune</option>
                          <option value="Ahmedabad">Ahmedabad</option>
                          <option value="Jaipur">Jaipur</option>
                          <option value="Lucknow">Lucknow</option>
                          <option value="Kochi">Kochi</option>
                          <option value="Coimbatore">Coimbatore</option>
                          <option value="Visakhapatnam">Visakhapatnam</option>
                          <option value="Goa">Goa</option>
                          <option value="Manali">Manali</option>
                          <option value="Shimla">Shimla</option>
                          <option value="Ooty">Ooty</option>
                          <option value="Darjeeling">Darjeeling</option>
                          <option value="Udaipur">Udaipur</option>
                          <option value="Agra">Agra</option>
                          <option value="Varanasi">Varanasi</option>
                          <option value="Other">Other</option>
                        </select>
                        <select name="status" value={form.status} onChange={handleChange}>
                          <option value="PENDING">Pending</option>
                          <option value="APPROVED">Approved</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>
                      <div className="form-group-full">
                        <label htmlFor="description">Description</label>
                        <textarea 
                          id="description"
                          name="description" 
                          placeholder="Enter trip description, itinerary details, or special notes..." 
                          value={form.description} 
                          onChange={handleChange} 
                          rows="4"
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                        />
                      </div>
                      <div className="form-group-full">
                        <label htmlFor="comment">Comments</label>
                        <textarea 
                          id="comment"
                          name="comment" 
                          placeholder="Add any additional comments or remarks..." 
                          value={form.comment} 
                          onChange={handleChange} 
                          rows="3"
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                        />
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="btn-primary">
                          {editingId ? <><SaveIcon size={16} /> Update</> : <><SparklesIcon size={16} /> Create</>}
                        </button>
                        <button type="button" className="btn-secondary" onClick={() => {
                          setShowForm(false);
                          setEditingId(null);
                          setForm({
                            tripName: "",
                            eventTitle: "",
                            eventDate: "",
                            eventTime: "",
                            eventLocation: "",
                            description: "",
                            status: "PENDING",
                            comment: ""
                          });
                        }}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="cards-grid">
                  {filteredItineraries.map(item => (
                    <div key={item.id} className="card" onClick={() => selectItinerary(item.id)}>
                      <div className="card-header">
                        <h3>{item.tripName}</h3>
                        <span className={`status-badge status-${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="card-body">
                        <p><strong>Event:</strong> {item.eventTitle}</p>
                        <p><strong>Date:</strong> {item.eventDate} at {item.eventTime}</p>
                        <p><strong>Location:</strong> {item.eventLocation}</p>
                        {item.description && <p><strong>Description:</strong> {item.description}</p>}
                        {item.comment && <p><strong>Comment:</strong> {item.comment}</p>}
                      </div>
                      <div className="card-actions">
                        <button className="btn-edit" onClick={(e) => { e.stopPropagation(); handleEdit(item); }}><EditIcon size={16} /> Edit</button>
                        <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}><TrashIcon size={16} /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredItineraries.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon"><MailboxIcon size={64} color="#9ca3af" /></div>
                    <h3>No Itineraries Found</h3>
                    <p>Start by creating your first travel itinerary!</p>
                  </div>
                )}
              </div>
            )}

            {/* DESTINATIONS SECTION */}
            {activeSection === 'destinations' && !selectedItinerary && (
              <div className="content-section">
                <div className="empty-state" style={{ marginTop: '4rem', padding: '3rem', backgroundColor: '#fff', border: '2px solid #667eea', borderRadius: '12px' }}>
                  <div className="empty-icon"><MapIcon size={64} color="#9ca3af" /></div>
                  <h3 style={{ fontSize: '1.5rem', marginTop: '1rem' }}>No Itinerary Selected</h3>
                  <p style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>Please select an itinerary from the Itineraries section first to view its destinations.</p>
                  <button 
                    className="btn-primary" 
                    style={{ marginTop: '1.5rem', padding: '12px 24px', fontSize: '1rem' }}
                    onClick={() => {
                      console.log('Going to itineraries');
                      setActiveSection('itineraries');
                      setSelectedItinerary(null);
                      setSelectedDestination(null);
                    }}
                  >
                    <MapIcon size={16} /> Go to Itineraries
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'destinations' && selectedItinerary && (
              <div className="content-section">
                <div className="section-header-modern">
                  <div className="header-content">
                    <div className="icon-badge">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <div className="header-text">
                      <h2>Destinations</h2>
                      <p>Explore amazing places in your journey</p>
                    </div>
                  </div>
                  <button className="btn-primary" onClick={() => setShowDestForm({...showDestForm, [selectedItinerary]: !showDestForm[selectedItinerary]})}>
                    {showDestForm[selectedItinerary] ? '✕ Close Form' : '+ Add Destination'}
                  </button>
                </div>

                {/* Search and Sort Controls */}
                <div className="controls-panel">
                  <div className="search-box-modern">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search destinations..."
                      value={destSearch[selectedItinerary] || ""}
                      onChange={(e) => setDestSearch({...destSearch, [selectedItinerary]: e.target.value})}
                    />
                  </div>
                  <div className="filter-sort-modern">
                    <div className="sort-group">
                      <label>Sort By</label>
                      <div className="sort-controls-modern">
                        <select 
                          value={destSort[selectedItinerary]?.field || "name"}
                          onChange={(e) => setDestSort({...destSort, [selectedItinerary]: {...destSort[selectedItinerary], field: e.target.value}})}
                        >
                          <option value="name">Name</option>
                          <option value="country">Country</option>
                          <option value="region">Region</option>
                        </select>
                        <button 
                          className="sort-toggle-btn"
                          onClick={() => {
                            const newDir = destSort[selectedItinerary]?.direction === "asc" ? "desc" : "asc";
                            setDestSort({...destSort, [selectedItinerary]: {...destSort[selectedItinerary], direction: newDir}});
                          }}
                          title={destSort[selectedItinerary]?.direction === "asc" ? "Ascending" : "Descending"}
                        >
                          {destSort[selectedItinerary]?.direction === "desc" ? <FaSortDown /> : <FaSortUp />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {showDestForm[selectedItinerary] && (
                  <div className="form-card">
                    <h3>{destinationEditId[selectedItinerary] ? 'Edit Destination' : 'Add New Destination'}</h3>
                    <div className="form-grid">
                      <input name="name" placeholder="Place Name" value={destinationForms[selectedItinerary]?.name || ""} onChange={e => handleDestinationChange(selectedItinerary, e)} />
                      
                      <select name="country" value={destinationForms[selectedItinerary]?.country || ""} onChange={e => handleDestinationChange(selectedItinerary, e)}>
                        <option value="">Select Country</option>
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Singapore">Singapore</option>
                        <option value="UAE">UAE</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Japan">Japan</option>
                        <option value="France">France</option>
                        <option value="Germany">Germany</option>
                        <option value="Italy">Italy</option>
                        <option value="Spain">Spain</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Maldives">Maldives</option>
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Bhutan">Bhutan</option>
                        <option value="Other">Other</option>
                      </select>
                      
                      <select name="region" value={destinationForms[selectedItinerary]?.region || ""} onChange={e => handleDestinationChange(selectedItinerary, e)}>
                        <option value="">Select Region/State</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Goa">Goa</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="Jammu & Kashmir">Jammu & Kashmir</option>
                        <option value="Other">Other</option>
                      </select>
                      
                      <PlaceAutocomplete
                        value={placeSearchQuery[selectedItinerary] || ""}
                        placeholder="Search place for coordinates..."
                        onPlaceSelect={(placeData) => handlePlaceSelect(selectedItinerary, placeData)}
                      />
                      <input 
                        name="coordinates" 
                        placeholder="Coordinates (auto-filled)" 
                        value={destinationForms[selectedItinerary]?.coordinates || ""} 
                        readOnly
                        style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                      />
                      <input name="timeZone" placeholder="Time Zone" value={destinationForms[selectedItinerary]?.timeZone || ""} onChange={e => handleDestinationChange(selectedItinerary, e)} />
                      <textarea name="description" placeholder="Description" value={destinationForms[selectedItinerary]?.description || ""} onChange={e => handleDestinationChange(selectedItinerary, e)} />
                    </div>
                    <div className="form-actions">
                      {destinationEditId[selectedItinerary] ? (
                        <button className="btn-primary" onClick={() => handleUpdateDestination(selectedItinerary)}><SaveIcon size={16} /> Update</button>
                      ) : (
                        <button className="btn-primary" onClick={() => handleAddDestination(selectedItinerary)}><SparklesIcon size={16} /> Add</button>
                      )}
                      <button className="btn-secondary" onClick={() => {
                        setShowDestForm({...showDestForm, [selectedItinerary]: false});
                        setDestinationEditId({...destinationEditId, [selectedItinerary]: null});
                        setDestinationForms({...destinationForms, [selectedItinerary]: {}});
                        setPlaceSearchQuery({...placeSearchQuery, [selectedItinerary]: ""});
                      }}>Cancel</button>
                    </div>
                  </div>
                )}

                <div className="cards-grid">
                  {destinations[selectedItinerary]
                    ?.filter(dest => {
                      const search = destSearch[selectedItinerary]?.toLowerCase() || "";
                      return dest.name?.toLowerCase().includes(search) || 
                             dest.country?.toLowerCase().includes(search) ||
                             dest.region?.toLowerCase().includes(search);
                    })
                    .sort((a, b) => {
                      const field = destSort[selectedItinerary]?.field || "name";
                      const direction = destSort[selectedItinerary]?.direction === "desc" ? -1 : 1;
                      const aVal = a[field] || "";
                      const bVal = b[field] || "";
                      return aVal.localeCompare(bVal) * direction;
                    })
                    .map(dest => (
                    <div key={dest.destinationId} className="card" onClick={() => selectDestination(dest.destinationId)}>
                      <div className="card-header">
                        <h3><LocationIcon size={18} /> {dest.name}</h3>
                      </div>
                      <div className="card-body">
                        <p><strong>Country:</strong> {dest.country}</p>
                        <p><strong>Region:</strong> {dest.region}</p>
                        <p><strong>Coordinates:</strong> {dest.coordinates}</p>
                        <p><strong>Time Zone:</strong> {dest.timeZone}</p>
                        {dest.description && <p><strong>Description:</strong> {dest.description}</p>}
                      </div>
                      <div className="card-actions">
                        <button className="btn-edit" onClick={(e) => { e.stopPropagation(); handleEditDestination(selectedItinerary, dest); }}><EditIcon size={16} /> Edit</button>
                        <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleDeleteDestination(selectedItinerary, dest.destinationId); }}><TrashIcon size={16} /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>

                {(!destinations[selectedItinerary] || destinations[selectedItinerary].length === 0) && (
                  <div className="empty-state">
                    <div className="empty-icon">📍</div>
                    <h3>No Destinations Yet</h3>
                    <p>Add destinations to your itinerary!</p>
                  </div>
                )}
              </div>
            )}

            {/* ACTIVITIES SECTION */}
            {activeSection === 'activities' && !selectedDestination && (
              <div className="content-section">
                <div className="empty-state" style={{ marginTop: '4rem' }}>
                  <div className="empty-icon">📍</div>
                  <h3>No Destination Selected</h3>
                  <p>Please select a destination from the Destinations section first to view its activities.</p>
                  <button 
                    className="btn-primary" 
                    style={{ marginTop: '1rem' }}
                    onClick={() => setActiveSection('destinations')}
                  >
                    Go to Destinations
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'activities' && selectedDestination && (
              <div className="content-section">
                <div className="section-header-modern">
                  <div className="header-content">
                    <div className="icon-badge">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <circle cx="12" cy="12" r="6"/>
                        <line x1="12" y1="2" x2="12" y2="6"/>
                        <line x1="12" y1="18" x2="12" y2="22"/>
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                        <line x1="2" y1="12" x2="6" y2="12"/>
                        <line x1="18" y1="12" x2="22" y2="12"/>
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                      </svg>
                    </div>
                    <div className="header-text">
                      <h2>Activities</h2>
                      <p>Discover exciting things to do</p>
                    </div>
                  </div>
                  <button className="btn-primary" onClick={() => setShowActivityForm({...showActivityForm, [selectedDestination]: !showActivityForm[selectedDestination]})}>
                    {showActivityForm[selectedDestination] ? '✕ Close' : '+ Add Activity'}
                  </button>
                </div>

                {/* Search and Sort Controls */}
                <div className="controls-panel">
                  <div className="search-box-modern">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search activities by name, category..."
                      value={activitySearch[selectedDestination] || ""}
                      onChange={(e) => setActivitySearch({...activitySearch, [selectedDestination]: e.target.value})}
                    />
                  </div>
                  <div className="sort-with-toggle">
                    <div className="sort-box">
                      <label>SORT BY</label>
                      <select 
                        value={activitySort[selectedDestination]?.field || "name"}
                        onChange={(e) => {
                          setActivitySort({...activitySort, [selectedDestination]: {...activitySort[selectedDestination], field: e.target.value}});
                          fetchActivities(selectedDestination, 0);
                        }}
                      >
                        <option value="name">Name</option>
                        <option value="cost">Cost</option>
                        <option value="rating">Rating</option>
                        <option value="category">Category</option>
                      </select>
                    </div>
                    <button 
                      className="sort-toggle-btn"
                      onClick={() => {
                        const newDir = activitySort[selectedDestination]?.direction === "asc" ? "desc" : "asc";
                        setActivitySort({...activitySort, [selectedDestination]: {...activitySort[selectedDestination], direction: newDir}});
                        fetchActivities(selectedDestination, 0);
                      }}
                      title={activitySort[selectedDestination]?.direction === "desc" ? "Descending" : "Ascending"}
                    >
                      {activitySort[selectedDestination]?.direction === "desc" ? <FaSortDown /> : <FaSortUp />}
                    </button>
                  </div>
                </div>

                {showActivityForm[selectedDestination] && (
                  <div className="form-card">
                    <h3>{editingActivityId[selectedDestination] ? 'Edit Activity' : 'Add New Activity'}</h3>
                    <div className="form-grid">
                      <input name="name" placeholder="Activity Name" value={activityForms[selectedDestination]?.name || ""} onChange={e => handleActivityChange(selectedDestination, e)} />
                      <input name="category" placeholder="Category" value={activityForms[selectedDestination]?.category || ""} onChange={e => handleActivityChange(selectedDestination, e)} />
                      <input name="duration" placeholder="Duration" value={activityForms[selectedDestination]?.duration || ""} onChange={e => handleActivityChange(selectedDestination, e)} />
                      <input name="cost" type="number" placeholder="Cost" value={activityForms[selectedDestination]?.cost || ""} onChange={e => handleActivityChange(selectedDestination, e)} />
                      <input name="availability" placeholder="Availability" value={activityForms[selectedDestination]?.availability || ""} onChange={e => handleActivityChange(selectedDestination, e)} />
                      <input name="rating" type="number" placeholder="Rating" value={activityForms[selectedDestination]?.rating || ""} onChange={e => handleActivityChange(selectedDestination, e)} />
                      <textarea name="description" placeholder="Description" value={activityForms[selectedDestination]?.description || ""} onChange={e => handleActivityChange(selectedDestination, e)} />
                      <label>
                        <input name="bookingRequired" type="checkbox"
                          checked={activityForms[selectedDestination]?.bookingRequired || false}
                          onChange={e => handleActivityChange(selectedDestination, {target: {name: "bookingRequired", value: e.target.checked}})}
                        /> Booking Required
                      </label>
                    </div>
                    <div className="form-actions">
                      {editingActivityId[selectedDestination] ? (
                        <button className="btn-primary" onClick={() => handleUpdateActivity(selectedDestination)}><SaveIcon size={16} /> Update</button>
                      ) : (
                        <button className="btn-primary" onClick={() => handleAddActivity(selectedDestination)}><SparklesIcon size={16} /> Add</button>
                      )}
                      <button className="btn-secondary" onClick={() => {
                        setShowActivityForm({...showActivityForm, [selectedDestination]: false});
                        setEditingActivityId({...editingActivityId, [selectedDestination]: null});
                        setActivityForms({...activityForms, [selectedDestination]: {}});
                      }}>Cancel</button>
                    </div>
                  </div>
                )}

                <div className="cards-grid">
                  {activities[selectedDestination]
                    ?.filter(activity => {
                      const search = activitySearch[selectedDestination]?.toLowerCase() || "";
                      return activity.name?.toLowerCase().includes(search) || 
                             activity.category?.toLowerCase().includes(search);
                    })
                    .map(activity => (
                    <div key={activity.activityId} className="card">
                      <div className="card-header">
                        <h3>🎯 {activity.name}</h3>
                        <span className="category-badge">{activity.category}</span>
                      </div>
                      <div className="card-body">
                        <p><strong>Duration:</strong> {activity.duration}</p>
                        <p><strong>Cost:</strong> ${activity.cost}</p>
                        <p><strong>Rating:</strong> {'⭐'.repeat(activity.rating || 0)}</p>
                        <p><strong>Availability:</strong> {activity.availability}</p>
                        <p><strong>Booking Required:</strong> {activity.bookingRequired ? 'Yes' : 'No'}</p>
                        {activity.description && <p><strong>Description:</strong> {activity.description}</p>}
                      </div>
                      <div className="card-actions">
                        <button className="btn-edit" onClick={() => handleEditActivity(selectedDestination, activity)}><EditIcon size={16} /> Edit</button>
                        <button className="btn-delete" onClick={() => handleDeleteActivity(selectedDestination, activity.activityId)}><TrashIcon size={16} /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {activityTotalPages[selectedDestination] > 1 && (
                  <div className="pagination">
                    <button 
                      className="page-btn"
                      onClick={() => fetchActivities(selectedDestination, (activityPage[selectedDestination] || 0) - 1)}
                      disabled={activityPage[selectedDestination] === 0}
                    >
                      <FaChevronLeft /> Previous
                    </button>
                    <span className="page-info">
                      Page {(activityPage[selectedDestination] || 0) + 1} of {activityTotalPages[selectedDestination]}
                    </span>
                    <button 
                      className="page-btn"
                      onClick={() => fetchActivities(selectedDestination, (activityPage[selectedDestination] || 0) + 1)}
                      disabled={activityPage[selectedDestination] >= activityTotalPages[selectedDestination] - 1}
                    >
                      Next <FaChevronRight />
                    </button>
                  </div>
                )}

                {(!activities[selectedDestination] || activities[selectedDestination].length === 0) && (
                  <div className="empty-state">
                    <div className="empty-icon">🎯</div>
                    <h3>No Activities Yet</h3>
                    <p>Add activities to this destination!</p>
                  </div>
                )}
              </div>
            )}

            {/* BOOKINGS SECTION */}
            {activeSection === 'bookings' && !selectedItinerary && (
              <div className="content-section">
                <div className="empty-state" style={{ marginTop: '4rem' }}>
                  <div className="empty-icon">🗺️</div>
                  <h3>No Itinerary Selected</h3>
                  <p>Please select an itinerary from the Itineraries section first to view its bookings.</p>
                  <button 
                    className="btn-primary" 
                    style={{ marginTop: '1rem' }}
                    onClick={() => setActiveSection('itineraries')}
                  >
                    Go to Itineraries
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'bookings' && selectedItinerary && (
              <div className="content-section">
                <div className="section-header-modern">
                  <div className="header-content">
                    <div className="icon-badge">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                        <path d="M8 14h.01"/>
                        <path d="M12 14h.01"/>
                        <path d="M16 14h.01"/>
                        <path d="M8 18h.01"/>
                        <path d="M12 18h.01"/>
                      </svg>
                    </div>
                    <div className="header-text">
                      <h2>Bookings</h2>
                      <p>Manage your travel reservations</p>
                    </div>
                  </div>
                  <button className="btn-primary" onClick={() => setShowBookingForm({...showBookingForm, [selectedItinerary]: !showBookingForm[selectedItinerary]})}>
                    {showBookingForm[selectedItinerary] ? '✕ Close' : '+ Add Booking'}
                  </button>
                </div>

                {/* Search, Sort, and Filter Controls */}
                <div className="controls-panel">
                  <div className="search-box-modern">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search bookings by provider, type..."
                      value={bookingSearch[selectedItinerary] || ""}
                      onChange={(e) => setBookingSearch({...bookingSearch, [selectedItinerary]: e.target.value})}
                    />
                  </div>
                  <div className="filter-sort-separate">
                    <div className="filter-box">
                      <label>STATUS</label>
                      <select 
                        value={bookingFilter[selectedItinerary] || "ALL"}
                        onChange={(e) => setBookingFilter({...bookingFilter, [selectedItinerary]: e.target.value})}
                      >
                        <option value="ALL">All Status</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PENDING">Pending</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                    <div className="sort-with-toggle">
                      <div className="sort-box">
                        <label>SORT BY</label>
                        <select 
                          value={bookingSort[selectedItinerary]?.field || "bookingDate"}
                          onChange={(e) => {
                            setBookingSort({...bookingSort, [selectedItinerary]: {...bookingSort[selectedItinerary], field: e.target.value}});
                            fetchBookings(selectedItinerary, 0);
                          }}
                        >
                          <option value="bookingDate">Date</option>
                          <option value="cost">Cost</option>
                          <option value="providerName">Provider</option>
                        </select>
                      </div>
                      <button 
                        className="sort-toggle-btn"
                        onClick={() => {
                          const newDir = bookingSort[selectedItinerary]?.direction === "asc" ? "desc" : "asc";
                          setBookingSort({...bookingSort, [selectedItinerary]: {...bookingSort[selectedItinerary], direction: newDir}});
                          fetchBookings(selectedItinerary, 0);
                        }}
                        title={bookingSort[selectedItinerary]?.direction === "desc" ? "Descending" : "Ascending"}
                      >
                        {bookingSort[selectedItinerary]?.direction === "desc" ? <FaSortDown /> : <FaSortUp />}
                      </button>
                    </div>
                  </div>
                </div>

                {showBookingForm[selectedItinerary] && (
                  <div className="form-card">
                    <h3>{editingBookingId[selectedItinerary] ? 'Edit Booking' : 'Add New Booking'}</h3>
                    <div className="form-grid">
                      <input name="bookingType" placeholder="Booking Type" value={bookingForms[selectedItinerary]?.bookingType || ""} onChange={e => handleBookingChange(selectedItinerary, e)} />
                      <input name="bookingReference" placeholder="Reference No." value={bookingForms[selectedItinerary]?.bookingReference || ""} onChange={e => handleBookingChange(selectedItinerary, e)} />
                      <input name="providerName" placeholder="Provider Name" value={bookingForms[selectedItinerary]?.providerName || ""} onChange={e => handleBookingChange(selectedItinerary, e)} />
                      <input name="bookingDate" type="date" value={bookingForms[selectedItinerary]?.bookingDate || ""} onChange={e => handleBookingChange(selectedItinerary, e)} />
                      <input name="cost" type="number" placeholder="Cost" value={bookingForms[selectedItinerary]?.cost || ""} onChange={e => handleBookingChange(selectedItinerary, e)} />
                      <select name="status" value={bookingForms[selectedItinerary]?.status || "PENDING"} onChange={e => handleBookingChange(selectedItinerary, e)} style={{width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '4px'}}>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                    <div className="form-actions">
                      {editingBookingId[selectedItinerary] ? (
                        <button className="btn-primary" onClick={() => handleUpdateBooking(selectedItinerary)}><SaveIcon size={16} /> Update</button>
                      ) : (
                        <button className="btn-primary" onClick={() => handleAddBooking(selectedItinerary)}><SparklesIcon size={16} /> Add</button>
                      )}
                      <button className="btn-secondary" onClick={() => {
                        setShowBookingForm({...showBookingForm, [selectedItinerary]: false});
                        setEditingBookingId({...editingBookingId, [selectedItinerary]: null});
                        setBookingForms({...bookingForms, [selectedItinerary]: {}});
                      }}>Cancel</button>
                    </div>
                  </div>
                )}

                <div className="cards-grid">
                  {bookings[selectedItinerary]
                    ?.filter(booking => {
                      const search = bookingSearch[selectedItinerary]?.toLowerCase() || "";
                      const matchesSearch = booking.bookingReference?.toLowerCase().includes(search) || 
                                          booking.providerName?.toLowerCase().includes(search) ||
                                          booking.bookingType?.toLowerCase().includes(search);
                      const filter = bookingFilter[selectedItinerary] || "ALL";
                      const matchesFilter = filter === "ALL" || booking.status === filter;
                      return matchesSearch && matchesFilter;
                    })
                    .map(booking => (
                    <div key={booking.id} className="card">
                      <div className="card-header">
                        <h3>🎫 {booking.bookingType}</h3>
                        <span className="status-badge">{booking.status}</span>
                      </div>
                      <div className="card-body">
                        <p><strong>Reference:</strong> {booking.bookingReference}</p>
                        <p><strong>Provider:</strong> {booking.providerName}</p>
                        <p><strong>Date:</strong> {booking.bookingDate}</p>
                        <p><strong>Cost:</strong> ${booking.cost}</p>
                      </div>
                      <div className="card-actions">
                        <button className="btn-edit" onClick={() => handleEditBooking(selectedItinerary, booking)}><EditIcon size={16} /> Edit</button>
                        <button className="btn-delete" onClick={() => handleDeleteBooking(selectedItinerary, booking.id)}><TrashIcon size={16} /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {bookingTotalPages[selectedItinerary] > 1 && (
                  <div className="pagination">
                    <button 
                      className="page-btn"
                      onClick={() => fetchBookings(selectedItinerary, (bookingPage[selectedItinerary] || 0) - 1)}
                      disabled={bookingPage[selectedItinerary] === 0}
                    >
                      <FaChevronLeft /> Previous
                    </button>
                    <span className="page-info">
                      Page {(bookingPage[selectedItinerary] || 0) + 1} of {bookingTotalPages[selectedItinerary]}
                    </span>
                    <button 
                      className="page-btn"
                      onClick={() => fetchBookings(selectedItinerary, (bookingPage[selectedItinerary] || 0) + 1)}
                      disabled={bookingPage[selectedItinerary] >= bookingTotalPages[selectedItinerary] - 1}
                    >
                      Next <FaChevronRight />
                    </button>
                  </div>
                )}

                {(!bookings[selectedItinerary] || bookings[selectedItinerary].length === 0) && (
                  <div className="empty-state">
                    <div className="empty-icon">🎫</div>
                    <h3>No Bookings Yet</h3>
                    <p>Add bookings for this itinerary!</p>
                  </div>
                )}
              </div>
            )}

            {/* EXPENSES SECTION */}
            {activeSection === 'expenses' && selectedItinerary && (
              <div className="content-section">
                <div className="section-header-modern">
                  <div className="header-content">
                    <div className="icon-badge">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        <polyline points="1 12 3 12"/>
                        <polyline points="21 12 23 12"/>
                      </svg>
                    </div>
                    <div className="header-text">
                      <h2>Expenses</h2>
                      <p>Track your travel spending</p>
                    </div>
                  </div>
                  <button className="btn-primary" onClick={() => setShowExpenseForm({...showExpenseForm, [selectedItinerary]: !showExpenseForm[selectedItinerary]})}>
                    {showExpenseForm[selectedItinerary] ? '✕ Close' : '+ Add Expense'}
                  </button>
                </div>

                {/* Search, Sort, and Filter Controls */}
                <div className="controls-panel">
                  <div className="search-box-modern">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search expenses by category, description..."
                      value={expenseSearch[selectedItinerary] || ""}
                      onChange={(e) => setExpenseSearch({...expenseSearch, [selectedItinerary]: e.target.value})}
                    />
                  </div>
                  <div className="filter-sort-separate">
                    <div className="filter-box">
                      <label>CATEGORY</label>
                      <select 
                        value={expenseFilter[selectedItinerary] || "ALL"}
                        onChange={(e) => setExpenseFilter({...expenseFilter, [selectedItinerary]: e.target.value})}
                      >
                        <option value="ALL">All Categories</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Accommodation">Accommodation</option>
                        <option value="Food">Food</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="sort-with-toggle">
                      <div className="sort-box">
                        <label>SORT BY</label>
                        <select 
                          value={expenseSort[selectedItinerary]?.field || "date"}
                          onChange={(e) => setExpenseSort({...expenseSort, [selectedItinerary]: {...expenseSort[selectedItinerary], field: e.target.value}})}
                        >
                          <option value="date">Date</option>
                          <option value="amount">Amount</option>
                          <option value="category">Category</option>
                        </select>
                      </div>
                      <button 
                        className="sort-toggle-btn"
                        onClick={() => {
                          const newDir = expenseSort[selectedItinerary]?.direction === "asc" ? "desc" : "asc";
                          setExpenseSort({...expenseSort, [selectedItinerary]: {...expenseSort[selectedItinerary], direction: newDir}});
                        }}
                        title={expenseSort[selectedItinerary]?.direction === "desc" ? "Descending" : "Ascending"}
                      >
                        {expenseSort[selectedItinerary]?.direction === "desc" ? <FaSortDown /> : <FaSortUp />}
                      </button>
                    </div>
                  </div>
                </div>

                {showExpenseForm[selectedItinerary] && (
                  <div className="form-card">
                    <h3>{editingExpenseId[selectedItinerary] ? 'Edit Expense' : 'Add New Expense'}</h3>
                    <div className="form-grid">
                      <input name="category" placeholder="Category" value={expenseForms[selectedItinerary]?.category || ""} onChange={e => handleExpenseChange(selectedItinerary, e)} />
                      <input name="amount" type="number" placeholder="Amount" value={expenseForms[selectedItinerary]?.amount || ""} onChange={e => handleExpenseChange(selectedItinerary, e)} />
                      <input name="currency" placeholder="Currency" value={expenseForms[selectedItinerary]?.currency || ""} onChange={e => handleExpenseChange(selectedItinerary, e)} />
                      <input name="date" type="date" value={expenseForms[selectedItinerary]?.date || ""} onChange={e => handleExpenseChange(selectedItinerary, e)} />
                      <input name="paymentMethod" placeholder="Payment Method" value={expenseForms[selectedItinerary]?.paymentMethod || ""} onChange={e => handleExpenseChange(selectedItinerary, e)} />
                      <textarea name="description" placeholder="Description" value={expenseForms[selectedItinerary]?.description || ""} onChange={e => handleExpenseChange(selectedItinerary, e)} />
                    </div>
                    <div className="form-actions">
                      {editingExpenseId[selectedItinerary] ? (
                        <button className="btn-primary" onClick={() => handleUpdateExpense(selectedItinerary)}><SaveIcon size={16} /> Update</button>
                      ) : (
                        <button className="btn-primary" onClick={() => handleAddExpense(selectedItinerary)}><SparklesIcon size={16} /> Add</button>
                      )}
                      <button className="btn-secondary" onClick={() => {
                        setShowExpenseForm({...showExpenseForm, [selectedItinerary]: false});
                        setEditingExpenseId({...editingExpenseId, [selectedItinerary]: null});
                        setExpenseForms({...expenseForms, [selectedItinerary]: {}});
                      }}>Cancel</button>
                    </div>
                  </div>
                )}

                <div className="cards-grid">
                  {expenses[selectedItinerary]
                    ?.filter(expense => {
                      const search = expenseSearch[selectedItinerary]?.toLowerCase() || "";
                      const matchesSearch = expense.description?.toLowerCase().includes(search) || 
                                          expense.category?.toLowerCase().includes(search);
                      const filter = expenseFilter[selectedItinerary] || "ALL";
                      const matchesFilter = filter === "ALL" || expense.category === filter;
                      return matchesSearch && matchesFilter;
                    })
                    .sort((a, b) => {
                      const field = expenseSort[selectedItinerary]?.field || "date";
                      const direction = expenseSort[selectedItinerary]?.direction === "desc" ? -1 : 1;
                      const aVal = a[field];
                      const bVal = b[field];
                      
                      if (aVal == null) return 1;
                      if (bVal == null) return -1;
                      
                      if (typeof aVal === 'string') {
                        return aVal.localeCompare(bVal) * direction;
                      }
                      return (aVal > bVal ? 1 : -1) * direction;
                    })
                    .map(expense => (
                    <div key={expense.id} className="card">
                      <div className="card-header">
                        <h3>💰 {expense.category}</h3>
                        <span className="amount-badge">{expense.amount} {expense.currency}</span>
                      </div>
                      <div className="card-body">
                        <p><strong>Date:</strong> {expense.date}</p>
                        <p><strong>Payment Method:</strong> {expense.paymentMethod}</p>
                        {expense.description && <p><strong>Description:</strong> {expense.description}</p>}
                      </div>
                      <div className="card-actions">
                        <button className="btn-edit" onClick={() => handleEditExpense(selectedItinerary, expense)}><EditIcon size={16} /> Edit</button>
                        <button className="btn-delete" onClick={() => handleDeleteExpense(selectedItinerary, expense.id)}><TrashIcon size={16} /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>

                {(!expenses[selectedItinerary] || expenses[selectedItinerary].length === 0) && (
                  <div className="empty-state">
                    <div className="empty-icon"><MoneyIcon size={64} color="#9ca3af" /></div>
                    <h3>No Expenses Yet</h3>
                    <p>Track expenses for this itinerary!</p>
                  </div>
                )}
              </div>
            )}

            {/* ANALYTICS SECTION */}
            {activeSection === 'analytics' && (
              <div className="content-section">
                <h2 style={{marginBottom: '2rem', fontSize: '1.8rem', color: '#2d3748'}}>
                  📊 My Travel Analytics
                </h2>
                
                {(() => {
                  const totalItineraries = itineraries.length;
                  const totalDestinations = Object.values(destinations).reduce((sum, dests) => sum + dests.length, 0);
                  const totalActivities = Object.values(activities).reduce((sum, acts) => sum + (acts?.length || 0), 0);
                  const totalBookings = Object.values(bookings).reduce((sum, books) => sum + (books?.length || 0), 0);
                  
                  // Calculate total amount spent from all expenses
                  const totalAmountSpent = Object.values(expenses).reduce((sum, expenseList) => {
                    return sum + expenseList.reduce((expSum, expense) => {
                      return expSum + (parseFloat(expense.amount) || 0);
                    }, 0);
                  }, 0);
                  
                  // Calculate total cost from activities
                  const totalActivityCost = Object.values(activities).reduce((sum, acts) => {
                    return sum + (acts || []).reduce((actSum, activity) => {
                      return actSum + (parseFloat(activity.cost) || 0);
                    }, 0);
                  }, 0);
                  
                  // Calculate total cost from bookings
                  const totalBookingCost = Object.values(bookings).reduce((sum, books) => {
                    return sum + (books || []).reduce((bookSum, booking) => {
                      return bookSum + (parseFloat(booking.cost) || 0);
                    }, 0);
                  }, 0);
                  
                  // Grand total of all costs
                  const grandTotalSpent = totalAmountSpent + totalActivityCost + totalBookingCost;
                  
                  // Calculate status distribution for itineraries
                  const statusCounts = itineraries.reduce((acc, itin) => {
                    acc[itin.status] = (acc[itin.status] || 0) + 1;
                    return acc;
                  }, {});
                  
                  return (
                    <>
                      {/* Key Metrics Cards */}
                      <div className="stats-grid-modern">
                        <div className="stat-card-modern primary">
                          <div className="stat-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                              <line x1="8" y1="2" x2="8" y2="18"/>
                              <line x1="16" y1="6" x2="16" y2="22"/>
                            </svg>
                          </div>
                          <div className="stat-content">
                            <h4>My Itineraries</h4>
                            <p className="stat-number">{totalItineraries}</p>
                            <span className="stat-label">Total trips</span>
                          </div>
                        </div>
                        
                        <div className="stat-card-modern success">
                          <div className="stat-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                              <circle cx="12" cy="10" r="3"/>
                            </svg>
                          </div>
                          <div className="stat-content">
                            <h4>Destinations</h4>
                            <p className="stat-number">{totalDestinations}</p>
                            <span className="stat-label">Places visited</span>
                          </div>
                        </div>
                        
                        <div className="stat-card-modern warning">
                          <div className="stat-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <polyline points="12 6 12 12 16 14"/>
                            </svg>
                          </div>
                          <div className="stat-content">
                            <h4>Activities</h4>
                            <p className="stat-number">{totalActivities}</p>
                            <span className="stat-label">Experiences</span>
                          </div>
                        </div>
                        
                        <div className="stat-card-modern info">
                          <div className="stat-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                            </svg>
                          </div>
                          <div className="stat-content">
                            <h4>Bookings</h4>
                            <p className="stat-number">{totalBookings}</p>
                            <span className="stat-label">Reservations</span>
                          </div>
                        </div>
                      </div>

                      {/* Charts Section */}
                      <div className="charts-grid">
                        {/* Status Distribution Chart */}
                        <div className="chart-container">
                          <h3 className="chart-title">📋 Itinerary Status Distribution</h3>
                          <div className="bar-chart">
                            {Object.entries(statusCounts).map(([status, count], index) => {
                              const maxCount = Math.max(...Object.values(statusCounts));
                              const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                              const colors = {
                                'PENDING': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                'CONFIRMED': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                'COMPLETED': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                'CANCELLED': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                              };
                              
                              return (
                                <div key={status} className="bar-item">
                                  <div className="bar-label">{status}</div>
                                  <div className="bar-track">
                                    <div 
                                      className="bar-fill" 
                                      style={{
                                        width: `${percentage}%`,
                                        background: colors[status] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                      }}
                                      title={`${count} itineraries`}
                                    >
                                      <span className="bar-value">{count}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Content Distribution Pie Chart */}
                        <div className="chart-container">
                          <h3 className="chart-title">🎯 My Travel Content</h3>
                          <div className="pie-chart-wrapper">
                            {(() => {
                              const total = totalItineraries + totalDestinations + totalActivities + totalBookings;
                              
                              if (total === 0) {
                                return (
                                  <div style={{textAlign: 'center', padding: '2rem'}}>
                                    <p style={{color: '#6b7280'}}>Start planning trips to see your analytics!</p>
                                  </div>
                                );
                              }
                              
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

                      {/* Top Itineraries by Activity */}
                      {itineraries.length > 0 && (
                        <div className="chart-container" style={{marginTop: '2rem'}}>
                          <h3 className="chart-title">🏆 Most Active Itineraries</h3>
                          <div className="top-users-grid">
                            {itineraries
                              .map(itin => ({
                                ...itin,
                                destCount: destinations[itin.id]?.length || 0,
                                actCount: activities[destinations[itin.id]?.[0]?.destinationId]?.content?.length || 0,
                                bookCount: bookings[itin.id]?.content?.length || 0,
                                expCount: expenses[itin.id]?.length || 0,
                                totalActivity: (destinations[itin.id]?.length || 0) + 
                                              (bookings[itin.id]?.content?.length || 0) + 
                                              (expenses[itin.id]?.length || 0)
                              }))
                              .sort((a, b) => b.totalActivity - a.totalActivity)
                              .slice(0, 5)
                              .map((itin, index) => (
                                <div key={itin.id} className="top-user-card">
                                  <div className="user-rank">{index + 1}</div>
                                  <div className="user-avatar">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                                      <line x1="8" y1="2" x2="8" y2="18"/>
                                      <line x1="16" y1="6" x2="16" y2="22"/>
                                    </svg>
                                  </div>
                                  <div className="user-stats">
                                    <h4>{itin.tripName}</h4>
                                    <p className="total-activity">{itin.totalActivity} Total Items</p>
                                    <div className="mini-stats">
                                      <span title="Destinations">📍 {itin.destCount}</span>
                                      <span title="Bookings">🎫 {itin.bookCount}</span>
                                      <span title="Expenses">💰 {itin.expCount}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Insights Cards */}
                      <div className="insights-grid">
                        <div className="insight-card">
                          <h4>📈 Avg Destinations per Trip</h4>
                          <p className="insight-value">
                            {totalItineraries > 0 
                              ? (totalDestinations / totalItineraries).toFixed(1)
                              : 0}
                          </p>
                        </div>
                        <div className="insight-card">
                          <h4>🎯 Avg Activities per Trip</h4>
                          <p className="insight-value">
                            {totalItineraries > 0 
                              ? (totalActivities / totalItineraries).toFixed(1)
                              : 0}
                          </p>
                        </div>
                        <div className="insight-card">
                          <h4>💰 Total Amount Spent</h4>
                          <p className="insight-value">
                            {grandTotalSpent.toFixed(2)}
                          </p>
                        </div>
                        <div className="insight-card">
                          <h4>✈️ Completion Rate</h4>
                          <p className="insight-value">
                            {totalItineraries > 0 
                              ? ((statusCounts['COMPLETED'] || 0) / totalItineraries * 100).toFixed(0)
                              : 0}%
                          </p>
                        </div>
                      </div>

                      {itineraries.length === 0 && (
                        <div className="empty-state" style={{marginTop: '3rem'}}>
                          <div className="empty-icon">📊</div>
                          <h3>No Data Yet</h3>
                          <p>Start creating itineraries to see your personalized analytics!</p>
                          <button 
                            className="btn-primary" 
                            onClick={() => setActiveSection('itineraries')}
                            style={{marginTop: '1rem'}}
                          >
                            🗺️ Create Your First Itinerary
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* PROFILE SECTION */}
            {activeSection === 'profile' && (
              <div className="content-section">
                <div className="section-header">
                  <h2><UserIcon size={24} /> My Profile</h2>
                  {!isEditingProfile ? (
                    <button className="btn-primary" onClick={() => setIsEditingProfile(true)}>
                      <EditIcon size={16} /> Edit Profile
                    </button>
                  ) : (
                    <button className="btn-secondary" onClick={() => {
                      setIsEditingProfile(false);
                      fetchUserProfile();
                    }}>
                      ✕ Cancel
                    </button>
                  )}
                </div>

                {userProfile && !isEditingProfile && (
                  <div className="profile-view">
                    <div className="profile-card">
                      <div className="profile-header">
                        <div className="profile-avatar-large">
                          {userProfile.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="profile-info">
                          <h3>{userProfile.username}</h3>
                          <span className={`status-badge status-${userProfile.status?.toLowerCase() || 'active'}`}>
                            {userProfile.status || 'ACTIVE'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="profile-details">
                        <div className="detail-row">
                          <span className="detail-label">📧 Email:</span>
                          <span className="detail-value">{userProfile.email}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">📱 Phone:</span>
                          <span className="detail-value">{userProfile.phone || 'Not provided'}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">🏠 Address:</span>
                          <span className="detail-value">{userProfile.address || 'Not provided'}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">🏙️ City:</span>
                          <span className="detail-value">{userProfile.city || 'Not provided'}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">📍 State/Region:</span>
                          <span className="detail-value">{userProfile.state || 'Not provided'}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">🌍 Country:</span>
                          <span className="detail-value">{userProfile.country || 'Not provided'}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">📅 Member Since:</span>
                          <span className="detail-value">
                            {userProfile.createdDate ? new Date(userProfile.createdDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">🔐 Last Login:</span>
                          <span className="detail-value">
                            {userProfile.lastLogin ? new Date(userProfile.lastLogin).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isEditingProfile && (
                  <div className="form-card">
                    <h3>Edit Your Profile</h3>
                    <form onSubmit={handleProfileUpdate}>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Username</label>
                          <input 
                            name="username" 
                            placeholder="Your username" 
                            value={profileForm.username} 
                            onChange={handleProfileChange} 
                            required 
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Email</label>
                          <input 
                            name="email" 
                            type="email" 
                            placeholder="Your email" 
                            value={profileForm.email} 
                            onChange={handleProfileChange} 
                            required 
                          />
                        </div>

                        <div className="form-group">
                          <label>Phone</label>
                          <input 
                            name="phone" 
                            type="tel" 
                            placeholder="Your phone number" 
                            value={profileForm.phone} 
                            onChange={handleProfileChange} 
                          />
                        </div>

                        <div className="form-group full-width">
                          <label>Address</label>
                          <input 
                            name="address" 
                            placeholder="Your street address" 
                            value={profileForm.address} 
                            onChange={handleProfileChange} 
                          />
                        </div>

                        <div className="form-group">
                          <label>City</label>
                          <select 
                            name="city" 
                            value={profileForm.city} 
                            onChange={handleProfileChange}
                          >
                            <option value="">Select City</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Kolkata">Kolkata</option>
                            <option value="Pune">Pune</option>
                            <option value="Ahmedabad">Ahmedabad</option>
                            <option value="Jaipur">Jaipur</option>
                            <option value="Lucknow">Lucknow</option>
                            <option value="Kochi">Kochi</option>
                            <option value="Coimbatore">Coimbatore</option>
                            <option value="Visakhapatnam">Visakhapatnam</option>
                            <option value="Indore">Indore</option>
                            <option value="Bhopal">Bhopal</option>
                            <option value="Chandigarh">Chandigarh</option>
                            <option value="Goa">Goa</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>State/Region</label>
                          <select 
                            name="state" 
                            value={profileForm.state} 
                            onChange={handleProfileChange}
                          >
                            <option value="">Select State/Region</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Telangana">Telangana</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Punjab">Punjab</option>
                            <option value="Haryana">Haryana</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                            <option value="West Bengal">West Bengal</option>
                            <option value="Odisha">Odisha</option>
                            <option value="Bihar">Bihar</option>
                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                            <option value="Goa">Goa</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Country</label>
                          <select 
                            name="country" 
                            value={profileForm.country} 
                            onChange={handleProfileChange}
                          >
                            <option value="">Select Country</option>
                            <option value="India">India</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                            <option value="Singapore">Singapore</option>
                            <option value="UAE">UAE</option>
                            <option value="Germany">Germany</option>
                            <option value="France">France</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Status</label>
                          <select 
                            name="status" 
                            value={profileForm.status} 
                            onChange={handleProfileChange}
                          >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="PENDING">Pending</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="form-actions">
                        <button type="submit" className="btn-primary">
                          <SaveIcon size={16} /> Save Changes
                        </button>
                        <button 
                          type="button" 
                          className="btn-secondary" 
                          onClick={() => {
                            setIsEditingProfile(false);
                            fetchUserProfile();
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;










