package com.examly.springapp.controller;

import com.examly.springapp.model.Activity;
import com.examly.springapp.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @PostMapping
    public Activity addActivity(@RequestBody Activity activity) {
        return activityService.saveActivity(activity);
    }

    @GetMapping
    public List<Activity> getAllActivities() {
        return activityService.getAllActivities();
    }

    @GetMapping("/{id}")
    public Optional<Activity> getActivity(@PathVariable Long id) {
        return activityService.getActivityById(id);
    }

    @PutMapping("/{id}")
    public Activity updateActivity(@PathVariable Long id, @RequestBody Activity activity) {
        // Fetch existing activity to preserve the destination relationship
        Optional<Activity> existingActivityOpt = activityService.getActivityById(id);
        if (!existingActivityOpt.isPresent()) {
            throw new RuntimeException("Activity not found with id: " + id);
        }

        Activity existingActivity = existingActivityOpt.get();
        activity.setActivityId(id);

        // If destination is not provided in the update, preserve the existing one
        if (activity.getDestination() == null || activity.getDestination().getDestinationId() == null) {
            activity.setDestination(existingActivity.getDestination());
        }

        return activityService.saveActivity(activity);
    }

    @DeleteMapping("/{id}")
    public void deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
    }

    @GetMapping("/paged")
    public Page<Activity> getPaginatedActivities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "activityId") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return activityService.getPaginatedActivities(page, size, sortBy, direction);
    }
}
