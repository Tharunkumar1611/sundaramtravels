package com.examly.springapp.dto;

public class UserSummaryDTO {
    private Long userId;
    private String username;
    private int itineraryCount;
    private int destinationCount;
    private int activityCount;
    private int bookingCount;
    private int expenseCount;

    public UserSummaryDTO(Long userId, String username,
                          int itineraryCount, int destinationCount,
                          int activityCount, int bookingCount,
                          int expenseCount) {
        this.userId = userId;
        this.username = username;
        this.itineraryCount = itineraryCount;
        this.destinationCount = destinationCount;
        this.activityCount = activityCount;
        this.bookingCount = bookingCount;
        this.expenseCount = expenseCount;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getItineraryCount() {
        return itineraryCount;
    }

    public void setItineraryCount(int itineraryCount) {
        this.itineraryCount = itineraryCount;
    }

    public int getDestinationCount() {
        return destinationCount;
    }

    public void setDestinationCount(int destinationCount) {
        this.destinationCount = destinationCount;
    }

    public int getActivityCount() {
        return activityCount;
    }

    public void setActivityCount(int activityCount) {
        this.activityCount = activityCount;
    }

    public int getBookingCount() {
        return bookingCount;
    }

    public void setBookingCount(int bookingCount) {
        this.bookingCount = bookingCount;
    }

    public int getExpenseCount() {
        return expenseCount;
    }

    public void setExpenseCount(int expenseCount) {
        this.expenseCount = expenseCount;
    }
}
