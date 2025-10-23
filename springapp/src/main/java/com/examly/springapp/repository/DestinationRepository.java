package com.examly.springapp.repository;

import com.examly.springapp.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DestinationRepository extends JpaRepository<Destination, Long> {
    @Query("SELECT COUNT(d) FROM Destination d WHERE d.itinerary.user.id = :userId")
    int countByUserId(@Param("userId") Long userId);
}
