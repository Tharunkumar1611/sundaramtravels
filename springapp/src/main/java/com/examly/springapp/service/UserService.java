package com.examly.springapp.service;

import com.examly.springapp.model.User;
import com.examly.springapp.dto.UserSummaryDTO;
import com.examly.springapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Summary repositories
    @Autowired
    private ItineraryRepository itineraryRepository;
    @Autowired
    private DestinationRepository destinationRepository;
    @Autowired
    private ActivityRepository activityRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private ExpenseRepository expenseRepository;

    public User addUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedDate(LocalDateTime.now());
        user.setRole("ADMIN");
        user.setIsActive(true);
        return repository.save(user);
    }

    public List<User> getAllUsers() {
        return repository.findAll().stream()
                .filter(user -> user.getRole() != null && "USER".equalsIgnoreCase(user.getRole()))
                .collect(Collectors.toList());
    }

    public Optional<User> getUserById(Long id) {
        return repository.findById(id);
    }

    public Optional<User> updateUser(Long id, User newUser) {
        return repository.findById(id).map(user -> {
            user.setUsername(newUser.getUsername());
            user.setEmail(newUser.getEmail());
            if (newUser.getPassword() != null && !newUser.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(newUser.getPassword()));
            }
            user.setRole(newUser.getRole());
            user.setLastLogin(newUser.getLastLogin());
            user.setIsActive(newUser.getIsActive());

            // Update additional profile fields
            if (newUser.getPhone() != null)
                user.setPhone(newUser.getPhone());
            if (newUser.getAddress() != null)
                user.setAddress(newUser.getAddress());
            if (newUser.getCity() != null)
                user.setCity(newUser.getCity());
            if (newUser.getState() != null)
                user.setState(newUser.getState());
            if (newUser.getCountry() != null)
                user.setCountry(newUser.getCountry());
            if (newUser.getStatus() != null)
                user.setStatus(newUser.getStatus());

            return repository.save(user);
        });
    }

    public void deleteUser(Long id) {
        repository.deleteById(id);
    }

    public User getUserByEmail(String email) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Set default role if null (for legacy users)
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
            repository.save(user);
        }

        return user;
    }

    public void updateLastLogin(Long userId) {
        repository.findById(userId).ifPresent(user -> {
            user.setLastLogin(LocalDateTime.now());
            repository.save(user);
        });
    }

    // --- Summary method for Admin Dashboard ---
    public List<UserSummaryDTO> getUserSummaries() {
        return repository.findAll().stream()
                .filter(user -> user.getRole() != null && "USER".equalsIgnoreCase(user.getRole()))
                .map(user -> {
                    Long userId = user.getId();
                    String username = user.getUsername();

                    int itineraryCount = itineraryRepository.countByUserId(userId);
                    int destinationCount = destinationRepository.countByUserId(userId);
                    int activityCount = activityRepository.countByUserId(userId);
                    int bookingCount = bookingRepository.countByUserId(userId);
                    int expenseCount = expenseRepository.countByUserId(userId);

                    return new UserSummaryDTO(userId, username, itineraryCount,
                            destinationCount, activityCount, bookingCount, expenseCount);
                })
                .collect(Collectors.toList());
    }

    public Page<User> getPaginatedUsers(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return repository.findAll(pageable);
    }

}
