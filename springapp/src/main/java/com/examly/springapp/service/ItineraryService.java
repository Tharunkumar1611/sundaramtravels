package com.examly.springapp.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.examly.springapp.repository.ItineraryRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.util.JwtUtil;
import com.examly.springapp.model.Itinerary;
import com.examly.springapp.model.User;

import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

@Service
public class ItineraryService {

    @Autowired
    private ItineraryRepository repository;

    @Autowired
    private UserRepository userRepository; // ✅ needed to fetch User by Long id
    @Autowired
    private HttpServletRequest request;

    @Autowired
    private JwtUtil jwtUtil;

    public User getUserFromRequest() {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            String email = jwtUtil.extractEmail(jwt); // use email here
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        }
        throw new org.springframework.security.access.AccessDeniedException("Authorization header missing or invalid");
    }

    // Add event
    public Itinerary addEvent(Itinerary event) {
        User userFromToken = getUserFromRequest(); // Add method above or pass user here
        event.setUser(userFromToken);
        return repository.save(event);
    }

    // Get events by trip name
    public List<Itinerary> getEventsByTripName(String tripName) {
        return repository.findByTripName(tripName);
    }

    // Update existing event
    public Optional<Itinerary> updateEvent(Long id, Itinerary newEvent) {
        return repository.findById(id).map(event -> {
            event.setTripName(newEvent.getTripName());
            event.setEventDate(newEvent.getEventDate());
            event.setEventTime(newEvent.getEventTime());
            event.setEventTitle(newEvent.getEventTitle());
            event.setEventLocation(newEvent.getEventLocation());
            event.setDescription(newEvent.getDescription());
            event.setStatus(newEvent.getStatus());
            event.setComment(newEvent.getComment());
            return repository.save(event);
        });
    }

    // Delete event by ID
    public void deleteEvent(Long id) {
        repository.deleteById(id);
    }

    // Get events by status
    public List<Itinerary> getEventsByStatus(Itinerary.Status status) {
        return repository.findByStatus(status);
    }

    public List<Itinerary> getEventsByUser(Long userId) {
        return repository.findByUserId(userId);
    }

    // Update only status and comment
    public Optional<Itinerary> updateStatusAndComment(Long id, Itinerary.Status status, String comment) {
        return repository.findById(id).map(event -> {
            event.setStatus(status);
            event.setComment(comment);
            return repository.save(event);
        });
    }

    public Page<Itinerary> getPaginatedItineraries(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return repository.findAll(pageable);
    }
}
