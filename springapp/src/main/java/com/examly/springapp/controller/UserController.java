// File: src/main/java/com/examly/springapp/controller/UserController.java

package com.examly.springapp.controller;

import com.examly.springapp.dto.UserSummaryDTO;
import com.examly.springapp.model.User;
import com.examly.springapp.service.UserService;
import com.examly.springapp.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public User addUser(@RequestBody User user) {
        return service.addUser(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return service.getUserById(id);
    }

    @PutMapping("/{id}")
    public Optional<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return service.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        service.deleteUser(id);
    }

    @GetMapping("/summary")
    public List<UserSummaryDTO> getUserSummaries() {
        return service.getUserSummaries();
    }

    // Get current user profile
    @GetMapping("/profile")
    public User getCurrentUserProfile(@RequestHeader("Authorization") String authHeader) {
        String jwt = authHeader.substring(7);
        String email = jwtUtil.extractEmail(jwt);
        return service.getUserByEmail(email);
    }

    // Update current user profile
    @PutMapping("/profile")
    public User updateCurrentUserProfile(@RequestHeader("Authorization") String authHeader,
            @RequestBody User updatedUser) {
        String jwt = authHeader.substring(7);
        String email = jwtUtil.extractEmail(jwt);
        User currentUser = service.getUserByEmail(email);
        return service.updateUser(currentUser.getId(), updatedUser).orElseThrow();
    }

    @GetMapping("/paged")
    public Page<User> getPaginatedUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return service.getPaginatedUsers(page, size, sortBy, direction);
    }
}
