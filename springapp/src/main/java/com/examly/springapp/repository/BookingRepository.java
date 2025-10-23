package com.examly.springapp.repository;

import com.examly.springapp.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
      @Query("SELECT COUNT(b) FROM Booking b WHERE b.itinerary.user.id = :userId")
    int countByUserId(@Param("userId") Long userId);
}
