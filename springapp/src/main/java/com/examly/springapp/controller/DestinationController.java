package com.examly.springapp.controller;

import com.examly.springapp.model.Destination;
import com.examly.springapp.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    @PostMapping
    public Destination addDestination(@RequestBody Destination destination) {
        return destinationService.saveDestination(destination);
    }

    @GetMapping
    public List<Destination> getAllDestinations() {
        return destinationService.getAllDestinations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Destination> getDestination(@PathVariable Long id) {
        Optional<Destination> destination = destinationService.getDestinationById(id);
        if (destination.isPresent()) {
            return ResponseEntity.ok(destination.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Destination> updateDestination(@PathVariable Long id, @RequestBody Destination destination) {
        // Fetch existing destination to preserve relationships
        Optional<Destination> existingDestinationOpt = destinationService.getDestinationById(id);
        if (!existingDestinationOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Destination existingDestination = existingDestinationOpt.get();
        destination.setDestinationId(id);

        // Preserve the itinerary relationship if not provided
        if (destination.getItinerary() == null) {
            destination.setItinerary(existingDestination.getItinerary());
        }

        // Preserve the activities collection to avoid orphan removal issue
        if (destination.getActivities() == null) {
            destination.setActivities(existingDestination.getActivities());
        }

        Destination updated = destinationService.saveDestination(destination);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDestination(@PathVariable Long id) {
        destinationService.deleteDestination(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/paged")
    public Page<Destination> getPaginatedDestinations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "destinationId") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return destinationService.getPaginatedDestinations(page, size, sortBy, direction);
    }
}
