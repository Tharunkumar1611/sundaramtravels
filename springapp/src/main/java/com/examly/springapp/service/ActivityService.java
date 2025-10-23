package com.examly.springapp.service;

import com.examly.springapp.model.Activity;
import com.examly.springapp.model.Destination;
import com.examly.springapp.repository.ActivityRepository;
import com.examly.springapp.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private DestinationRepository destinationRepository;

    public Activity saveActivity(Activity activity) {
        if (activity.getDestination() != null && activity.getDestination().getDestinationId() != null) {
            Optional<Destination> destinationOpt = destinationRepository.findById(activity.getDestination().getDestinationId());
            if (!destinationOpt.isPresent()) {
                throw new RuntimeException("Destination not found with id: " + activity.getDestination().getDestinationId());
            }
            activity.setDestination(destinationOpt.get());
        } else {
            throw new RuntimeException("Destination information is required");
        }
        return activityRepository.save(activity);
    }

    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    public Optional<Activity> getActivityById(Long id) {
        return activityRepository.findById(id);
    }

    public void deleteActivity(Long id) {
        activityRepository.deleteById(id);
    }
    public Page<Activity> getPaginatedActivities(int page, int size, String sortBy, String direction) {
    Sort sort = direction.equalsIgnoreCase("desc") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();
    Pageable pageable = PageRequest.of(page, size, sort);
    return activityRepository.findAll(pageable);
   }
}
