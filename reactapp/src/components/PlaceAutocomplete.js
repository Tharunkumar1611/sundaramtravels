import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/PlaceAutocomplete.css';

const PlaceAutocomplete = ({ value, onPlaceSelect, placeholder = "Search for a place..." }) => {
  const [searchQuery, setSearchQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search function
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 3) {
        searchPlaces(searchQuery);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const searchPlaces = async (query) => {
    if (!query || query.length < 3) return;

    setIsLoading(true);
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          limit: 8,
          addressdetails: 1
        },
        headers: {
          'User-Agent': 'TravelPlannerApp/1.0'
        }
      });

      setSuggestions(response.data);
      setShowDropdown(response.data.length > 0);
    } catch (error) {
      console.error('Error fetching places:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlace = (place) => {
    const placeName = place.display_name;
    const coordinates = `${place.lat}, ${place.lon}`;
    
    setSearchQuery(placeName);
    setShowDropdown(false);
    setSuggestions([]);

    // Call the parent callback with selected place data
    if (onPlaceSelect) {
      onPlaceSelect({
        name: placeName,
        coordinates: coordinates,
        lat: place.lat,
        lon: place.lon,
        address: place.address
      });
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="place-autocomplete" ref={dropdownRef}>
      <div className="autocomplete-input-wrapper">
        <input
          type="text"
          className="autocomplete-input"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
        />
        {isLoading && (
          <div className="loading-spinner">
            <span>🔍</span>
          </div>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <ul className="autocomplete-dropdown">
          {suggestions.map((place, index) => (
            <li
              key={`${place.place_id}-${index}`}
              className="autocomplete-item"
              onClick={() => handleSelectPlace(place)}
            >
              <div className="place-icon">📍</div>
              <div className="place-details">
                <div className="place-name">{place.display_name}</div>
                <div className="place-coords">
                  {place.lat.substring(0, 8)}, {place.lon.substring(0, 8)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showDropdown && suggestions.length === 0 && searchQuery.length >= 3 && !isLoading && (
        <ul className="autocomplete-dropdown">
          <li className="autocomplete-item no-results">
            No places found. Try a different search term.
          </li>
        </ul>
      )}
    </div>
  );
};

export default PlaceAutocomplete;
