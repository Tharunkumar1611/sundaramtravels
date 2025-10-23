import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/Home";
import UserDashboard from "./components/UserDashboardSidePanel";
import AdminDashboard from "./components/AdminDashboard";
import LoginRegisterDialog from "./components/LoginRegisterDialog";

function App() {
  // Protected Route component for redirecting based on role
  const DashboardRedirect = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") return <Navigate to="/admin-dashboard" />;
    if (role === "user") return <Navigate to="/user-dashboard" />;
    return <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginRegisterDialog mode="login" />} />
            <Route path="/register" element={<LoginRegisterDialog mode="register" />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<DashboardRedirect />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
