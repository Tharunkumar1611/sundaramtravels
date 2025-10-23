package com.examly.springapp.service;

import com.examly.springapp.model.Booking;
import com.examly.springapp.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public Booking saveBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    public Booking updateBooking(Long id, Booking booking) {
        Booking existing = bookingRepository.findById(id).orElse(null);
        if (existing == null) {
            return null;
        }
        existing.setBookingType(booking.getBookingType());
        existing.setBookingReference(booking.getBookingReference());
        existing.setProviderName(booking.getProviderName());
        existing.setBookingDate(booking.getBookingDate());
        existing.setCost(booking.getCost());
        existing.setStatus(booking.getStatus());
        existing.setItinerary(booking.getItinerary());
        return bookingRepository.save(existing);
    }

    public Page<Booking> getPaginatedBookings(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return bookingRepository.findAll(pageable);
    }
}
