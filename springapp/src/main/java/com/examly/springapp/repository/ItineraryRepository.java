package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.examly.springapp.model.Itinerary;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ItineraryRepository extends JpaRepository<Itinerary, Long> {
    List<Itinerary> findByTripName(String tripName);
    List<Itinerary> findByStatus(Itinerary.Status status);
    List<Itinerary> findByUserId(Long userId);
        @Query("SELECT COUNT(i) FROM Itinerary i WHERE i.user.id = :userId")
    int countByUserId(@Param("userId") Long userId);
     
}
