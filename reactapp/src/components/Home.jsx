import React from "react";
import { Link } from "react-router-dom";
import { EmailIcon, PhoneIcon, LocationIcon, FacebookIcon, InstagramIcon, TwitterIcon, BriefcaseIcon, HeartIcon } from './Icons';
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="logo-section">
            <svg className="logo-icon" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            <h1 className="brand-name">Sundaram Travel Management </h1>
          </div>
          <p className="tagline">Your Complete Travel Companion</p>
          <p className="hero-description">
            Plan perfect itineraries, discover amazing destinations, manage activities, 
            track bookings, and monitor expenses - all in one beautiful, easy-to-use platform.
          </p>
          <div className="button-group">
            <Link to="/login" className="btn btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Login
            </Link>
            <Link to="/register" className="btn btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <svg className="feature-icon" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              <line x1="8" y1="2" x2="8" y2="18"/>
              <line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
            <h3>Smart Itineraries</h3>
            <p>Create and manage detailed travel plans with ease. Organize your trips efficiently.</p>
          </div>
          <div className="feature-card">
            <svg className="feature-icon" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <h3>Destination Hub</h3>
            <p>Explore and save your favorite destinations. Add detailed information and coordinates.</p>
          </div>
          <div className="feature-card">
            <svg className="feature-icon" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <h3>Activity Planner</h3>
            <p>Plan exciting activities for each destination. Track costs, duration, and ratings.</p>
          </div>
          <div className="feature-card">
            <svg className="feature-icon" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            <h3>Booking Manager</h3>
            <p>Keep all your bookings in one place. Track flights, hotels, and reservations.</p>
          </div>
          <div className="feature-card">
            <svg className="feature-icon" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <h3>Expense Tracker</h3>
            <p>Monitor your travel budget. Track expenses with detailed categorization.</p>
          </div>
          <div className="feature-card">
            <svg className="feature-icon" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="20" x2="12" y2="10"/>
              <line x1="18" y1="20" x2="18" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="16"/>
            </svg>
            <h3>Analytics & Reports</h3>
            <p>Get insights into your travel patterns and spending habits with visual reports.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Itinerary</h3>
            <p>Start by creating a new travel itinerary with dates and locations</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Add Destinations</h3>
            <p>Add destinations to your itinerary with detailed information</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Plan Activities</h3>
            <p>Add activities to each destination and manage bookings</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Track Everything</h3>
            <p>Monitor expenses and keep all your travel data organized</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon"><EmailIcon size={32} color="#667eea" /></div>
              <div className="contact-details">
                <h4>Email Us</h4>
                <p>support@sundaramtravel.com</p>
                <p>info@sundaramtravel.com</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><PhoneIcon size={32} color="#667eea" /></div>
              <div className="contact-details">
                <h4>Call Us</h4>
                <p>+91 1800-123-4567 (Toll Free)</p>
                <p>+91 98765-43210</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><LocationIcon size={32} color="#667eea" /></div>
              <div className="contact-details">
                <h4>Visit Us</h4>
                <p>123 Travel Street, MG Road</p>
                <p>Bangalore, Karnataka 560001</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">⏰</div>
              <div className="contact-details">
                <h4>Working Hours</h4>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
          <div className="social-links">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon"><FacebookIcon size={18} /> Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon"><InstagramIcon size={18} /> Instagram</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon"><TwitterIcon size={18} /> Twitter</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon"><BriefcaseIcon size={18} /> LinkedIn</a>

            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Sundaram Travel Management. All rights reserved.</p>
        <p>Made with <HeartIcon size={16} color="#e74c3c" /> for travelers worldwide</p>
      </footer>
    </div>
  );
};

export default Home;
