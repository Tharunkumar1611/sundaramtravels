package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import com.examly.springapp.model.Itinerary;
import com.examly.springapp.model.User;
import com.examly.springapp.service.ItineraryService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/itinerary")
@CrossOrigin(origins = "*")
public class ItineraryController {

    @Autowired
    private ItineraryService service;

    // Add new event
    @PostMapping
    public Itinerary addEvent(@RequestBody Itinerary event) {
        return service.addEvent(event);
    }

    @GetMapping
    public List<Itinerary> getItinerariesForCurrentUser() {
        User user = service.getUserFromRequest();
        return service.getEventsByUser(user.getId());
    }

    // Get all events for a specific trip
    @GetMapping("/{tripName}")
    public List<Itinerary> getEventsByTripName(@PathVariable String tripName) {
        return service.getEventsByTripName(tripName);
    }

    // Update an event
    @PutMapping("/{id}")
    public Optional<Itinerary> updateEvent(@PathVariable Long id, @RequestBody Itinerary event) {
        return service.updateEvent(id, event);
    }

    // Delete an event
    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        service.deleteEvent(id);
    }

    // Get events filtered by status
    @GetMapping("/status/{status}")
    public List<Itinerary> getEventsByStatus(@PathVariable Itinerary.Status status) {
        return service.getEventsByStatus(status);
    }

    @GetMapping("/user/{userId}")
    public List<Itinerary> getEventsByUser(@PathVariable Long userId) {
        return service.getEventsByUser(userId);
    }

    // Update only status and comment
    @PutMapping("/status/{id}")
    public Optional<Itinerary> updateStatusAndComment(
            @PathVariable Long id,
            @RequestParam Itinerary.Status status,
            @RequestParam(required = false) String comment) {
        return service.updateStatusAndComment(id, status, comment);
    }

    @GetMapping("/paged")
    public Page<Itinerary> getPaginatedItineraries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return service.getPaginatedItineraries(page, size, sortBy, direction);
    }
}
