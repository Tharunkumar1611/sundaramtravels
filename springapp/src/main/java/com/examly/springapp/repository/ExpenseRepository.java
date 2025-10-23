package com.examly.springapp.repository;

import com.examly.springapp.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
        @Query("SELECT COUNT(e) FROM Expense e WHERE e.itinerary.user.id = :userId")
    int countByUserId(@Param("userId") Long userId);
}
