package com.examly.springapp.repository;

import com.examly.springapp.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
public interface ActivityRepository extends JpaRepository<Activity, Long> {
     @Query("SELECT COUNT(a) FROM Activity a WHERE a.destination.itinerary.user.id = :userId")
    int countByUserId(@Param("userId") Long userId);
}
